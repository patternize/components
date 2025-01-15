# Patternize Components

- This has to use v16.10.0 version of node for development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### How to publish to NPM

Since you have GitHub Actions set up with npm-publish.yml that triggers on version tags, you only need to:

1. Bump the version:
   ```bash
   npm version patch
   ```
   This will:
   - Update package.json version
   - Create a git commit
   - Create a version tag

2. Push the changes and tag:
   ```bash
   git push --follow-tags
   ```

The GitHub Action will automatically:
- Build the package
- Publish to npm when it detects the version tag

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

