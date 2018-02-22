/*
* @Author: limin
* @Date:   2018-01-02 15:02:17
* @Last Modified by:   limin
* @Last Modified time: 2018-01-02 16:28:49
*/
import './index.less';

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
const contactList = [
    {
        id: 'blog',
        icon: 'blog',
        url: '/one_hour'
    },
    {
        id: 'github',
        icon: 'github',
        url: 'https://github.com/foxlele2014'
    },
    {
        id: 'email',
        icon: 'email',
        url: '503275769@qq.com'
    },
    {
        id: 'weibo',
        icon: 'weibo',
        url: 'https://weibo.com/2433799657/profile?rightmod=1&wvr=6&mod=personnumber'
    }
];
class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    renderContent() {
        return (
            <ul className="content-ul">
                {contentList.map((opt, i) => {
                    return (
                        <li key={`list_${i}`} className="content-li">
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

    renderContact() {
        return (
            <ul>
                {contactList.map((opt, i) => {
                    return (
                        <li key={`contact_${i}`} className={`contact-${opt.id}`}>
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
                    <div className="box">
                        <div className="avatar" />
                        <h1>李敏</h1>
                        <p className="sub-intro">前端开发工程师</p>
                        <div className="contact">{this.renderContact()}</div>
                    </div>
                </div>
                <div className="content">{this.renderContent()}</div>
                <div className="footer">
                    <p>
                        Copyright © 2016~2018 lele<a
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
