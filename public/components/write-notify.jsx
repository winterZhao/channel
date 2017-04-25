
import React from 'react';
import axios from 'axios';
import { Button } from 'antd';
const ButtonGroup = Button.Group;

class WriteNotify extends React.Component {
    constructor(props) {
        super(props);
        this.postNotify = this.postNotify.bind(this);
    }
    postNotify() {
        var obj = {};
        obj.data = document.getElementById('notify').value;
        axios
            .post(this.props.url, obj)
            .then((json) => {

                if ( json.data.success ) {
                    alert('发布成功');
                    location.reload();
                } else {
                    alert('发布失败,重新发布');
                }
            })
            .catch(()=>{
                alert('发布失败,重新发布');
            })
    }
    render() {

        return (
            <div>
                <textarea name="" id="notify" cols="80" rows="10" name="data"></textarea>
                <br/><br/>
                <Button type="primary" htmlType="button" onClick={this.postNotify}>发布</Button>
            </div>
        )
    }
}

export default WriteNotify;