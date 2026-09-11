"""Стратегии диспетчеризации BESS для бэктеста на ценах day-ahead OMIE.

Батарея по умолчанию: 10 МВт / 20 МВтч (2 ч), КПД round-trip 88 % (η_c = η_d = √0,88), ≤ 1,5 цикла/день.
Все расчёты — на единой 15-минутной сетке (часовые дни до 30.09.2025 развёрнуты в 4 одинаковых блока).

Стратегии:
  naive            — заряд на полной мощности в окне 12:00–16:00 до заполнения, разряд в окне 19:00–23:00 до опустошения.
  perfect          — MILP-оптимум на известных ценах дня (верхняя граница). Солвер HiGHS через scipy.optimize.milp.
  realistic        — тот же MILP на прогнозе цен D-1, исполнение и оценка по факту.
Ограничения гибкого доступа задаются масками: no_discharge[t] / no_charge[t].
"""
from __future__ import annotations

import dataclasses
import numpy as np
from scipy.optimize import milp, LinearConstraint, Bounds
from scipy.sparse import lil_matrix

DT = 0.25  # ч, шаг сетки


@dataclasses.dataclass
class Battery:
    p_mw: float = 10.0
    e_mwh: float = 20.0
    rte: float = 0.88
    cycles_per_day: float = 1.5
    deg_cost: float = 0.5  # €/МВтч разряда — маленький штраф, чтобы не гонять энергию впустую (допущение)

    @property
    def eta(self) -> float:
        return float(np.sqrt(self.rte))


def naive_schedule(prices: np.ndarray, tod: np.ndarray, bat: Battery, two_cycle: bool = False) -> np.ndarray:
    """Возвращает сетевую мощность по интервалам (+ разряд, − заряд), МВт."""
    T = len(prices)
    eta = bat.eta
    soc = 0.0
    net = np.zeros(T)
    windows = [((12, 16), (19, 23))]
    if two_cycle:
        windows = [((2, 5), (7, 9)), ((12, 16), (19, 23))]
    thr = 0.0
    for (c0, c1), (d0, d1) in windows:
        for t in range(T):
            h = tod[t]
            if c0 <= h < c1 and soc < bat.e_mwh - 1e-9:
                c = min(bat.p_mw, (bat.e_mwh - soc) / (eta * DT))
                soc += c * eta * DT
                net[t] = -c
            elif d0 <= h < d1 and soc > 1e-9 and thr < bat.cycles_per_day * bat.e_mwh - 1e-9:
                d = min(bat.p_mw, soc * eta / DT, (bat.cycles_per_day * bat.e_mwh - thr) * eta / DT)
                soc -= d / eta * DT
                thr += d / eta * DT
                net[t] = d
    return net


def milp_schedule(prices: np.ndarray, bat: Battery, no_discharge=None, no_charge=None,
                  soc0: float = 0.0, return_info: bool = False):
    """MILP: max Σ p_t (d_t − c_t) dt − deg·d_t·dt.
    Переменные: c[0:T], d[T:2T], soc[2T:3T], z[3T:4T] (бинарный режим: 1 = заряд разрешён, 0 = разряд разрешён)."""
    T = len(prices)
    eta = bat.eta
    n = 4 * T
    cost = np.zeros(n)
    cost[0:T] = prices * DT            # заряд — платим
    cost[T:2 * T] = -(prices - bat.deg_cost) * DT  # разряд — получаем (минимизируем минус)
    lb = np.zeros(n); ub = np.zeros(n)
    ub[0:T] = bat.p_mw; ub[T:2 * T] = bat.p_mw; ub[2 * T:3 * T] = bat.e_mwh; ub[3 * T:4 * T] = 1
    if no_discharge is not None:
        ub[T:2 * T][np.asarray(no_discharge, bool)] = 0
    if no_charge is not None:
        ub[0:T][np.asarray(no_charge, bool)] = 0
    integrality = np.zeros(n); integrality[3 * T:4 * T] = 1

    rows = []
    A = lil_matrix((T + 2 * T + 1, n)); lo = np.zeros(T + 2 * T + 1); hi = np.zeros(T + 2 * T + 1)
    r = 0
    # баланс SoC: soc_t − soc_{t−1} − η c_t dt + d_t dt/η = 0 (soc_{-1} = soc0)
    for t in range(T):
        A[r, 2 * T + t] = 1
        if t > 0:
            A[r, 2 * T + t - 1] = -1
        A[r, t] = -eta * DT
        A[r, T + t] = DT / eta
        lo[r] = hi[r] = soc0 if t == 0 else 0.0
        r += 1
    # взаимоисключение: c_t − P z_t ≤ 0 ; d_t + P z_t ≤ P
    for t in range(T):
        A[r, t] = 1; A[r, 3 * T + t] = -bat.p_mw; lo[r] = -np.inf; hi[r] = 0; r += 1
        A[r, T + t] = 1; A[r, 3 * T + t] = bat.p_mw; lo[r] = -np.inf; hi[r] = bat.p_mw; r += 1
    # лимит циклов: Σ d_t dt/η ≤ cycles·E
    for t in range(T):
        A[r, T + t] = DT / eta
    lo[r] = -np.inf; hi[r] = bat.cycles_per_day * bat.e_mwh
    res = milp(cost, constraints=LinearConstraint(A.tocsr(), lo, hi), integrality=integrality,
               bounds=Bounds(lb, ub), options={"time_limit": 60})
    if res.x is None:
        net = np.zeros(T)
        return (net, res) if return_info else net
    x = res.x
    net = x[T:2 * T] - x[0:T]
    return (net, res) if return_info else net


def revenue(net: np.ndarray, prices: np.ndarray) -> float:
    return float(np.sum(net * prices * DT))
