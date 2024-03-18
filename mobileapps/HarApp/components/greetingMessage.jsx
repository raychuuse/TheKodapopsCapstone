import { useState, useEffect } from "react";

const getTimeBasedGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 0 && currentHour < 6) {
    return "Good Night";
  } else if (currentHour >= 6 && currentHour < 12) {
    return "Good Morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};

const GreetingMessage = () => {
  const [greeting, setGreeting] = useState(getTimeBasedGreeting());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGreeting(getTimeBasedGreeting()); // Update the greeting every minute
    }, 60000); // 60000 milliseconds = 1 minute

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, []);

  return `${greeting}`;
};

export default GreetingMessage;
