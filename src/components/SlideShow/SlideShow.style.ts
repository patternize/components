import { createUseStyles } from 'react-jss';

export default createUseStyles((theme: any) => ({
  slideshow: {
    width: '100%',
    height: '600px'
  },
  slides: {
    height: '90%',
    width: '100%',
    margin: '0 auto',
    display: 'table',
    position: 'relative'
  },
  img: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    '-webkit-transition': 'opacity 1s ease-in-out',
    '-moz-transition': 'opacity 1s ease-in-out',
    '-o-transition': 'opacity 1s ease-in-out',
    transition: 'opacity 1s ease-in-out',
    display: 'table-cell',
    opacity: 0
  },
  imgActive: {
    composes: '$img',
    opacity: 100
  },

  slidesNav: {
    display: 'flex',
    height: '40px',
    'justify-content': 'space-between'
  },

  button: {
    'background-color': '#30b73',
    border: 'none',
    color: 'white',
    padding: '3px',
    'text-align': 'center',
    'text-decoration': 'none',
    display: 'inline-flex',
    'font-size': '16px',
    margin: '2px 2px',
    cursor: 'pointer',

    left: {
      float: 'left'
    },
    right: {
      float: 'right'
    }
  }
}));
