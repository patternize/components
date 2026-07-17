import { animated, useSpring } from '@react-spring/web';

export interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Spring duration in ms. */
  duration?: number;
}

/** A number that counts up (or down) to its value with a spring. */
export const AnimatedNumber = ({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 800
}: AnimatedNumberProps) => {
  const spring = useSpring({
    from: { n: 0 },
    to: { n: value },
    config: { duration, easing: (t: number) => 1 - Math.pow(1 - t, 3) }
  });
  return (
    <animated.span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {spring.n.to(
        (n) =>
          `${prefix}${n.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          })}${suffix}`
      )}
    </animated.span>
  );
};

export default AnimatedNumber;
