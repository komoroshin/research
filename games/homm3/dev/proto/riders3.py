# -*- coding: utf-8 -*-
"""js/view/sprites_heroes_{1,2,3}_hd.js — 22 всадника на карте в сетке unit 3.

Всадник = скакун + попона в цвете игрока (буквы b/B, их перекрашивает Sp.teamTint)
+ торс + головной убор + оружие. Скакун бывает конём, костяком, ящером и машиной.
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from parts3 import Fig
from emit3 import emit, write

def mount(c, kind, mid, light, dark, mane=None):
    """Скакун. Конь — общей частью, остальные поверх её геометрии."""
    if kind == 'horse':
        c.horse(33, 46, 46, 24, mid, light, dark, mane=mane, head_left=True)
    elif kind == 'bone':                                   # костяной конь: рёбра и череп
        c.horse(33, 46, 46, 24, 'I', 'i', 'u', mane=None)
        c.ribcage(30, 46, 26, 18, 'i', 'I', n=5)
        c.ellipse(11, 33, 6, 5, 'i'); c.ellipse(8, 34, 3, 2.4, 'k')
        c.rect(6, 36, 14, 38, 'I')
    elif kind == 'lizard':                                 # ящер: гребень вместо гривы, чешуя
        c.horse(33, 46, 46, 24, mid, light, dark, mane=None)
        c.scales(12, 36, 54, 56, light, 4, only=mid)
        for i in range(7):
            c.poly([(16 + i * 5, 34), (18 + i * 5, 27), (20 + i * 5, 34)], dark)
        c.rect(6, 36, 14, 38, dark)
        for x in range(7, 14, 2): c.rect(x, 36, x + 1, 38, 'i')
    elif kind == 'beetle':                                 # ездовой жук: панцирь, шесть лап, жвалы
        c.chitin(34, 50, 30, 17, mid, light, dark, seg=4)  # панцирь во всю длину скакуна
        c.line(34, 34, 34, 66, dark, 2)                    # шов надкрылий
        c.insect_legs(34, 50, 68, mid, dark, pairs=3, span=38)
        c.chitin(10, 44, 11, 10, dark, mid, 'D', seg=2)    # голова впереди (скакун смотрит влево)
        c.compound_eye(5, 41, 3.4, 3, 'k', 'y')
        for sgn in (-1, 1):                                # жвалы
            c.line(4, 46 + sgn * 3, 0, 46 + sgn * 6, 'D', 2)
        c.poly([(9, 35), (2, 24), (13, 34)], 'i')          # рог
    elif kind == 'stag':                                   # олень: конское тело, ветвистые рога
        c.horse(33, 46, 46, 24, mid, light, dark, mane=None)
        for sgn in (-1, 1):
            bx = 10 + (4 if sgn > 0 else 0)
            c.line(bx, 22, bx - 4 * sgn, 6, 'i', 2)
            for dy, dx in ((14, 6), (8, 7)):
                c.line(bx - 4 * sgn * (1 - dy / 16.0), 6 + dy, bx - 4 * sgn * (1 - dy / 16.0) + dx * sgn, dy, 'i', 2)
    elif kind == 'mech':                                   # механический конь: трубa, пар, поршни
        c.horse(33, 46, 46, 24, mid, light, dark, mane=None)
        for x in range(16, 50, 6): c.rect(x, 38, x + 1, 54, dark)
        c.rivets(16, 42, 50, light, 7)
        c.rect(38, 24, 43, 34, 'E')
        for i in range(3): c.ellipse(41 + i * 2, 20 - i * 4, 4 + i, 3 + i * 0.6, 'l')

def rider(c, body, bodyd, gear, gcol, gdark, weapon, wcol='l', skin='S', hair=None, beard=None, cape=None):
    RX = 34
    if cape:
        c.poly([(RX - 10, 14), (RX + 4, 14), (RX + 12, 44), (RX - 12, 44)], cape[1])
        c.poly([(RX - 10, 14), (RX - 2, 14), (RX + 2, 44), (RX - 12, 44)], cape[0])
    c.poly([(RX - 14, 34), (RX + 10, 34), (RX + 12, 54), (RX - 14, 54)], 'b')     # попона в цвете игрока
    c.rect(RX - 13, 35, RX + 9, 52, 'b'); c.folds(RX - 12, 36, RX + 8, 52, 'B', 3)
    for x in range(RX - 13, RX + 10, 5): c.ellipse(x, 54, 2.2, 2.4, 'B')
    c.rect(RX - 8, 14, RX + 8, 34, body); c.rect(RX - 8, 14, RX - 5, 34, bodyd)
    c.rect(RX + 5, 14, RX + 8, 34, bodyd)
    c.pauldrons(RX, 14, 11, body, bodyd, bodyd, lames=2)
    c.rect(RX - 9, 32, RX + 9, 36, bodyd)
    c.ellipse(RX, 6, 7.5, 8, skin)
    if hair: c.ellipse(RX, 1, 8, 5, hair)
    if beard: c.ellipse(RX, 11, 5.5, 4, beard)
    c.ellipse(RX - 3, 6, 2.2, 2, 'k'); c.ellipse(RX + 3, 6, 2.2, 2, 'k')
    if gear == 'helm':
        c.helm(RX, 3, 8, gcol, 'l' if gcol != 'l' else 'w', gdark, kind='great', crest=None)
    elif gear == 'hood':
        c.hood(RX, 3, 8, gcol, gdark, inner='u')
    elif gear == 'hat':
        c.poly([(RX - 11, 2), (RX + 11, 2), (RX + 1, -16)], gdark)
        c.poly([(RX - 9, 1), (RX + 8, 1), (RX + 1, -13)], gcol)
        c.rect(RX - 12, 1, RX + 12, 4, gdark)
    elif gear == 'wide':
        c.rect(RX - 14, 0, RX + 14, 3, gdark)
        c.poly([(RX - 9, 0), (RX + 9, 0), (RX + 7, -9), (RX - 7, -9)], gcol)
    elif gear == 'tricorn':
        c.poly([(RX - 14, 1), (RX + 14, 1), (RX + 7, -10), (RX - 7, -10)], gcol)
        c.rect(RX - 14, 1, RX + 14, 4, gdark)
    elif gear == 'fur':
        c.ellipse(RX, 0, 10, 6, gcol); c.fur(RX - 9, -3, RX + 9, 6, gdark, step=3, length=7)
    elif gear == 'skull':
        c.skull(RX, 2, 7, 'i', 'L', 'I', horns=True, jaw=False)
    elif gear == 'crystal':
        c.ellipse(RX, 0, 9, 5, gcol)
        for i in range(-2, 3): c.poly([(RX + i * 4 - 1, 0), (RX + i * 4, -7), (RX + i * 4 + 1, 0)], 'w')
    WX = RX + 14
    if weapon == 'sword':
        c.sword(WX, -14, 22, wcol, 'w', 'e', 'y', 'n', 'N')
    elif weapon == 'axe':
        c.rect(WX - 1, -10, WX + 1, 28, 'N')
        c.poly([(WX - 9, -12), (WX, -18), (WX + 1, -2), (WX - 8, 0)], 'e')
        c.poly([(WX - 8, -11), (WX - 1, -16), (WX - 1, -4), (WX - 7, -2)], 'l')
    elif weapon == 'staff':
        c.rect(WX - 1, -14, WX + 1, 34, 'N'); c.rect(WX - 1, -14, WX - 1, 34, 'n')
        c.ellipse(WX, -18, 5, 5.5, wcol); c.ellipse(WX - 1, -20, 3, 3, 'w')
    elif weapon == 'spear':
        c.spear(WX, -20, 32, 'n', 'N', 'l', 'e', blade_len=11)
    elif weapon == 'mace':
        c.rect(WX - 1, -6, WX + 1, 28, 'N')
        c.ellipse(WX, -12, 6, 6.5, 'E')
        for a in range(6): c.poly([(WX - 6 + a * 2.4, -12), (WX - 6 + a * 2.4, -19), (WX - 4 + a * 2.4, -12)], 'e')
    elif weapon == 'gun':
        c.rect(WX - 2, 6, WX + 2, 22, 'N')
        c.rect(WX - 1, -14, WX + 1, 8, 'E'); c.rect(WX - 1, -14, WX - 1, 8, 'e')
    elif weapon == 'wrench':
        c.rect(WX - 2, -8, WX + 2, 24, 'e')
        c.poly([(WX - 6, -8), (WX - 6, -16), (WX - 3, -16), (WX - 3, -12), (WX + 3, -12), (WX + 3, -16), (WX + 6, -16), (WX + 6, -8)], 'l')
    elif weapon == 'spyglass':
        c.rect(WX - 2, -2, WX + 14, 3, 'N'); c.rect(WX + 10, -3, WX + 15, 4, 'y')
    elif weapon == 'flame':
        c.flame(WX + 2, 4, 12, 16, 'f', 'F', 'O', 4)
    elif weapon == 'orbs':
        for i, col in enumerate(('F', 'c', 'T')):
            c.ellipse(WX + 2 + (i % 2) * 6, -12 + i * 8, 4, 4, col)

# (файл, имя, комментарий, скакун, всадник)
R = [
 (1, 'hero_knight', 'рыцарь: гнедой конь, латы, шлем, поднятый меч',
  ('horse', 'n', 'T', 'N', 'N'), dict(body='e', bodyd='E', gear='helm', gcol='e', gdark='E', weapon='sword')),
 (1, 'hero_cleric', 'клирик: гнедой конь, белая ряса, митра, посох с крестом',
  ('horse', 'n', 'T', 'N', 'N'), dict(body='w', bodyd='l', gear='crystal', gcol='y', gdark='Y', weapon='staff', wcol='y')),
 (1, 'hero_ranger', 'следопыт: серый конь, зелёный капюшон, кожаная куртка, лук',
  ('horse', 'e', 'l', 'E', 'E'), dict(body='n', bodyd='N', gear='hood', gcol='G', gdark='j', weapon='spear')),
 (1, 'hero_druid', 'друид: серый конь, песочная ряса, венок, седая борода, посох',
  ('horse', 'e', 'l', 'E', 'E'), dict(body='T', bodyd='N', gear='crystal', gcol='G', gdark='j', weapon='staff', wcol='h', beard='l')),
 (1, 'hero_alchemist', 'алхимик: серый конь, графитовый сюртук, фартук, гогглы, колба',
  ('horse', 'e', 'l', 'E', 'E'), dict(body='u', bodyd='z', gear='helm', gcol='O', gdark='N', weapon='staff', wcol='h')),
 (1, 'hero_wizard', 'волшебник: белый конь, синяя мантия и колпак, седая борода, посох с шаром',
  ('horse', 'l', 'w', 'e', 'e'), dict(body='b', bodyd='B', gear='hat', gcol='b', gdark='B', weapon='staff', wcol='c', beard='l')),
 (1, 'hero_demoniac', 'демонолог: чёрный конь с огненной гривой, рога, тёмные латы, пылающий клинок',
  ('horse', 'u', 'E', 'z', 'F'), dict(body='R', bodyd='D', gear='skull', gcol='i', gdark='I', weapon='sword', wcol='F', skin='r')),
 (1, 'hero_heretic', 'еретик: чёрный конь с огненной гривой, тёмный капюшон, багровая ряса, огонь в руке',
  ('horse', 'u', 'E', 'z', 'F'), dict(body='R', bodyd='D', gear='hood', gcol='u', gdark='z', weapon='flame')),
 (2, 'hero_deathknight', 'рыцарь смерти: чёрный конь, чёрные латы, алый плюмаж, меч',
  ('horse', 'u', 'E', 'z', 'z'), dict(body='u', bodyd='z', gear='helm', gcol='u', gdark='z', weapon='sword', skin='L', cape=('r', 'R'))),
 (2, 'hero_necromancer', 'некромант: костяной конь, графитовый капюшон, бледное лицо, посох с зелёным шаром',
  ('bone', 'i', 'L', 'I', None), dict(body='u', bodyd='z', gear='hood', gcol='u', gdark='z', weapon='staff', wcol='h', skin='L')),
 (2, 'hero_overlord', 'владыка: серый конь, чёрно-синие латы с шипами, алый плащ, булава',
  ('horse', 'e', 'l', 'E', 'E'), dict(body='B', bodyd='z', gear='helm', gcol='B', gdark='z', weapon='mace', cape=('r', 'R'))),
 (2, 'hero_warlock', 'чернокнижник: графитовый конь, лиловая мантия с капюшоном, посох с кристаллом',
  ('horse', 'u', 'E', 'z', 'z'), dict(body='p', bodyd='P', gear='hood', gcol='p', gdark='P', weapon='staff', wcol='A')),
 (2, 'hero_barbarian', 'варвар: гнедой конь со шкурой, голый торс в меховой жилетке, меховая шапка, топор',
  ('horse', 'n', 'T', 'N', 'N'), dict(body='S', bodyd='T', gear='fur', gcol='N', gdark='D', weapon='axe', beard='z')),
 (2, 'hero_battlemage', 'боевой маг: серый конь со шкурой, кожаная куртка, шлем-череп с рогами, посох с пламенем',
  ('horse', 'e', 'l', 'E', 'E'), dict(body='n', bodyd='N', gear='skull', gcol='i', gdark='I', weapon='staff', wcol='F')),
 (2, 'hero_beastmaster', 'зверолов: оливковый ящер с гребнем, кожаная куртка, крокодилья шапка, копьё',
  ('lizard', 'H', 'h', 'j', None), dict(body='n', bodyd='N', gear='fur', gcol='G', gdark='j', weapon='spear', beard='z')),
 (3, 'hero_witch', 'ведьма: ящер, зелёная кожа, лиловая мантия с капюшоном, посох с огоньком',
  ('lizard', 'H', 'h', 'j', None), dict(body='p', bodyd='P', gear='hood', gcol='p', gdark='P', weapon='staff', wcol='f', skin='h')),
 (3, 'hero_planeswalker', 'странник миров: светлый конь, кристальные латы, кристальный меч',
  ('horse', 'l', 'w', 'e', 'e'), dict(body='c', bodyd='C', gear='crystal', gcol='c', gdark='C', weapon='sword', wcol='c')),
 (3, 'hero_elementalist', 'элементалист: светлый конь, сиреневая мантия, шары стихий у руки',
  ('horse', 'l', 'w', 'e', 'e'), dict(body='a', bodyd='p', gear='circlet', gcol='A', gdark='p', weapon='orbs')),
 (3, 'hero_captain', 'капитан: серый конь с морской сбруей, красный камзол, треуголка, сабля',
  ('horse', 'e', 'l', 'E', 'E'), dict(body='r', bodyd='R', gear='tricorn', gcol='u', gdark='y', weapon='sword', beard='l')),
 (3, 'hero_navigator', 'навигатор: гнедой конь, рубаха и жилет, бандана, подзорная труба',
  ('horse', 'n', 'T', 'N', 'N'), dict(body='w', bodyd='l', gear='hood', gcol='b', gdark='B', weapon='spyglass')),
 (3, 'hero_mercenary', 'наёмник: тёмный конь с медной сбруей, песочный плащ, широкополая шляпа, ружьё',
  ('horse', 'N', 'n', 'D', 'D'), dict(body='i', bodyd='I', gear='wide', gcol='N', gdark='n', weapon='gun')),
 (3, 'hero_artificer', 'артифицер: механический медный конь с трубой и паром, фартук, гогглы, гаечный ключ',
  ('mech', 'y', 'f', 'Y', None), dict(body='n', bodyd='N', gear='wide', gcol='O', gdark='N', weapon='wrench')),
 (3, 'hero_swarmlord', 'роевод: ездовой жук с рогом, хитиновый доспех, копьё-жало',
  ('beetle', 'H', 'h', 'j', None), dict(body='H', bodyd='j', gear='helm', gcol='j', gdark='G', weapon='spear')),
 (3, 'hero_pheromancer', 'феромант: ездовой жук, янтарная мантия, посох с фасеточным навершием',
  ('beetle', 'j', 'H', 'G', None), dict(body='f', bodyd='O', gear='hood', gcol='H', gdark='j', weapon='staff')),
 (3, 'hero_huntsman', 'егерь: олень с ветвистыми рогами, зелёный капюшон, лук',
  ('stag', 'T', 't', 'N', None), dict(body='H', bodyd='j', gear='hood', gcol='j', gdark='G', weapon='spear')),
 (3, 'hero_totemist', 'тотемист: олень, бурая накидка, тотемный посох',
  ('stag', 'n', 'T', 'N', None), dict(body='T', bodyd='N', gear='hood', gcol='N', gdark='D', weapon='staff')),
]

TITLES = {1: 'всадники на карте (группа 1)', 2: 'всадники на карте (группа 2)', 3: 'всадники на карте (группа 3)'}
for g in (1, 2, 3):
    blocks = []
    for grp, name, comment, mnt, rd in R:
        if grp != g: continue
        c = Fig(70, 78)
        mount(c, mnt[0], mnt[1], mnt[2], mnt[3], mane=mnt[4])
        rider(c, **rd)
        blocks.append(emit(name, c, comment, flipx=True))
    write('heroes_%d' % g, TITLES[g], blocks, 'riders3.py')
