/*
* @Author: limin
* @Date:   2018-01-02 15:02:17
* @Last Modified by:   limin
* @Last Modified time: 2018-01-02 16:28:49
*/

import React from 'react';
import ReactDOM from 'react-dom';

class Index extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {};
    }

    render() {

        return (
            <div className="wrapper">
                <div className="header">
                    <h1>比你还无聊</h1>
                </div>
                <div className="content">
                    {/*<img src={require('./assets/img/WX20171112-144427.png')} />*/}
                    <a href="./page/tool/index.html">工具集</a>
                </div>
                <div className="footer">
                    <p>Copyright © 2016~2017 lele<a href="http://www.miitbeian.gov.cn/" target="_blank">粤ICP备17010961号</a></p>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Index />,document.querySelector('#app'));