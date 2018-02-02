/*
* @Author: limin
* @Date:   2018-01-02 14:55:24
* @Last Modified by:   limin
* @Last Modified time: 2018-01-02 16:35:50
*/

import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import tools from '../../tools/tools';

class Tools extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        console.log(tools);
    }

    renderTools(list) {
        return (
            <div className="box">
                <div className="classify">{list.name}</div>
                <ul className="tools-list">
                    {list.collection.map((opt, i) => {
                        return (
                            <li key={i}>
                                <a href={opt.url} target="_blank">
                                    <div className="img-box">aaa</div>
                                    <div className="desc-box">
                                        <h3>{opt.name}</h3>
                                        <div className="">
                                            {opt.description}
                                        </div>
                                    </div>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    renderNav(collection) {
        return (
            <ul className="nav">
                {collection.map((opt, i) => {
                    return <li key={i}>{opt.name}</li>;
                })}
            </ul>
        );
    }

    render() {
        return (
            <div className="tools-wrapper">
                <div className="tools-nav">
                    {this.renderNav(tools.collection)}
                </div>
                <ul>
                    {tools.collection.map((opt, i) => {
                        return (
                            <li key={i}>
                                {opt.collection && opt.collection.length
                                    ? this.renderTools(opt)
                                    : null}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

ReactDOM.render(<Tools />, document.querySelector('#tools'));
