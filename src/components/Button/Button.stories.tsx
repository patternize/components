import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { Button } from './index'

storiesOf('React Components', module).add('Button', () => React.createElement(() => {

    return (
        <div className={'controller'}>
            <br/>
            <Button>
                Dark
            </Button>
            <Button>
                Light
            </Button>
        </div>
    );
}));
