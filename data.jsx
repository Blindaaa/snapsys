// Mock data for the comparison screen

const NARRATORS = {
  king: { name: 'King', color: 'var(--coral)', emoji: '♛', bg: '#FFE2DE' },
  witch: { name: 'Witch', color: 'var(--purple)', emoji: '✺', bg: '#EFE3FE' },
  librarian: { name: 'Librarian', color: 'var(--blue)', emoji: '✦', bg: '#DDEAFE' },
};

const SOURCES = {
  social: { name: 'Social Media', color: 'var(--coral)' },
  news: { name: 'News Outlet', color: 'var(--blue)' },
  library: { name: 'Library', color: 'var(--green)' },
};

const RESPONSES = [
  {
    id: 'r1',
    round: 1,
    narrator: 'king',
    source: 'news',
    tiles: ['Climate', 'Cities', 'Rising Seas'],
    text: 'Hear ye! The newspapers report that coastal cities face grave danger from rising tides. Officials must act with haste — for the sea waits for no decree. Three cities have already begun building walls, while others debate.',
  },
  {
    id: 'r2',
    round: 2,
    narrator: 'witch',
    source: 'social',
    tiles: ['Climate', 'Cities', 'Rising Seas'],
    text: 'Bubbling and brewing online — folk are SHOUTING about flooded basements and sinking streets. Some cackle that it is a hoax; others post sorrowful pictures of soaked living rooms. The cauldron of opinion churns wild and bitter.',
  },
  {
    id: 'r3',
    round: 3,
    narrator: 'librarian',
    source: 'library',
    tiles: ['Climate', 'Cities', 'Rising Seas'],
    text: 'According to peer-reviewed studies from 1998 to 2023, sea levels have risen approximately 3.4 mm per year. Urban coastal regions experience compounded risk due to subsidence. Adaptation strategies vary by economic capacity.',
  },
  {
    id: 'r4',
    round: 4,
    narrator: 'king',
    source: 'social',
    tiles: ['Climate', 'Cities', 'Energy'],
    text: 'My royal subjects on the social square debate fiercely! Some demand windmills upon every hill, others curse the price of lamp oil. The kingdom is divided — half cheer the sun-catchers, half mourn the old ways of coal and fire.',
  },
  {
    id: 'r5',
    round: 5,
    narrator: 'witch',
    source: 'news',
    tiles: ['Climate', 'Cities', 'Energy'],
    text: 'The papers whisper of blackouts and bargains — a strange dance between greedy companies and tired townsfolk. Headlines hex the politicians; columnists stir potions of blame. A storm of stories, none agreeing.',
  },
  {
    id: 'r6',
    round: 6,
    narrator: 'librarian',
    source: 'library',
    tiles: ['Climate', 'Cities', 'Food'],
    text: 'Research indicates that urban food systems contribute roughly 70% of global food consumption emissions. Local sourcing reduces transport impact by an average of 11%. Vertical farming pilots show promise but remain costly.',
  },
];

// Static "diffs" — tokens to highlight when comparing two cards.
// In a real app these would be computed; here we tag spans by which dimension changed.
function diffSpans(cardA, cardB) {
  if (!cardA || !cardB) return null;
  const narratorChanged = cardA.narrator !== cardB.narrator;
  const sourceChanged = cardA.source !== cardB.source;
  const tilesChanged = JSON.stringify(cardA.tiles) !== JSON.stringify(cardB.tiles);
  return { narratorChanged, sourceChanged, tilesChanged };
}

// Highlight rules: which words to mark in each card based on what differs.
// Hand-authored for fidelity in a prototype.
const HIGHLIGHT_MAP = {
  r1: { narrator: ['Hear ye!', 'grave', 'haste', 'decree'], source: ['newspapers report', 'Officials', 'building walls'], tiles: ['coastal cities', 'rising tides', 'sea'] },
  r2: { narrator: ['Bubbling and brewing', 'cackle', 'cauldron'], source: ['online', 'SHOUTING', 'post', 'opinion'], tiles: ['flooded basements', 'sinking streets', 'soaked living rooms'] },
  r3: { narrator: ['According to', 'peer-reviewed', 'studies', 'Adaptation strategies'], source: ['peer-reviewed studies', '1998 to 2023', 'compounded risk'], tiles: ['sea levels', 'Urban coastal regions'] },
  r4: { narrator: ['My royal subjects', 'kingdom', 'cheer', 'mourn'], source: ['social square', 'debate fiercely'], tiles: ['windmills', 'lamp oil', 'sun-catchers', 'coal and fire'] },
  r5: { narrator: ['whisper', 'hex', 'stir potions', 'storm of stories'], source: ['papers', 'Headlines', 'columnists'], tiles: ['blackouts', 'companies', 'townsfolk'] },
  r6: { narrator: ['Research indicates', 'roughly', 'pilots show promise'], source: ['Research indicates', '70%', '11%'], tiles: ['urban food systems', 'food consumption', 'Vertical farming'] },
};

window.NARRATORS = NARRATORS;
window.SOURCES = SOURCES;
window.RESPONSES = RESPONSES;
window.HIGHLIGHT_MAP = HIGHLIGHT_MAP;
window.diffSpans = diffSpans;
