import { configure } from '@storybook/react'
import { addParameters } from '@storybook/react'; // or any other type of storybook
import { themes } from '@storybook/theming';

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
