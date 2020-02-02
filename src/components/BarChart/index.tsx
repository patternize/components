import * as React from "react";
import BarChart from "./BarChart";
import "./BarChart.scss";

const { useState } = React;

function App() {
    const [data, setData] = useState([25, 30, 45, 60, 10, 65, 75]);

    return (
        <div className={'root'}>
            <BarChart data={data} />
            <button onClick={() => setData(data.map(value => value + 5))}>
                Update data
            </button>
            <button onClick={() => setData(data.filter(value => value < 35))}>
                Filter data
            </button>
            <button
                onClick={() => setData([...data, Math.round(Math.random() * 100)])}
            >
                Add data
            </button>
        </div>
    );
}

export default App;