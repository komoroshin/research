// Загружает модули модели в node в правильном порядке (без DOM).
const path = require('path');
const files = ['core/util', 'data/creatures', 'data/factions', 'data/buildings', 'data/skills', 'data/spells', 'data/artifacts', 'data/heroes', 'data/objects',
  'model/rules', 'model/pathfind', 'model/state', 'model/mapgen', 'model/battle', 'model/battleai', 'model/adventure', 'model/ai'];
for (const f of files) { try { require(path.join(__dirname, '..', 'js', f + '.js')); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND' || !e.message.includes(f)) throw e; } }
module.exports = globalThis.H3;
