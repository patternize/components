import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { SlideShow } from './SlideShow'

const images = ['https://patternize.github.io//img/pattern.svg',
    'https://patternize.github.io/img/association.svg',
    'https://patternize.github.io/img/brain.svg'];

storiesOf('React Components', module).add('SlideShow', () => <SlideShow
    initialState={0}
    images={images}
    maxWidth={1000}
/>)
