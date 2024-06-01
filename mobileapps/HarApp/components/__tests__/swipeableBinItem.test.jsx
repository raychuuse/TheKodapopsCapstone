import * as React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import SwipeableBinItem from '../swipeableBinItem';

jest.useFakeTimers();

test('renders correctly', () => {

  render(<SwipeableBinItem />);

  // Simple check, see if different parts have rendered on the screen
  expect(screen.getByLabelText('Missing')).toBeOnTheScreen();
  expect(screen.getByLabelText('Repair')).toBeOnTheScreen();

});

// Can do further specific testing, but many actions are provider dependent
// can mock well via passing in a mock provider for binContext with a singular bin 
// Do tests here over main page