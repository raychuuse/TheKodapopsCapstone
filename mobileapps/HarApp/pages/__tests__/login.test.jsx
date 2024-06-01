import * as React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import LoginPage from '../login';

jest.useFakeTimers();

// Loco originally had this login unit test as well, but it was noted, the functionality
// and ui are near identical even in labels

test('renders correctly', () => {
  render(<LoginPage />);

  expect(screen.getByLabelText('Welcome')).toBeOnTheScreen();
});

test('User can sign in successully with correct credentials', async () => {
  // Setup User Event instance for realistic simulation of user interaction.
  const user = userEvent.setup();

  render(<LoginPage />);

  await user.type(screen.getByRole({placeholder:'Please enter your email'}), 'harvester@email.com');
  await user.type(screen.getByRole({placeholder:'Password'}), 'harvester@email.com');

  await user.press(screen.getByRole('button', { name: 'Sign In' }));

  // Check page has changed
  expect(screen.queryByLabelText('Forgot your password?')).not.toBeOnTheScreen();
  expect(screen.queryByLabelText('Reset Password with Code')).not.toBeOnTheScreen();
});

test('User can sign in successully with correct credentials', async () => {
    // Setup User Event instance for realistic simulation of user interaction.
    const user = userEvent.setup();
  
    render(<LoginPage />);
  
    await user.type(screen.getByRole({placeholder:'Please enter your email'}), 'harvester@email.com');
    await user.type(screen.getByRole({placeholder:'Password'}), 'harvester@email.com');
  
    await user.press(screen.getByRole('button', { name: 'Sign In' }));
  
    // Check page has changed
    expect(screen.queryByLabelText('Forgot your password?')).not.toBeOnTheScreen();
    expect(screen.queryByLabelText('Reset Password with Code')).not.toBeOnTheScreen();
  });

test('User will see errors for incorrect credentials and stay on same page', async () => {
    const user = userEvent.setup();
  
    render(<LoginPage />);
  
    await user.type(screen.getByRole({placeholder:'Please enter your email'}), 'defnotauser@notanemail.com');
    await user.type(screen.getByRole({placeholder:'Password'}), 'blank');
  
    await user.press(screen.getByRole('button', { name: 'Sign In' }));

    expect(screen.queryByLabelText('Error')).toBeOnTheScreen();
    expect(screen.queryByLabelText('Forgot your password?')).toBeOnTheScreen();
    expect(screen.queryByLabelText('Reset Password with Code')).toBeOnTheScreen();
  });


test('User can send a reset code', async () => {
    // Setup User Event instance for realistic simulation of user interaction.
    const user = userEvent.setup();
  
    render(<LoginPage />);
    
    expect(screen.getByLabelText('Welcome')).toBeOnTheScreen();

    // button works with touchable, pressable, etc.
    await user.press(screen.getByRole('button', { name: 'Forgot your password?' }));
  
    await user.type(screen.getByRole('textInput', { placeholder: 'Please enter your email' }), 'harvester@email.com');
  
    await user.press(screen.getByRole('button', { name: 'Send Reset Link' }));
  
    expect(await screen.findByRole('header', { name: 'Welcome admin!' })).toBeOnTheScreen();
});

test('User can reset password', async () => {
    // Setup User Event instance for realistic simulation of user interaction.
    const user = userEvent.setup();
    
    let exampleCode = '5827';
    render(<LoginPage />);
    
    expect(screen.getByLabelText('Welcome')).toBeOnTheScreen();

    // button works with touchable, pressable, etc.
    await user.press(screen.getByRole('button', { name: 'Reset Password with Code' }));
  
    await user.type(screen.getByRole('textInput', { placeholder: 'Please enter your email' }), 'harvester@email.com');
    await user.type(screen.getByRole('textInput', { placeholder: 'Please enter your reset code' }), exampleCode);
    await user.type(screen.getByRole('textInput', { placeholder: 'Please enter your new password' }), 'root2');
    await user.type(screen.getByRole('textInput', { placeholder: 'Reconfirm password' }), 'root2');


    await user.press(screen.getByRole('button', { name: 'Reset Password' }));
  
    expect(await screen.findByLabelText('successfully')).toBeOnTheScreen();
});