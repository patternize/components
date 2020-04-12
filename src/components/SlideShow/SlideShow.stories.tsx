import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { SlideShow } from './SlideShow';
import { withInfo } from '@storybook/addon-info';

const stories = storiesOf('React Components', module);

stories.addDecorator(withInfo);
stories.addParameters({ info: { inline: true } });

const images = [
  'https://patternize.github.io//img/pattern.svg',
  'https://patternize.github.io/img/association.svg',
  'https://patternize.github.io/img/brain.svg'
];

stories.add('SlideShow', () => <SlideShow images={images} maxWidth={1000} />);
