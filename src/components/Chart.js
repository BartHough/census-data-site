import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
  }
  messagesEndRef = React.createRef()
  // componentWillMount() {
    
  // }
  componentDidMount() {
    this.scrollToBottom()
    this.getAvgData();
  }
  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }
  getAvgData() {
    let labels = []
    let months = false;
    if (this.props.title.includes('Quarterly')) {
      labels = ['Q1', 'Q2', 'Q3', 'Q4'];
    }
    else {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      months = true;
    }
    let avgData = []
    labels.forEach(label => {
      let search = '';
      if (months) {
        let temp = labels.indexOf(label) + 1;
        if (temp < 10) {
          search = temp.toString();
          search = '0' + search;
        }
        else {
          search = temp.toString();
        }
      }
      else {
        search = label;
      }
      let avg = 0;
      let count = 0;
      let sum = 0;
      this.props.labels.forEach((dataPoint, index) => {
        let temp = dataPoint;
        if (months) {
          temp = dataPoint.split('-')[1];
        }
        if (temp === search) {
          sum += parseInt(this.props.data[index]);
          count += 1;
        }
      })
      avg = sum / count;
      avgData.push(avg);
      console.log(search + ' ' + avg)
    })
    let render = false;
    if (avgData.length > 1) {
      render = true;
    }
    avgData.forEach(data => {
      if(!data){
        render = false;
      }
    })
    this.props.updateAvgData(labels, avgData, render);
  }

  getData() {
    return {
      labels: this.props.labels,
      datasets: [
        {
          label: this.props.title,
          fill: false,
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
        <Line data={this.getData}
          width={500}
          height={300}
          options={{ maintainAspectRatio: false }}
        />
        <div ref={this.messagesEndRef} />
      </div>
    )
  }
}

export default Chart;
