import React, { Component } from 'react'
import Chart from './Chart';

export function ChartWrapper(props) {
    if (props.data) {
        return <Chart data={props.data} labels={props.labels} title={props.title} />
    }
    else {
        return <div></div>
    }
}


export default ChartWrapper
