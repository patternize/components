import { createUseStyles } from 'react-jss';

const colorBg = '#000000';

export default createUseStyles({
  treechart: {
    overflow: 'visible',
    display: 'block',
    width: '100%',
    'padding-left': '30px'
  },

  label: {
    textAnchor: 'middle',
    fontSize: '24px',
    fill: colorBg
  },

  link: {
    stroke: colorBg
  },

  node: {
    fill: colorBg
  }
});
