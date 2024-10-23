import * as React from 'react';
import { Button } from '../Button';
import useStyles from './SlideShow.style';

const { useState } = React;

const Extensions = {
  SVG: '.svg',
  JPG: '.jpg',
  JPEG: '.jpeg',
  NULL: 'NULL'
};

export type SlideShowProps = {
  images: string[];
  maxWidth?: number | string;
  maxHeight?: number | string;
};

type SlidesProps = {
  images: string[]; // image URLs
  index: number; // current Index
  maxWidth?: number | string;
  maxHeight?: number | string;
};

const Slides: React.FC<SlidesProps> = ({
  images,
  index,
  maxWidth,
  maxHeight
}) => {
  const classes = useStyles();

  const slides = images.map((imgUrl: string, i: number) => {
    const extensionMatch = imgUrl.match(/\.[0-9a-z]+$/i);
    const extension = extensionMatch == null ? '' : extensionMatch[0];
    switch (extension) {
      case Extensions.SVG:
        return (
          <object
            className={index === i ? classes.imgActive : classes.img}
            key={i}
            type="image/svg+xml"
            data={imgUrl}
            width={maxWidth}
            height={maxHeight}
          >
            Your browser does not support SVG.
          </object>
        );
      default:
        return (
          <img
            alt={imgUrl}
            className={index === i ? classes.imgActive : classes.img}
            key={i}
            src={imgUrl}
          />
        );
    }
  });
  return <div className={classes.slides}>{slides}</div>;
};

export const SlideShow: React.FC<SlideShowProps> = ({
  images,
  maxWidth,
  maxHeight
}) => {
  const classes = useStyles();

  const [index, setIndex] = useState<number>(0);
  const normalize = (count: number) => {
    const len = images.length;
    let normalizedIndex = count % len;
    if (normalizedIndex < 0) {
      normalizedIndex += len;
    }
    return normalizedIndex;
  };
  const increment = () => setIndex(normalize(index + 1));
  const decrement = () => setIndex(normalize(index - 1));

  return (
    <div
      className={classes.slideshow}
      style={{ maxWidth: maxWidth, maxHeight: maxHeight }}
    >
      <Slides
        images={images}
        index={index}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
      />

      <div className={classes.slidesNav}>
        <Button onClick={decrement}>Previous</Button>
        <Button onClick={increment}>Next</Button>
      </div>
    </div>
  );
};
