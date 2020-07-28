import React, { Component } from 'react';
import { getEnv, parseQuery } from '../../common/utils';
import { Button } from 'antd';
import styles from './index.scss';
import { createHashHistory } from 'history'

const history = createHashHistory();

export default class VideoPlayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      videoName: '',
      collectionName: '从基础到实战 手把手带你掌握新版Webpack4.0',
      rate: '1',
    }
  }
  componentDidMount() {
    const collectionName = parseQuery()['name'];
    this.setState({
      collectionName,
    })
    fetch(`${getEnv()}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `collectionName=${collectionName}`
    },).then(res => res.json()).then(res => {
      const data = res.data;
      const videoName = typeof(data[0]) === 'string' ? data[0] : data[0].list[0];
      const src = typeof(data[0]) === 'string' ? data[0] : `${data[0].name}/${data[0].list[0]}`;
      this.setState({
        data,
        videoName,
        src,
      });
    })
    // fetch(`${getEnv()}/getFiles`, {
    //   method: 'POST'
    // }).then(res => res.json()).then(data => {
    //   this.setState({
    //     data: data?.data,
    //     src: data?.data[0],
    //   });
    // })
  }

  renderList() {
    const { data } = this.state;

    return (
      <ul className={styles['nav-list']}>{data && data.map((item) => {
        if(typeof(item) === 'string') {
          return (
            <li
              className={styles['list-item']}
              onClick={() => {
                this.setState({
                  src: item,
                  videoName: item
                })
              }}
            ><i className={`iconfont ${styles['player-icon']}`}>&#xe6fa;</i>{item}</li>
          )
        } else {
          return (
            <li>
              <div className={styles['chapter-title']}>{item.name}</div>
              <ul>
                {item.list.map((video) => {
                  return (
                    <li
                      className={styles['list-item']}
                      onClick={() => {
                        this.setState({
                          videoName: video,
                          src: `${item.name}/${video}`
                        })
                      }}
                    ><i className={`iconfont ${styles['player-icon']}`}>&#xe6fa;</i>{video}</li>
                  )
                })}
              </ul>
            </li>
          )
        }
        
      })}
    </ul>
    )
  }

  setRate(rate) {
    const video = document.getElementById('video');
    video && (video.playbackRate = rate);
  }

  render() {
    this.setRate(this.state.rate);
    const { collectionName } = this.state;
    return (
      <div className={styles['video-player']}>
        <header>
          <div
            className={styles['return-btn']}
            onClick={() => {
              // 路由跳转
              history.push('/');
            }}
          >
            <i className={`iconfont ${styles['return-icon']}`}>&#xe677;</i>
            <span className={styles['homepage-text']}>首页</span>
          </div>
          <div className={styles['collection-name']}>
            <span>{this.state.collectionName}</span>
          </div>
        </header>
        <div className={styles['container']}>
          <div className={styles['sidebar-container']}>
            <div className={styles['is-playing']}>
              <div>正在播放：</div>
              <div>{this.state.videoName}</div>
            </div>
            {this.renderList()}
          </div>
          <div className={styles['content-container']}>
            <video id="video" className={styles['abc']} src={`./videos/${collectionName}/${this.state.src}`} controls width="900px" />
            <div className={styles['rate-control']}>
              <Button onClick={() => {
                this.setState({
                  rate: '1'
                });
              }}>1倍速</Button>
              <Button onClick={() => {
                this.setState({
                  rate: '1.5'
                })
              }}>1.5倍速</Button>
              <Button onClick={() => {
                this.setState({
                  rate: '1.75'
                })
              }}>1.75倍速</Button>
              <Button onClick={() => {
                this.setState({
                  rate: '2'
                })
              }}>2倍速</Button>
              <a download href={'./videos/' + this.state.src} style={{color: '#fff'}}>
                下载
              </a>
            </div>
          </div>
        </div>
      </div>
      
    )
  }
}