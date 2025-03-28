import { animated, useSprings } from '@react-spring/web';
import clamp from 'lodash.clamp';
import { useRef } from 'react';
import { useDrag } from 'react-use-gesture';
import useMeasure from 'react-use-measure';

import useStyles from './Viewpager.styles';

export const Viewpager = ({ images }: { images: string[] }) => {
  const index = useRef(0);
  const [ref, { width }] = useMeasure();
  const [props, api] = useSprings(
    images.length,
    (i) => ({
      x: i * width,
      scale: width === 0 ? 0 : 1,
      display: 'block'
    }),
    [width]
  );
  const bind = useDrag(
    ({ active, movement: [mx], direction: [xDir], distance, cancel }) => {
      if (active && distance > width / 2) {
        index.current = clamp(
          index.current + (xDir > 0 ? -1 : 1),
          0,
          images.length - 1
        );
        cancel();
      }
      api.start((i) => {
        if (i < index.current - 1 || i > index.current + 1)
          return { display: 'none' };
        const x = (i - index.current) * width + (active ? mx : 0);
        const scale = active ? 1 - distance / width / 2 : 1;
        return { x, scale, display: 'block' };
      });
    }
  );

  const styles = useStyles(); // Use useStyles to get styles

  return (
    <div ref={ref} className={styles.wrapper}>
      {props.map(({ x, display, scale }, i) => (
        // @ts-ignore
        <animated.div
          className={styles.page}
          {...bind()}
          key={i}
          style={{ display, x }}
        >
          <animated.div
            // @ts-ignore
            className={styles.pageDiv}
            style={{ scale, backgroundImage: `url(${images[i]})` }}
          />
        </animated.div>
      ))}
    </div>
  );
};
