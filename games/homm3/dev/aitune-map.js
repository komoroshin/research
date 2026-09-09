// Вклад каждой новинки ИИ карты по отдельности: гоняем турнир, отключая по одной.
// node dev/aitune-map.js [пар] [дней]
const { execFileSync } = require('child_process');
const pairs = process.argv[2] || '4', days = process.argv[3] || '70';
// Каждая строка — что включаем поверх базового ИИ v1.6.
const sets = [
  ['ничего (= ИИ v1.6, проверка на 50/50)', ''],
  ['прогон боя (sim)', 'sim'],
  ['карта угроз', 'threat'],
  ['оборона по карте угроз', 'threat,defend'],
  ['роли и цепочки', 'roles'],
  ['экономика по ценности', 'econ'],
  ['смелость', 'bold'],
  ['найм до выхода героев', 'recruitFirst'],
  ['всё сразу', 'sim,threat,defend,roles,econ,bold,recruitFirst'],
];
for (const [name, on] of sets) {
  const out = execFileSync('node', [__dirname + '/aiwar.js', pairs, 'M', days], { env: Object.assign({}, process.env, { AI_OFF: 'sim,threat,defend,roles,econ,bold,recruitFirst,naval', AI_ON: on }), encoding: 'utf8' });
  const win = /win-rate нового[^:]*: (\d+)/.exec(out), pow = /отношение ([\d.]+)/.exec(out), ah = /перевесом по силе: новый (\d+) \| старый (\d+)/.exec(out);
  console.log((name + ' ').padEnd(38, '.') + ' перевес ' + (ah ? (ah[1] + '/' + ah[2]).padEnd(6) : '?')
    + ' win-rate ' + (win ? win[1] + ' %' : '—').padEnd(6) + ' сила ×' + (pow ? pow[1] : '?'));
}
