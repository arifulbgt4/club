import React, { useEffect, useState } from "react";

const Countdown = ({ endDate }: { endDate: Date }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const end = new Date(endDate);
    const difference = end.getTime() - now.getTime();

    if (difference <= 0) {
      return null;
    }

    const timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return <div className=" text-destructive">Time is over</div>;
  }

  return (
    <div>
      {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
      {timeLeft.hours > 0 && <span>{timeLeft.hours}h </span>}
      {timeLeft.minutes > 0 && <span>{timeLeft.minutes}m </span>}
      {timeLeft.seconds >= 0 && <span>{timeLeft.seconds}s</span>}
    </div>
  );
};

export default Countdown;
