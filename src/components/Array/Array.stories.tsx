import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { Array } from './Array'

storiesOf('Array', module).add('Array', () => <Array data={[1,2,4,3,5]}/>)
