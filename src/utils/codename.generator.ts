const CODENAMES = [
  'The Nightingale', 'The Kraken', 'Silent Shadow',
  'Phantom Blade', 'Ghost Protocol', 'Crimson Horizon',
  'Midnight Whisper', 'Steel Sentinel', 'Echo Strike',
  'Obsidian Aegis', 'Quantum Blade'
];

export const generateCodename = (): string => {
  return CODENAMES[Math.floor(Math.random() * CODENAMES.length)];
};
