import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { Line } from './Line'

storiesOf('Line', module).add('Line', () => <Line data={[10,30,50,60,100]}/>)
