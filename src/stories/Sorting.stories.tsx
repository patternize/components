import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { Array } from 'visualizations/Array';
import { BarChart } from "visualizations/BarChart";
import { Button } from "components";

storiesOf('Demo', module).add('Bubble Sort', () => React.createElement(() => {
    const [index, setIndex] = React.useState(0);
    const data = [
        [5,1,4,2,8],
        [1,5,4,2,8],
        [1,4,5,2,8],
        [1,4,2,5,8],
        [1,2,4,5,8]
    ];

    return (
        <div className={'controller'}>
            <Array data={data[index]} />
            <BarChart data={data[index]} />
            <br/>
            <Button onClick={() => setIndex(index-1)} disabled={index == 0}>
                Previous
            </Button>
            <Button onClick={() => setIndex(index+1)} disabled={index == data.length - 1}>
                Next
            </Button>
        </div>
    )
}));

storiesOf('Demo', module).add('Selection Sort', () => React.createElement(() => {
    const [index, setIndex] = React.useState(0);
    const data = [
        [29, 72, 98, 13, 87, 66, 52, 51, 36],
        [13, 72, 98, 29, 87, 66, 52, 51, 36],
        [13, 29, 98, 72, 87, 66, 52, 51, 36],
        [13, 29, 36, 72, 87, 66, 52, 51, 98],
        [13, 29, 36, 51, 87, 66, 52, 72, 98],
        [13, 29, 36, 51, 52, 66, 87, 72, 98],
        [13, 29, 36, 51, 52, 66, 72, 87, 98],
    ];

    return (
        <div className={'controller'}>
            <Array data={data[index]} />
            <BarChart data={data[index]} />
            <br/>
            <Button onClick={() => setIndex(index-1)} disabled={index == 0}>
                Previous
            </Button>
            <Button onClick={() => setIndex(index+1)} disabled={index == data.length - 1}>
                Next
            </Button>
        </div>
    )
}));
