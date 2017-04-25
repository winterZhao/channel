
import React from 'react';
import axios from 'axios';
import { userStore } from '../store/index.jsx';

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
                userStore.dispatch({type: 'user', msg: json.data.username})
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