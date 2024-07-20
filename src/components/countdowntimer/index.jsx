import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const CountdownTimer = ({ startHour, endHour }) => {
    const calculateTimeLeft = () => {
        const now = dayjs();
        const startTime = dayjs().hour(startHour).minute(0).second(0);
        const endTime = dayjs().hour(endHour).minute(0).second(0);

        let timeLeft = {};

        if (now.isBefore(startTime)) {
            const difference = startTime.diff(now);
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else if (now.isAfter(startTime) && now.isBefore(endTime)) {
            const difference = endTime.diff(now);
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = {
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && timeLeft[interval] !== 0) {
            return;
        }

        timerComponents.push(
            <span key={interval} className="px-2 py-1 bg-pink-500 text-white rounded-lg ">
                {timeLeft[interval].toString().padStart(2,'0')}
            </span>
        );
    });

    return (
        <div className="flex items-center space-x-2">
            {timerComponents.length ? timerComponents : <span>Time's up!</span>}
        </div>
    );
};

export default CountdownTimer;
