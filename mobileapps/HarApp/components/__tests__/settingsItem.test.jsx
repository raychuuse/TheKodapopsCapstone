import * as React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import SwipeableBinItem from '../swipeableBinItem';
import { BinProvider, useBins } from '../../context/binContext';
jest.useFakeTimers();


const mockSidings = [
    { label: 'Babinda', value: 1 },
    { label: 'Tully', value: 2 },
    { label: 'Innisfail', value: 3 },
    { label: 'Mourilyan', value: 4 },
    { label: 'South Johnstone', value: 5 },
    { label: 'Gordonvale', value: 6 },
    { label: 'Mossman', value: 7 },
    { label: 'Proserpine', value: 8 },
    { label: 'Ayr', value: 9 },
    { label: 'Ingham', value: 10 },
    { label: 'Lucinda', value: 11 },
    { label: 'Bundaberg', value: 12 },
    { label: 'Maryborough', value: 13 },
    { label: 'Isis', value: 14 },
    { label: 'Mackay', value: 15 },
];

// Mock usage of context provider
const {
    setSelectedSiding,
    setSelectedFarm,
    getSelectedSiding,
    getSelectedFarm,
    onSetup,
} = useBins();
// Instead of setup page, we focus on it's component
// can still mock and render this within a test if looking for further integration/
// unit tests compared to acceptance testing

test('renders correctly', () => {
    render(
    <BinProvider>
        <SwipeableBinItem 
            type='location'
            label='Siding'
            startOption={getSelectedSiding()?.sidingID}
            options={mockSidings?.map((s) => {
            return { id: s.sidingID, label: s.sidingName };
            })}
            setSelectedItem={onSidingSelected}
        />
    </BinProvider>
    );

  expect(screen.getByLabelText(getSelectedSiding()?.sidingName)).toBeOnTheScreen();
});

// Time issues occured, but can mock picker with jest.fn and using mock, similar to
// as for async storage, i.e. import mockAsyncStorage and jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);