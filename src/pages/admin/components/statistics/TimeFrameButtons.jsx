import { Button } from 'antd';

function TimeFrameButtons({ timeFrame, onTimeFrameChange }) {
  return (
    <div className='flex space-x-1'>
      {['day', 'week', 'month'].map((frame) => (
        <Button
          key={frame}
          className={`${
            timeFrame === frame ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => onTimeFrameChange(frame)}
        >
          {frame.charAt(0).toUpperCase() + frame.slice(1)}
        </Button>
      ))}
    </div>
  );
}

export default TimeFrameButtons;
