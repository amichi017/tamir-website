import React, { Component } from 'react';

class Progress extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div style={{
                height: 8,
                backgroundColor: 'rgb(183, 182, 184)',
                borderRadius: 5
            }}>
                <div
                    style={{
                        backgroundColor: 'rgb(122, 235, 112)',
                        margin: 0,
                        borderRadius: 5,
                        width: this.props.progress + '%'
                    }}
                />
            </div>
        )
    }
}
export default Progress