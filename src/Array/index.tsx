import * as React from "react";
import { Array } from "./Array";
import { Button } from 'components/Button';

const { useState } = React;

interface IProps {
    data: number[][];
}

export default function ArrayController({ data }: IProps) {
    const [index, setIndex] = useState(0);

    return (
        <div className={'root'}>
            <Array data={data[index]} />

            <br/>
            <Button onClick={() => setIndex(index-1)} disabled={index == 0}>
                Previous
            </Button>
            <Button onClick={() => setIndex(index+1)} disabled={index == data.length - 1}>
                Next
            </Button>
        </div>
    );
}
