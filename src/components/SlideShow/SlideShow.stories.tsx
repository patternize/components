import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { SlideShow } from './SlideShow'

const images = ['https://i.imgur.com/mwkyRPd.png', 'https://i.imgur.com/J7OtgXe.png', 'https://i.imgur.com/rcfDSAf.png'];

storiesOf('SlideShow', module).add('SlideShow', () => <SlideShow initialState={0} totalSize={3} images={images}/>)
