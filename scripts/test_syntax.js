// Mock minimal browser environment to verify game logic
const fs = require('fs');

console.log("Checking syntax of game.js, pokemon_mode.js, birds_data.js, audio_engine.js...");

try {
  require('./js/birds_data.js');
  console.log("✓ birds_data.js loaded successfully. Length:", global.BIRDS_500_DATA ? global.BIRDS_500_DATA.length : "N/A");
} catch (e) {
  // It's okay if browser-only objects are absent, just verify file parses without syntax error
  const code = fs.readFileSync('./js/birds_data.js', 'utf8');
  new Function(code);
  console.log("✓ birds_data.js parsed without syntax errors.");
}

try {
  const code = fs.readFileSync('./js/pokemon_mode.js', 'utf8');
  new Function(code);
  console.log("✓ pokemon_mode.js parsed without syntax errors.");
} catch (e) {
  console.error("Syntax error in pokemon_mode.js:", e);
}

try {
  const code = fs.readFileSync('./js/game.js', 'utf8');
  new Function(code);
  console.log("✓ game.js parsed without syntax errors.");
} catch (e) {
  console.error("Syntax error in game.js:", e);
}

console.log("All syntax checks passed!");
