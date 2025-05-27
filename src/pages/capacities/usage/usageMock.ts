const usageMock = {
  products: [
    { catalog: '4391', pn: '4391', description: 'Delivery Tray', lotSize: 300, yield: '95%', line: 'FA' },
    { catalog: '4230', pn: '4230', description: 'All in One Tray', lotSize: 150, yield: '95%', line: 'FA' },
    { catalog: '4403', pn: '4403', description: 'Bone Anchors (3) w/Arthro Del Sys', lotSize: 300, yield: '97%', line: 'FA' },
    { catalog: '2503-S', pn: '2503-S', description: 'Bone Staple/Anchore Spare (x1)', lotSize: 100, yield: '97%', line: 'FA' },
    { catalog: '4565D', pn: '4565 D', description: 'Medium Gen 4 MD Implant Demo', lotSize: 340, yield: '98%', line: 'CER3' },
    { catalog: '4566D', pn: '4566 D', description: 'Large Gen 4 MD Implant Demo', lotSize: 340, yield: '98%', line: 'CER3' },
  ],
  period: [
    { bp: 0, cbp: 0, delta: 0, deltaPlus: 0, wk14: 0, wk15: 0, wk16: 0, wk17: 0 },
    { bp: 0, cbp: 0, delta: 0, deltaPlus: 0, wk14: 0, wk15: 0, wk16: 0, wk17: 0 },
    { bp: 6327, cbp: 5000, delta: -1327, deltaPlus: -1705, wk14: 1700, wk15: 900, wk16: 1200, wk17: 1200 },
    { bp: 102, cbp: 0, delta: -102, deltaPlus: -105, wk14: 0, wk15: 0, wk16: 0, wk17: 0 },
    { bp: 0, cbp: 0, delta: 0, deltaPlus: 0, wk14: 0, wk15: 0, wk16: 0, wk17: 0 },
    { bp: 0, cbp: 0, delta: 0, deltaPlus: 0, wk14: 0, wk15: 0, wk16: 0, wk17: 0 },
  ],
  linesSummary: [
    { name: 'FA', bp: 8776, cbp: 6800, delta: -1976, deltaPlus: -2376, load14: '283%', load15: '162%', load16: '167%', load17: '76%', load18: '177%', tLoading: '173%' },
    { name: 'Next', bp: 0, cbp: 0, delta: 0, deltaPlus: 0, load14: '0%', load15: '0%', load16: '0%', load17: '0%', load18: '0%', tLoading: '0%' },
    { name: 'CER3', bp: 7959, cbp: 4440, delta: 3458, deltaPlus: -2840, load14: '0%', load15: '83%', load16: '118%', load17: '85%', load18: '71%', tLoading: '89%' },
  ],
};

export default usageMock; 