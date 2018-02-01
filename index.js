/*
* @Author: limin
* @Date:   2018-01-02 15:02:17
* @Last Modified by:   limin
* @Last Modified time: 2018-01-02 16:28:49
*/

import React from 'react';
import ReactDOM from 'react-dom';

const contentList = [
    {
        id: '基本信息',
        icon: 'base',
        content: ['1111']
    },
    {
        id: '专业技能',
        icon: 'skills',
        content: ['11111', '22222']
    },
    {
        id: '工作经历',
        icon: 'experience',
        content: ['11111', '22222']
    },
    {
        id: '项目经历',
        icon: 'practice',
        content: ['11111', '22222']
    },
    {
        id: '其他',
        icon: 'other',
        content: ['11111', '22222']
    }
];
const nav = [
    {
        id: '工具集',
        url: './page/tool/index.html'
    },
    {
        id: '关于',
        url: '/'
    }
];
const contactList = [
    {
        id: 'github',
        icon: 'github',
        url: 'aaa'
    },
    {
        id: 'weibo',
        icon: 'weibo',
        url: 'aaaa'
    },
    {
        id: 'email',
        icon: 'email',
        url: 'aaa'
    }
];
class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    renderContent() {
        return (
            <ul>
                {contentList.map((opt, i) => {
                    return (
                        <li key={`list_${i}`}>
                            <h3>{opt.id}</h3>
                            <ul>
                                {opt.content.map((item, k) => {
                                    return <li key={`item_${k}`}>{item}</li>;
                                })}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        );
    }

    renderNav() {
        return (
            <ul>
                {nav.map((opt, i) => {
                    return (
                        <li key={`nav_${i}`}>
                            <a href={opt.url}>{opt.id}</a>
                        </li>
                    );
                })}
            </ul>
        );
    }

    renderContact() {
        return (
            <ul>
                {contactList.map((opt, i) => {
                    return (
                        <li key={`contact_${i}`}>
                            <a
                                href={opt.url}
                                className={opt.icon}
                                alt={opt.id}
                            />
                        </li>
                    );
                })}
            </ul>
        );
    }

    render() {
        return (
            <div className="wrapper">
                <div className="header">
                    <div className="avatar" />
                    <h1>李敏</h1>
                    <div className="sub-intro">前端开发工程师</div>
                    <div className="contact">{this.renderContact()}</div>
                </div>
                <div className="nav">
                    <span className="nav-icon" />
                    {this.renderNav()}
                </div>
                <div className="content">{this.renderContent()}</div>
                <div className="footer">
                    <p>
                        Copyright © 2016~2017 lele<a
                            href="http://www.miitbeian.gov.cn/"
                            target="_blank"
                        >
                            粤ICP备17010961号
                        </a>
                    </p>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Index />, document.querySelector('#app'));
