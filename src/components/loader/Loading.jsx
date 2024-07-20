import React from 'react';

export const Loading = () => {
  return (
    <div className='flex h-16 items-center justify-center bg-white'>
      <div className='h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent'></div>
    </div>
  );
};
