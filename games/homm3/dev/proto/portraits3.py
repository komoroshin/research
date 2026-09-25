# -*- coding: utf-8 -*-
"""js/view/sprites_portraits_{1..4}_hd.js — 44 портрета героев в сетке unit 3.

Портрет собирается одной частью Fig.portrait: фон фракции, плечи, шея, лицо
с радужкой и бровями, причёска, головной убор. Приметы классов — в таблице ниже.
Освещение плоское: портрет не шар, купол силуэта выключен.
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, write

PAINT = {'silDome': 0, 'rim': 0, 'ao': 0.08}

def mark(fn):
    return fn

# приметы, которые не покрывает общий конструктор
def scar(c, CX, CY, r):                       # шрам через бровь
    c.line(CX - r * 0.7, CY - r * 0.5, CX - r * 0.45, CY + r * 0.25, 'R')
def warpaint(c, CX, CY, r, col='r'):
    c.rect(CX - r * 0.9, CY + r * 0.16, CX - r * 0.35, CY + r * 0.3, col)
    c.rect(CX + r * 0.35, CY + r * 0.16, CX + r * 0.9, CY + r * 0.3, col)
def amulet(c, CX, CY, r, col='c'):
    c.ellipse(CX, CY + r * 2.0, r * 0.28, r * 0.28, col)
    c.rect(CX - r * 0.5, CY + r * 1.6, CX + r * 0.5, CY + r * 1.66, 'Y')
def goggles(c, CX, CY, r, col='y', on_eyes=False):
    y = CY - (0.02 if on_eyes else 0.75) * r
    c.rect(CX - r * 1.0, y - r * 0.2, CX + r * 1.0, y + r * 0.2, col)
    for s in (-1, 1): c.ellipse(CX + s * r * 0.45, y, r * 0.3, r * 0.26, 'c')
def earring(c, CX, CY, r):
    c.ellipse(CX + r * 1.05, CY + r * 0.36, r * 0.16, r * 0.16, 'y')
def eyepatch(c, CX, CY, r):
    c.ellipse(CX - r * 0.42, CY - r * 0.02, r * 0.3, r * 0.26, 'u')
    c.line(CX - r * 1.1, CY - r * 0.3, CX + r * 1.1, CY - r * 0.1, 'u')
def epaulets(c, CX, CY, r):
    for s in (-1, 1): c.ellipse(CX + s * r * 1.5, CY + r * 2.1, r * 0.5, r * 0.3, 'y')
def wreath(c, CX, CY, r):                      # венок из листьев
    for i in range(-3, 4):
        c.ellipse(CX + i * r * 0.32, CY - r * 0.86 - abs(i) * r * 0.06, r * 0.22, r * 0.14, 'g' if i % 2 else 'G')
def hornsmall(c, CX, CY, r):
    c.horns(CX, CY - r * 0.86, r * 0.8, 'I', 'i', spread=int(r * 0.85), curve=int(r * 0.3))
def fangs(c, CX, CY, r):
    c.rect(CX - r * 0.2, CY + r * 0.7, CX - r * 0.1, CY + r * 0.92, 'w')
    c.rect(CX + r * 0.1, CY + r * 0.7, CX + r * 0.2, CY + r * 0.92, 'w')
def crystalpads(c, CX, CY, r, col='c'):
    for s in (-1, 1):
        for i in range(3):
            c.poly([(CX + s * r * (1.2 + i * 0.28), CY + r * 2.3),
                    (CX + s * r * (1.35 + i * 0.28), CY + r * 1.5),
                    (CX + s * r * (1.5 + i * 0.28), CY + r * 2.3)], col if i % 2 else 'w')
def flamehair(c, CX, CY, r):
    c.flame(CX, CY - r * 0.7, r * 2.2, r * 1.6, 'f', 'F', 'O', 5)
def skullcap(c, CX, CY, r):                    # черепной шлем с клыками
    c.skull(CX, CY - r * 0.95, r * 0.8, 'i', 'L', 'I', jaw=False)
def elem(c, CX, CY, r):                        # огонь и вода у висков
    c.flame(CX - r * 1.25, CY - r * 0.2, r * 0.7, r * 0.9, 'f', 'F', 'O', 3)
    c.ellipse(CX + r * 1.25, CY - r * 0.5, r * 0.34, r * 0.4, 'c')
    c.ellipse(CX + r * 1.25, CY - r * 0.6, r * 0.2, r * 0.2, 'w')
def orbs(c, CX, CY, r):                        # шары земли и воздуха у плеч
    c.ellipse(CX - r * 1.5, CY + r * 1.8, r * 0.34, r * 0.34, 'T')
    c.ellipse(CX + r * 1.5, CY + r * 1.8, r * 0.34, r * 0.34, 'l')
def staffcrystal(c, CX, CY, r, col='c'):
    c.rect(CX + r * 1.5, CY - r * 0.6, CX + r * 1.66, CY + r * 2.6, 'N')
    c.ellipse(CX + r * 1.58, CY - r * 0.9, r * 0.36, r * 0.4, col)
def bowshoulder(c, CX, CY, r):                 # лук за плечом
    for i in range(9):
        t = i / 8
        c.put(CX - r * 1.5 + t * r * 0.3, CY + r * (0.6 + t * 1.8), 'N')
def necklace(c, CX, CY, r, col='i'):
    for i in range(-3, 4):
        c.ellipse(CX + i * r * 0.3, CY + r * (1.9 + abs(i) * 0.06), r * 0.13, r * 0.16, col)

# (класс, вариант, комментарий, параметры portrait, приметы)
P = []
def add(cls, v, comment, group, **kw):
    extras = kw.pop('extras', None)
    P.append((group, 'portrait_%s_%s' % (cls, v), comment, kw, extras))

# ---- группа 1: Замок, Оплот, Башня (фон B) ----
add('knight', 'a', 'Оррин, рыцарь: шлем с поднятым забралом, красный гребень, латы', 1,
    bg='B', skin='s', shade='S', eye='b', gear='helm', gcol='l', gdark='E', cloth='e', clothd='E',
    extras=[lambda c, x, y, r: c.ellipse(x, y - r * 1.6, r * 0.3, r * 0.5, 'r')])
add('knight', 'b', 'Валеска, рыцарь: светлые волосы назад, горжет, синий табард с крестом', 1,
    bg='B', skin='s', shade='S', hair='y', eye='b', cloth='b', clothd='B', collar='e',
    extras=[lambda c, x, y, r: c.rect(x - r * 0.2, y + r * 2.1, x + r * 0.16, y + r * 2.9, 'w')])
add('cleric', 'a', 'Адела, клирик: белый капюшон с золотой каймой, белая ряса', 1,
    bg='B', skin='s', shade='S', eye='c', gear='hood', gcol='w', gdark='l', cloth='w', clothd='l', collar='y')
add('cleric', 'b', 'Кейтлин, клирик: золотая митра, рыжие волосы, смуглая кожа, красная стола', 1,
    bg='B', skin='S', shade='T', hair='o', eye='n', gear='circlet', gcol='y', gdark='Y', cloth='r', clothd='R')
add('ranger', 'a', 'Кирре, рейнджер: зелёный капюшон, рыжая чёлка, кожаная туника, лук за плечом', 1,
    bg='B', skin='s', shade='S', hair='o', eye='g', gear='hood', gcol='G', gdark='j', cloth='n', clothd='N',
    extras=[bowshoulder])
add('ranger', 'b', 'Ивор, рейнджер: смуглый, борода, капюшон откинут, оливковая туника, лук', 1,
    bg='B', skin='S', shade='T', hair='N', beard='N', eye='n', cloth='H', clothd='j', extras=[bowshoulder])
add('druid', 'a', 'Мефала, друид: венок из листьев, каштановые волосы, оливковая накидка', 1,
    bg='B', skin='s', shade='S', hair='n', eye='g', cloth='H', clothd='j', extras=[wreath])
add('druid', 'b', 'Уланд, друид: лысый старик, седая борода до груди, венок', 1,
    bg='B', skin='S', shade='T', beard='l', eye='g', cloth='H', clothd='j', extras=[wreath])
add('alchemist', 'a', 'Нила, алхимик: волосы пучком, медные гогглы на глазах, кожаный фартук', 1,
    bg='B', skin='s', shade='S', hair='N', eye='n', cloth='n', clothd='N',
    extras=[lambda c, x, y, r: goggles(c, x, y, r, 'O', True),
            lambda c, x, y, r: c.ellipse(x, y - r * 1.4, r * 0.4, r * 0.34, 'N')])
add('alchemist', 'b', 'Тейн, алхимик: лысый, круглые очки, седая бородка, фартук', 1,
    bg='B', skin='S', shade='T', beard='l', eye='b', cloth='n', clothd='N',
    extras=[lambda c, x, y, r: goggles(c, x, y, r, 'Y', True)])
add('wizard', 'a', 'Солмир, маг: синий колпак со звёздами, тёмная борода, синяя мантия', 1,
    bg='B', skin='s', shade='S', beard='N', eye='b', gear='hat', gcol='b', gdark='B', cloth='b', clothd='B',
    extras=[lambda c, x, y, r: (c.ellipse(x - r * 0.2, y - r * 1.6, r * 0.2, r * 0.2, 'y'),
                                c.ellipse(x + r * 0.1, y - r * 2.2, r * 0.16, r * 0.16, 'y'))])
add('wizard', 'b', 'Халон, маг: тёмная кожа, белая борода, широкий колпак с голубой лентой', 1,
    bg='B', skin='T', shade='N', beard='w', eye='c', gear='wide', gcol='b', gdark='B', cloth='b', clothd='B')

# ---- группа 2: Инферно, Некрополь, Подземелье (фон R/P/Q) ----
add('demoniac', 'a', 'Фиона, демонолог: красная кожа, чёрные волосы, костяные рожки, огненные глаза', 2,
    bg='R', skin='r', shade='R', hair='z', eye='f', cloth='R', clothd='D', extras=[hornsmall])
add('demoniac', 'b', 'Рашка, демонолог: лысый, оранжевая кожа, большие рога, козлиная бородка', 2,
    bg='R', skin='o', shade='O', beard='D', eye='f', gear='horns', gcol='i', gdark='I', cloth='R', clothd='D')
add('heretic', 'a', 'Ксайрон, еретик: стальной капюшон, седая борода, горящие глаза', 2,
    bg='R', skin='S', shade='T', beard='l', eye='f', gear='hood', gcol='e', gdark='E', cloth='e', clothd='E')
add('heretic', 'b', 'Эш, еретик: бурый капюшон, бледный юноша, огненные глаза, амулет', 2,
    bg='R', skin='s', shade='S', eye='f', gear='hood', gcol='n', gdark='N', cloth='n', clothd='N',
    extras=[lambda c, x, y, r: amulet(c, x, y, r, 'F')])
add('deathknight', 'a', 'Исра, рыцарь смерти: чёрный шлем с поднятым забралом, красный плюмаж, бледное лицо', 2,
    bg='P', skin='L', shade='l', eye='b', gear='helm', gcol='u', gdark='z', cloth='u', clothd='z',
    extras=[lambda c, x, y, r: c.ellipse(x, y - r * 1.6, r * 0.3, r * 0.5, 'r')])
add('deathknight', 'b', 'Вокиал, рыцарь смерти: рогатый шлем, серое лицо вампира, красные глаза, клыки', 2,
    bg='P', skin='l', shade='e', eye='r', gear='helm', gcol='E', gdark='u', cloth='u', clothd='z',
    extras=[hornsmall, fangs])
add('necromancer', 'a', 'Видомина, некромантка: тёмный капюшон с зелёным свечением, белое лицо, чёрные пряди', 2,
    bg='P', skin='L', shade='l', hair='z', eye='h', gear='hood', gcol='u', gdark='z', cloth='u', clothd='z',
    extras=[lambda c, x, y, r: amulet(c, x, y, r, 'h')])
add('necromancer', 'b', 'Тант, некромант: пурпурный капюшон, серое лицо, седая борода, зелёные глаза', 2,
    bg='P', skin='l', shade='e', beard='l', eye='h', gear='hood', gcol='p', gdark='P', cloth='p', clothd='P')
add('overlord', 'a', 'Гуннар, владыка: лысый, чёрная борода, шрам, латы с шипами', 2,
    bg='Q', skin='S', shade='T', beard='z', eye='b', cloth='u', clothd='z', collar='E', extras=[scar])
add('overlord', 'b', 'Шакти, владыка: тёмная кожа, чёрные волосы назад, красная раскраска, стальные шипы', 2,
    bg='Q', skin='T', shade='N', hair='z', eye='y', cloth='u', clothd='z', collar='E',
    extras=[lambda c, x, y, r: warpaint(c, x, y, r, 'r')])
add('warlock', 'a', 'Аламар, чернокнижник: лиловый капюшон, бледное лицо, седая борода, амулет', 2,
    bg='Q', skin='s', shade='S', beard='l', eye='p', gear='hood', gcol='p', gdark='P', cloth='p', clothd='P',
    extras=[lambda c, x, y, r: amulet(c, x, y, r, 'A')])
add('warlock', 'b', 'Димер, чернокнижник: сиреневый капюшон, чёрная чёлка, светлая кожа', 2,
    bg='Q', skin='s', shade='S', hair='z', eye='a', gear='hood', gcol='a', gdark='p', cloth='p', clothd='P')

# ---- группа 3: Цитадель, Крепость, Сопряжение (фон N) ----
add('barbarian', 'a', 'Крэг Хак, варвар: загорелый, волчья шапка, чёрные усы, шрам, меховая накидка', 3,
    bg='N', skin='S', shade='T', beard='z', eye='b', gear='hood', gcol='e', gdark='E', cloth='N', clothd='D',
    extras=[scar])
add('barbarian', 'b', 'Гретчин, варвар: рыжая, рогатый шлем, раскраска, костяное ожерелье', 3,
    bg='N', skin='s', shade='S', hair='o', eye='g', gear='helm', gcol='e', gdark='E', cloth='N', clothd='D',
    extras=[hornsmall, lambda c, x, y, r: warpaint(c, x, y, r, 'b'), necklace])
add('battlemage', 'a', 'Гундула, боевой маг: смуглая, черепной шлем с клыками, косы, красная раскраска', 3,
    bg='N', skin='S', shade='T', hair='N', eye='y', cloth='u', clothd='z',
    extras=[skullcap, lambda c, x, y, r: warpaint(c, x, y, r, 'r')])
add('battlemage', 'b', 'Десса, боевой маг: седая, череп с рогами на голове, синяя полоса, синий плащ', 3,
    bg='N', skin='s', shade='S', hair='l', eye='b', cloth='b', clothd='B',
    extras=[skullcap, hornsmall, lambda c, x, y, r: warpaint(c, x, y, r, 'b')])
add('beastmaster', 'a', 'Тазар, повелитель зверей: чёрная борода, шапка-крокодил с зубами, кожаная куртка', 3,
    bg='N', skin='S', shade='T', beard='z', eye='n', gear='hood', gcol='G', gdark='j', cloth='n', clothd='N',
    extras=[lambda c, x, y, r: [c.rect(x - r * 1.0 + i * r * 0.3, y - r * 0.62, x - r * 0.9 + i * r * 0.3, y - r * 0.42, 'i') for i in range(7)]])
add('beastmaster', 'b', 'Вистан, повелитель зверей: ящер, зелёная чешуя, жёлтые глаза, капюшон из шкуры', 3,
    bg='N', skin='g', shade='G', eye='y', gear='hood', gcol='n', gdark='N', cloth='n', clothd='N',
    extras=[lambda c, x, y, r: c.scales(x - r, y - r * 0.4, x + r, y + r * 1.0, 'h', 4, only='gG')])
add('witch', 'a', 'Мирланда, ведьма: зеленоватая кожа, чёрные волосы, пурпурная мантия, посох с кристаллом', 3,
    bg='N', skin='h', shade='H', hair='z', eye='p', cloth='p', clothd='P', extras=[staffcrystal])
add('witch', 'b', 'Стиг, ведьма: старик, седая борода, зелёный капюшон, посох с огоньком', 3,
    bg='N', skin='S', shade='T', beard='l', eye='g', gear='hood', gcol='G', gdark='j', cloth='G', clothd='j',
    extras=[lambda c, x, y, r: staffcrystal(c, x, y, r, 'f')])
add('planeswalker', 'a', 'Пасис, странник миров: смуглый, тёмные волосы, кристальный обруч, голубые наплечники', 3,
    bg='N', skin='S', shade='T', hair='N', eye='c', gear='circlet', gcol='c', gdark='C', cloth='c', clothd='C',
    extras=[lambda c, x, y, r: crystalpads(c, x, y, r, 'c')])
add('planeswalker', 'b', 'Тунар, странник миров: седой старик, кристальная тиара, мятная броня', 3,
    bg='N', skin='s', shade='S', beard='l', hair='l', eye='v', gear='circlet', gcol='v', gdark='q', cloth='v', clothd='q',
    extras=[lambda c, x, y, r: crystalpads(c, x, y, r, 'v')])
add('elementalist', 'a', 'Эрдамон, элементалист: темнокожий, белые волосы и борода, огонь и вода у висков', 3,
    bg='N', skin='T', shade='N', hair='w', beard='w', eye='c', cloth='T', clothd='N', extras=[elem])
add('elementalist', 'b', 'Игнисса, элементалист: волосы-пламя, синяя мантия воды, шары земли и воздуха', 3,
    bg='N', skin='s', shade='S', eye='f', cloth='b', clothd='B', extras=[flamehair, orbs])

# ---- группа 4: Бухта, Фабрика (фон C) ----
add('captain', 'a', 'Коркес: седой капитан, чёрная треуголка с золотым кантом, синий мундир с эполетами', 4,
    bg='C', skin='S', shade='T', beard='l', eye='b', gear='tricorn', gcol='u', gdark='y', cloth='b', clothd='B',
    extras=[epaulets])
add('captain', 'b', 'Иллор: молодой капитан, чёрные волосы, повязка на глазу, коричневая треуголка, красный мундир', 4,
    bg='C', skin='s', shade='S', hair='z', eye='n', gear='tricorn', gcol='N', gdark='n', cloth='r', clothd='R',
    extras=[eyepatch, epaulets])
add('navigator', 'a', 'Касметра: темнокожий навигатор, синяя бандана, косы, золотая серьга, кожаный жилет', 4,
    bg='C', skin='T', shade='N', hair='z', eye='n', gear='bandana', gcol='b', gdark='B', cloth='N', clothd='D',
    extras=[earring])
add('navigator', 'b', 'Анабель: рыжая женщина-навигатор, синяя бандана, зелёный жилет, серьга', 4,
    bg='C', skin='s', shade='S', hair='o', eye='g', gear='bandana', gcol='b', gdark='B', cloth='G', clothd='j',
    extras=[earring])
add('mercenary', 'a', 'Зиф: смуглый наёмник со шрамом, коричневая шляпа, красный платок', 4,
    bg='C', skin='S', shade='T', eye='n', gear='wide', gcol='n', gdark='N', cloth='r', clothd='R', collar='r',
    extras=[scar])
add('mercenary', 'b', 'Тарк: лысый наёмник с чёрной бородкой, бурая шляпа с красной лентой, жёлтый платок', 4,
    bg='C', skin='S', shade='T', beard='z', eye='n', gear='wide', gcol='N', gdark='r', cloth='y', clothd='Y', collar='y')
add('artificer', 'a', 'Уинона: женщина-инженер, пучок, гогглы на лбу, кожаный фартук, медный наплечник', 4,
    bg='C', skin='s', shade='S', hair='n', eye='c', cloth='n', clothd='N',
    extras=[lambda c, x, y, r: goggles(c, x, y, r, 'y'),
            lambda c, x, y, r: c.ellipse(x - r * 1.5, y + r * 2.0, r * 0.5, r * 0.3, 'O')])
add('artificer', 'b', 'Агар: пожилой лысый инженер, седые усы, гогглы на лбу, медные наплечники', 4,
    bg='C', skin='S', shade='T', beard='l', eye='b', cloth='n', clothd='N',
    extras=[lambda c, x, y, r: goggles(c, x, y, r, 'y'),
            lambda c, x, y, r: [c.ellipse(x + s * r * 1.5, y + r * 2.0, r * 0.5, r * 0.3, 'O') for s in (-1, 1)]])

# ---- Улей: хитиновые наплечники, фасеточные вставки, усики в венце ----
def feelers(c, CX, CY, r):                    # усики над головой
    c.antennae(CX, CY - r * 1.15, r * 0.9, 'j', spread=int(r * 0.35))

def chitin_pauldrons(c, CX, CY, r):           # хитиновые наплечники
    for s in (-1, 1):
        c.ellipse(CX + s * r * 1.45, CY + r * 1.95, r * 0.62, r * 0.4, 'H')
        c.ellipse(CX + s * r * 1.45, CY + r * 1.85, r * 0.5, r * 0.28, 'h')

add('swarmlord', 'a', 'Зурр, роевод: бритая голова, хитиновая маска-жвалы, наплечники', 4,
    bg='C', skin='S', shade='T', eye='h', cloth='H', clothd='j', collar='j',
    extras=[feelers, chitin_pauldrons,
            lambda c, x, y, r: c.mandibles(x + r * 0.2, y + r * 0.5, r * 0.55, 'j', 'D')])
add('swarmlord', 'b', 'Ктаа, роевод: тёмная кожа, шлем-панцирь с гребнем, янтарный глаз', 4,
    bg='C', skin='T', shade='N', beard='z', eye='f', gear='helm', gcol='H', gdark='j', cloth='j', clothd='G',
    extras=[feelers, chitin_pauldrons])
add('pheromancer', 'a', 'Мелисса, феромант: рыжие волосы, венец из усиков, янтарное ожерелье', 4,
    bg='C', skin='s', shade='S', hair='O', eye='h', cloth='f', clothd='O', collar='y',
    extras=[feelers, lambda c, x, y, r: amulet(c, x, y, r, 'f')])
add('pheromancer', 'b', 'Вирра, феромант: бледная кожа, капюшон с хитиновой каймой, фасеточная линза', 4,
    bg='C', skin='i', shade='S', eye='h', gear='hood', gcol='j', gdark='G', cloth='H', clothd='j',
    extras=[feelers, lambda c, x, y, r: c.compound_eye(x + r * 0.45, y - r * 0.1, r * 0.3, r * 0.26, 'h', 'w', 'G')])

# ---- Бастион: капюшоны, меховые воротники, тотемная раскраска ----
def fur_collar(c, CX, CY, r):
    for s in (-1, 1):
        c.ellipse(CX + s * r * 1.3, CY + r * 1.9, r * 0.75, r * 0.45, 'n')
    c.fur(CX - r * 2.0, CY + r * 1.5, CX + r * 2.0, CY + r * 2.3, 'N', step=3, length=5)

add('huntsman', 'a', 'Ольд, егерь: седая борода, зелёный капюшон, меховой воротник', 4,
    bg='C', skin='S', shade='T', beard='l', eye='n', gear='hood', gcol='j', gdark='G', cloth='n', clothd='N',
    extras=[fur_collar])
add('huntsman', 'b', 'Брана, егерь: рыжая коса, кожаная повязка, шрам, меховой воротник', 4,
    bg='C', skin='s', shade='S', hair='O', eye='g', gear='bandana', gcol='N', gdark='D', cloth='H', clothd='j',
    extras=[fur_collar, scar])
add('totemist', 'a', 'Ивка, тотемист: тёмные волосы, тотемная раскраска, ожерелье из когтей', 4,
    bg='C', skin='s', shade='S', hair='D', eye='g', cloth='T', clothd='N', collar='n',
    extras=[lambda c, x, y, r: warpaint(c, x, y, r, 'G'), lambda c, x, y, r: amulet(c, x, y, r, 'i')])
add('totemist', 'b', 'Марр, тотемист: старик с оленьими рогами на капюшоне, посох', 4,
    bg='C', skin='T', shade='N', beard='l', eye='y', gear='hood', gcol='N', gdark='D', cloth='G', clothd='j',
    extras=[lambda c, x, y, r: c.horns(x, y - r * 0.95, r * 1.2, 'i', 'w', spread=int(r * 0.9), curve=int(r * 0.5))])

TITLES = {1: 'портреты героев (Замок, Оплот, Башня)', 2: 'портреты героев (Инферно, Некрополь, Подземелье)',
          3: 'портреты героев (Цитадель, Крепость, Сопряжение)', 4: 'портреты героев (Бухта, Фабрика, Улей, Бастион)'}
for g in (1, 2, 3, 4):
    blocks = []
    for grp, name, comment, kw, extras in P:
        if grp != g: continue
        c = Fig(72, 72)
        c.portrait(extras=extras, **kw)
        blocks.append(emit(name, c, comment, paint=PAINT, tight=True))
    write('portraits_%d' % g, TITLES[g], blocks, 'portraits3.py')
