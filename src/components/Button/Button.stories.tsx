import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { Button } from './index'
import addons from '@storybook/addons';
const { useState, useEffect } = React;

// get channel to listen to event emitter
const channel = addons.getChannel();

storiesOf('React Components', module).add('Button', () => React.createElement(() => {
    const [isDark, setDark] = useState(false);

    const setTheme = (dark) => {
        if (dark === true) {
            document.documentElement.setAttribute('data-theme', 'dark');
            setDark(true);
            console.log(isDark);
        } else if (dark === false) {
            document.documentElement.removeAttribute('data-theme');
            setDark(false);
        }
    }

    useEffect(() => {
        channel.on('DARK_MODE', setTheme);
        return () => channel.off('DARK_MODE', setDark);
    }, [channel, setDark]);

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
