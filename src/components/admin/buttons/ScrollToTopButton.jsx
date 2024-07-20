import { Button } from 'antd';
import { useEffect, useState } from 'react';

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);
  }, []);
  function handleScrollToTop() {
    window.scrollTo(0, 0, { behavior: 'smooth' });
  }
  return (
    <>
      {visible && (
        <Button className='fixed' onClick={handleScrollToTop}>
          <i className='fas fa-arrow-up'></i>
        </Button>
      )}
    </>
  );
}

export default ScrollToTopButton;
