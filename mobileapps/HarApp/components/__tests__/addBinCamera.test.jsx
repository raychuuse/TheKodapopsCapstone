import * as React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import AddBinCamera from './addBinCamera';

jest.useFakeTimers();


test('renders correctly', () => {

    render(<AddBinCamera />);
    expect(screen.getByLabelText('Add a Bin')).toBeOnTheScreen();
});

test('User can enter a bin number', async () => {

    const user = userEvent.setup();

    render(<AddBinCamera />);
    
    expect(screen.getByLabelText('Add a Bin')).toBeOnTheScreen();

    await user.type(screen.getByLabelText('Add a Bin'), '4444');
  
    await user.press(screen.getByRole('button', { iconName: 'check-circle-outline' }));
  
    expect(await screen.findByLabelText('Successful')).toBeOnTheScreen();
  });
  
  test('User will see errors for incorrect bin number', async () => {
    const user = userEvent.setup();
    render(<AddBinCamera />);
  
    expect(screen.getByLabelText('Add a Bin')).toBeOnTheScreen();

    await user.type(screen.getByLabelText('Add a Bin'), '4444');
  
    await user.press(screen.getByRole('button', { iconName: 'check-circle-outline' }));
  
    expect(await screen.findByLabelText('Failed')).toBeOnTheScreen();

  });