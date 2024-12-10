import { createUseStyles } from 'react-jss';

export default createUseStyles({
  app: {
    textAlign: 'center'
  },

  appLogo: {
    height: '40vmin',
    pointerEvents: 'none',
    '@media (prefers-reduced-motion: no-preference)': {
      animation: '$appLogoSpin infinite 20s linear'
    }
  },

  appHeader: {
    backgroundColor: '#282c34',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white'
  },

  appLink: {
    color: '#61dafb'
  },

  '@keyframes appLogoSpin': {
    from: {
      transform: 'rotate(0deg)'
    },
    to: {
      transform: 'rotate(360deg)'
    }
  },

  'div p': {
    display: 'inline-block',
    fontSize: '30px',
    color: 'white',
    textTransform: 'none',
    margin: '0 20px',
    opacity: 1,
    animation: '$fadeIn ease 2s',
    WebkitAnimation: '$fadeIn ease 2s'
  },

  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 }
  },

  playgroundContainer: {
    display: 'flex',
    minHeight: '100vh',
    padding: '20px',
    gap: '20px'
  },

  controlPanel: {
    flex: 1,
    padding: '20px',
    border: '2px solid #61dafb',
    borderRadius: '8px',
    backgroundColor: '#282c34',
    height: '300px'
  },

  previewPanel: {
    flex: 2,
    padding: '20px',
    border: '2px solid #61dafb',
    borderRadius: '8px',
    backgroundColor: '#282c34',
    height: '300px'
  },

  h3: {
    color: '#61dafb',
    marginTop: 0
  },

  button: {
    display: 'block',
    width: '100%',
    margin: '10px 0',
    padding: '10px',
    border: '1px solid #61dafb',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    color: '#61dafb',
    cursor: 'pointer',
    transition: 'all 0.3s ease',

    '&:hover:not(:disabled)': {
      backgroundColor: '#61dafb',
      color: '#282c34'
    },

    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },

  nodesContainer: {
    textAlign: 'left',
    '& p': {
      margin: '5px 5px',
      color: 'white'
    }
  }
});
