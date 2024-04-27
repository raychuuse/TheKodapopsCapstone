// Run data is a array of sidings in the run
export const RunMockData = {
  id: 1,
  name: 'Run Name',
  sidings: [
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
          binNumber: 1111,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 2222,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 3333,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 4444,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 5555,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 6666,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 7777,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 8888,
          isFull: true,
          isBurnt: false,
        },
      ],
      binsCollect: [
        {
          binNumber: 1111,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 2222,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 3333,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 4444,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 5555,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 6666,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 7777,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 8888,
          isFull: true,
          isBurnt: false,
        },
        {
          binNumber: 9999,
          isFull: true,
          isBurnt: false,
        },
      ],
    },
    {
      id: 3,
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
  ],
};
