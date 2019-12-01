import React, { Component } from 'react';
import { Radar } from 'react-chartjs-2';

export class AverageChart extends Component {
    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this);
    }
    endRef = React.createRef();

    componentDidMount() {
        this.scrollToBottom();
    }
    scrollToBottom = () => {
        this.endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    getData() {
        return {
            labels: this.props.labels,
            datasets: [
                {
                    label: 'Average ' + this.props.title + ' (thousands)',
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.props.data
                }
            ]
        };
    }
    render() {
        return (
            <div>
                <Radar data={this.getData}
                    width={500}
                    height={300}
                    options={{ maintainAspectRatio: false }}
                />
                <div ref={this.endRef} />
            </div>
        )
    }
}

export default AverageChart
