import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { SlideShow } from './SlideShow'

const images = ['http://img5.imgtn.bdimg.com/it/u=1781362973,2004808734&fm=26&gp=0.jpg', 'https://i.imgur.com/J7OtgXe.png', 'https://i.imgur.com/rcfDSAf.png'];

storiesOf('SlideShow', module).add('SlideShow', () => <SlideShow initialState={0} totalSize={3} images={images}/>)
