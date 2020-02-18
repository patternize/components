import { configure, addDecorator } from '@storybook/react'
import { addParameters } from '@storybook/react'; // or any other type of storybook
import { themes } from '@storybook/theming';
import * as React from "react";
import addons from '@storybook/addons';
const { useState, useEffect } = React;

addParameters({
    darkMode: {
        // Override the default dark theme
        dark: { ...themes.dark, appBg: 'black' },
        // Override the default light theme
        light: { ...themes.normal, appBg: 'white' }
    }
});
// automatically import all files ending in *.stories.tsx in src/components
const req = require.context('../src', true, /\.stories\.tsx$/)

function loadStories() {
  req.keys().forEach(req)
}

configure(loadStories, module)


// get channel to listen to event emitter
const channel = addons.getChannel();

addDecorator(storyFn => React.createElement(() => {
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
        <>
            {storyFn()}
        </>);
}));