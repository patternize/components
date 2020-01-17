import * as React from 'react';
import { Button } from '../Button/Button';
import './SlideShow.scss';

const { useState } = React;

export type SlideEffect = 'fade' | 'slide';
export type ControllerPostition = 'top' | 'bottom';

// interface SlidesProps {
//     effect?: SlideEffect;
//     style?: React.CSSProperties;
//     controllerPostition?: ControllerPostition;
//     images?: React.ReactNode | string[] // React Node for <div>, string for url addresses
// }

interface ICounter {
    initialState: number,
    totalSize: number,
    images: string[],
}

interface ISlides {
    images: string[],
    currentSlide: number
}

const Slides =  ({ images, currentSlide} : ISlides): JSX.Element => {
    let slides = images.map((imgUrl: string, i: number) => {
        return (
        <img className={`img ${currentSlide === i ? 'active' : ''}`} key={i} src={imgUrl} />
        )
    });
    return (
        <div className='slides'>
            {slides}
        </div>
    )
};

export const SlideShow = ({ initialState=0 , totalSize=3, images}: ICounter): JSX.Element => {
    const [count, setCount] = useState<number>(0);
    const normalize = (count: number) => {
        let normalizedIndex = count % totalSize;
        if (normalizedIndex < 0) {
            normalizedIndex += totalSize;
        }
        return normalizedIndex;
    };
    const increment = () => setCount(normalize(count + 1));
    const decrement = () => setCount(normalize(count - 1));

    return (
        <div className='slideshow'>
            <Slides images={images} currentSlide={count}/>

            <div className="slides-nav">
                <Button onClick={decrement}>Previous</Button>
                <Button onClick={increment}>Next</Button>
            </div>
        </div>
    );
}

export default SlideShow;