import * as React from 'react'

import { storiesOf } from '@storybook/react'
import Array from './index'

storiesOf('D3 Modules', module).add('Array', () => <Array data={[
    [5,1,4,2,8],
    [1,5,4,2,8],
    [1,4,5,2,8],
    [1,4,2,5,8],
    [1,2,4,5,8]
]}/>)
