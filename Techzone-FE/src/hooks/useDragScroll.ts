import { useRef, useEffect } from 'react';

export const useDragScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const mouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    };

    const mouseLeave = () => {
      isDown = false;
    };

    const mouseUp = () => {
      isDown = false;
    };

    const mouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * 1;
      element.scrollLeft = scrollLeft - walk;
    };

    element.addEventListener('mousedown', mouseDown);
    element.addEventListener('mouseleave', mouseLeave);
    element.addEventListener('mouseup', mouseUp);
    element.addEventListener('mousemove', mouseMove);

    return () => {
      element.removeEventListener('mousedown', mouseDown);
      element.removeEventListener('mouseleave', mouseLeave);
      element.removeEventListener('mouseup', mouseUp);
      element.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  return ref;
};
