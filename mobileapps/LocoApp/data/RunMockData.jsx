// Run data is a array of sidings in the run
export const RunMockData = {
  id: 1,
  name: 'Run Name',
  sidings: [
    {
      id: 1,
      isCompleted: true,
      name: 'Isis Central Mill Start', // Starting point - Collecting specific non-full bins
      binsDrop: [],
      binsCollect: [
        { binNumber: 123456, isFull: true, isDone: true, isBurnt: false },
        { binNumber: 123457, isFull: true, isDone: true, isBurnt: false },
        { binNumber: 123458, isFull: true, isDone: true, isBurnt: false },
        { binNumber: 123459, isFull: true, isDone: true, isBurnt: false },
        { binNumber: 123460, isFull: true, isDone: true, isBurnt: false },
        { binNumber: 123461, isFull: true, isDone: true, isBurnt: false },
        { binNumber: 123462, isFull: true, isDone: true, isBurnt: false },
        { binNumber: 123463, isFull: true, isDone: true, isBurnt: false },
        { binNumber: 123464, isFull: true, isDone: true, isBurnt: false },
        { binNumber: 123465, isFull: true, isDone: true, isBurnt: false },
        { binNumber: 123466, isFull: true, isDone: true, isBurnt: false },
      ],
    },
    {
      id: 2,
      isCompleted: true,
      name: 'East Bundaberg', // First stop after leaving the mill
      binsDrop: [
        { binNumber: 123456, isFull: true, isDone: true, isBurnt: false },
        { binNumber: 123457, isFull: true, isDone: true, isBurnt: false },
        { binNumber: 123458, isFull: true, isDone: true, isBurnt: false },
      ],
      binsCollect: [
        { binNumber: 223461, isFull: true, isDone: true, isBurnt: false },
        { binNumber: 223462, isFull: true, isDone: true, isBurnt: false },
      ],
    },
    {
      id: 3,
      isCompleted: false,
      name: 'North Bundaberg', // Continuing northwards
      binsDrop: [
        { binNumber: 123459, isFull: false, isDone: false, isBurnt: false },
        { binNumber: 123460, isFull: false, isDone: false, isBurnt: false },
        { binNumber: 123461, isFull: false, isDone: false, isBurnt: false },
        { binNumber: 123462, isFull: false, isDone: false, isBurnt: false },
      ],
      binsCollect: [
        { binNumber: 223464, isFull: true, isDone: false, isBurnt: false },
        { binNumber: 223465, isFull: true, isDone: false, isBurnt: false },
        { binNumber: 223466, isFull: true, isDone: false, isBurnt: true },
        { binNumber: 223467, isFull: true, isDone: false, isBurnt: false },
        { binNumber: 223463, isFull: true, isDone: false, isBurnt: false },
      ],
    },
    {
      id: 4,
      isCompleted: false,
      name: 'South Bundaberg', // Heading back towards the mill
      binsDrop: [
        { binNumber: 123463, isFull: false, isDone: false, isBurnt: false },
        { binNumber: 123464, isFull: false, isDone: false, isBurnt: false },
        { binNumber: 123465, isFull: false, isDone: false, isBurnt: false },
        { binNumber: 123466, isFull: false, isDone: false, isBurnt: false },
      ],
      binsCollect: [
        { binNumber: 223468, isFull: true, isDone: false, isBurnt: true },
        { binNumber: 223469, isFull: true, isDone: false, isBurnt: false },
      ],
    },
    {
      id: 5,
      isCompleted: false,
      name: 'Isis Central Mill End', // Final point, dropping off all collected bins
      binsDrop: [],
      binsCollect: [
        { binNumber: 223461, isFull: true, isDone: false, isBurnt: false },
        { binNumber: 223462, isFull: true, isDone: false, isBurnt: false },
        { binNumber: 223463, isFull: true, isDone: false, isBurnt: false },
        { binNumber: 223464, isFull: true, isDone: false, isBurnt: false },
        { binNumber: 223465, isFull: true, isDone: false, isBurnt: false },
        { binNumber: 223466, isFull: true, isDone: false, isBurnt: true },
        { binNumber: 223467, isFull: true, isDone: false, isBurnt: false },
        { binNumber: 223468, isFull: true, isDone: false, isBurnt: true },
        { binNumber: 223469, isFull: true, isDone: false, isBurnt: false },
      ],
    },
  ],
};
