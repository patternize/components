import * as React from 'react'

import { storiesOf } from '@storybook/react'
import { Array } from '../Array/Array';
import { BarChart } from "../BarChart/BarChart";
import { Button } from "components/Button";

storiesOf('Demo', module).add('Sorting', () => React.createElement(() => {
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
//     [5,1,4,2,8],
//     [1,5,4,2,8],
//     [1,4,5,2,8],
//     [1,4,2,5,8],
//     [1,2,4,5,8]
// ]}/>)
