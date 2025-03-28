import { createUseStyles } from 'react-jss';

export default createUseStyles({
  page: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    willChange: 'transform'
  },
  pageDiv: {
    touchAction: 'none',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    width: '100%',
    height: '100%',
    willChange: 'transform'
    // boxShadow:
    //   '0 62.5px 125px -25px rgba(50, 50, 73, 0.5), 0 37.5px 75px -37.5px rgba(0, 0, 0, 0.6)'
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center'
  },
  wrapper: {
    width: '100%',
    height: '100%'
  }
});
