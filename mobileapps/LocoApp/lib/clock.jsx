import { useEffect, useState } from "react";

const Clock = () => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const time = new Date();
      setTime(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })); // Update the time every minute
    }, 1000); // 60000 milliseconds = 1 minute

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, []);

  return `${time}`;
};

export default Clock;
