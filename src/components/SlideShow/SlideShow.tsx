import * as React from 'react';
import { Button } from 'components/Button';
import './SlideShow.scss';

const { useState } = React;

const Extensions = {
  SVG: '.svg',
  JPG: '.jpg',
  JPEG: '.jpeg',
  NULL: 'NULL',
};

interface ISlideShowProps {
  images: string[];
  maxWidth?: number | string;
  maxHeight?: number | string;
}

interface ISlides {
  images: string[]; // image URLs
  index: number; // current Index
  maxWidth?: number | string;
  maxHeight?: number | string;
}

let obj = { name: 'carl', age: 16, character: { sex: 'male' } };

const Slides = ({
  images,
  index,
  maxWidth,
  maxHeight,
}: ISlides): JSX.Element => {
  let slides = images.map((imgUrl: string, i: number) => {
    let extensionMatch = imgUrl.match(/\.[0-9a-z]+$/i);
    let extension = extensionMatch == null ? '' : extensionMatch[0];
    switch (extension) {
      case Extensions.SVG:
        return (
          <object
            className={`img ${index === i ? 'active' : ''}`}
            key={i}
            type='image/svg+xml'
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
            className={`img ${index === i ? 'active' : ''}`}
            key={i}
            src={imgUrl}
          />
        );
    }
  });
  return <div className='slides'>{slides}</div>;
};

export const SlideShow = ({
  images,
  maxWidth,
  maxHeight,
}: ISlideShowProps): JSX.Element => {
  const [index, setIndex] = useState<number>(0);
  const normalize = (count: number) => {
    let len = images.length;
    let normalizedIndex = count % len;
    if (normalizedIndex < 0) {
      normalizedIndex += len;
    }
    return normalizedIndex;
  };
  const increment = () => setIndex((index) => normalize(index + 1));
  const decrement = () => setIndex((index) => normalize(index - 1));
  const setAuto = () =>
    setInterval(() => {
      increment();
    }, 1000);
  const autoTimeout = () => {
    for (let i = 1; i <= 5; i++) {
      setTimeout(() => {
        setIndex(normalize(index + i));
      }, 1000 * i);
    }
  };
  return (
    <div
      className='slideshow'
      style={{ maxWidth: maxWidth, maxHeight: maxHeight }}
    >
      <Slides images={images} index={index} {...maxWidth} {...maxHeight} />

      <div className='slides-nav'>
        <Button onClick={decrement}>Previous</Button>
        <Button onClick={autoTimeout}> Autoplay next 5 images</Button>
        <Button onClick={setAuto}> Set Auto</Button>
        <Button onClick={increment}>Next</Button>
      </div>
    </div>
  );
};
