import React, { Component } from 'react'
import Loader from 'react-loader-spinner';

class Spinner extends Component {
    loadingRef = React.createRef()

    componentDidMount() {
        this.scrollToBottom()
    }
    componentDidUpdate() {
        this.scrollToBottom()
    }
    scrollToBottom = () => {
        this.loadingRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    render() {
        return (
            <div>
                <Loader
                    type='Grid'
                    color='#4bc0c0'
                    height={80}
                    width={80}
                />
                <div ref={this.loadingRef} />
            </div>
        )
    }
}

export default Spinner;
