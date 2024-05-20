import { useState, useEffect } from 'react';

/**
 * Get a time-based greeting message.
 *
 * @returns {string} The greeting message based on the current hour.
 */
const getTimeBasedGreeting = () => {
  const currentHour = new Date().getHours(); // Get the current hour

  if (currentHour >= 0 && currentHour < 6) {
    return 'Good Night';
  } else if (currentHour >= 6 && currentHour < 12) {
    return 'Good Morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

/**
 * GreetingMessage Component
 *
 * This component displays a greeting message based on the time of day.
 * The greeting message updates every minute.
 *
 * @returns {string} The current greeting message.
 */
const GreetingMessage = () => {
  const [greeting, setGreeting] = useState(getTimeBasedGreeting()); // State for the greeting message

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGreeting(getTimeBasedGreeting()); // Update the greeting every minute
    }, 60000); // 60000 milliseconds = 1 minute

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, []);

  return `${greeting}`; // Return the current greeting message
};

export default GreetingMessage;
