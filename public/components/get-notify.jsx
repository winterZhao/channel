
import React from 'react';
import axios from 'axios';

class GetNotify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: ''
        }
    }
    componentDidMount() {
        var url = '/notify';

        axios
            .get(url)
            .then((json)=>{
                this.setState({'msg': json.data.data})
            })
    }
    render() {
        var msg = this.state.msg;
        return (
            <p>
                {msg}
            </p>
        )
    }
}

export default GetNotify;