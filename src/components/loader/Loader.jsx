import Typewriter from 'typewriter-effect';

const Loader = () => {
  const brandName = 'Belly&Babe';
  return (
    <div className='h-screen w-full bg-white fixed inset-0 z-50 flex justify-center items-center overflow-hidden text-center'>
      <Typewriter
        options={{
          strings: `${brandName}`,
          autoStart: true,
          loop: true,
          delay: 50,
          deleteSpeed: 70,
          wrapperClassName: `text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 text-4xl font-bold text-center`,
        }}
      />
    </div>
  );
};

export default Loader;
