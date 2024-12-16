import { createUseStyles } from 'react-jss';

export default createUseStyles({
  controller: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    '& > *:not(:first-child)': {
      // This targets all buttons after the chart
      marginTop: '8px'
    }
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center'
  }
});
