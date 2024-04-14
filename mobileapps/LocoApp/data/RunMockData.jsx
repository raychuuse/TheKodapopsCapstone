export const RunMockData = [
  {
    id: 1,
    isCompleted: false,
    isSelected: false,
    name: 'Siding #1',
    binsDrop: [
      {
        binNumber: 1234,
        isFull: false,
        isBurnt: false,
      },
    ],
    binsCollect: [
      {
        binNumber: 2345,
        isFull: false,
        isBurnt: false,
      },
    ],
  },
  {
    id: 2,
    isCompleted: true,
    isSelected: false,
    name: 'Siding #2',
    binsDrop: [
      {
        binNumber: 2234,
        isFull: true,
        isBurnt: false,
      },
    ],
    binsCollect: [
      {
        binNumber: 3345,
        isFull: true,
        isBurnt: false,
      },
    ],
  },
  {
    id: 2,
    isCompleted: false,
    isSelected: true,
    name: 'Siding #3',
    binsDrop: [
      {
        binNumber: 3234,
        isFull: false,
        isBurnt: false,
      },
    ],
    binsCollect: [
      {
        binNumber: 4345,
        isFull: false,
        isBurnt: true,
      },
    ],
  },
];
