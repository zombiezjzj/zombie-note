import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '前端导航', link: '/nav', activeMatch: '^/nav' },
  { text: 'Java工程师成神之路', link: '/java/menu', activeMatch: '^/java' },
  {
    text: '前端',
    items: [
      { text: 'JavaScript 基础知识', link: '/fe/javascript/types' },
      { text: 'ES6 常用知识', link: '/fe/es6/' },
      { text: 'TypeScript 基础知识', link: '/fe/typescript/base' },
      { text: '浏览器相关知识', link: '/fe/browser/' },
      { text: '源码阅读', link: '/analysis/utils/only-allow' },
      {
        text: 'CSS 相关',
        items: [
          { text: 'CSS 语法', link: '/workflow/css/spec' },
          { text: 'CSS 奇淫技巧', link: '/workflow/css/tricks' },
          { text: 'Sass 常用技巧', link: '/workflow/sass/' }
        ]
      },
      {
        text: 'Vue 小技巧',
        link: '/workflow/vue/'
      },
      { text: 'npm 常用命令', link: '/workflow/node/npm' }
    ],
    activeMatch: '^/fe'
  },
  // { text: '踩坑记录', link: '/pit/npm', activeMatch: '^/pit' },
  {
    text: '后端',
    items: [
      { text: 'csdn', link: '/back/java/csdn' },
      { text: 'hutool', link: '/back/java/hutool' }
    ],
    activeMatch: '^/back'
  },
  {
    text: '运维',
    items: [
      {
        text: 'docker',
        items: [
          { text: 'docker 部署 elasticsearch+kibana+filebeat', link: '/operation/docker/es' },
          { text: 'docker 部署 wordpress', link: '/operation/docker/wordpress' }
        ]
      },
      {
        text: '文件服务器',
        items: [{ text: 'fastdfs', link: '/operation/fastdfs/fastdfs' }]
      }
    ],
    activeMatch: '^/operation'
  },
  {
    text: '提效工具',
    items: [
      {
        text: '软件推荐与配置',
        items: [
          { text: '多平台软件', link: '/efficiency/software/cross-platform' },
          { text: 'Mac 平台', link: '/efficiency/software/mac' },
          { text: 'Windows 平台', link: '/efficiency/software/windows' },
          { text: '浏览器设置与扩展', link: '/efficiency/software/browser' },
          { text: 'Visual Studio Code 配置', link: '/efficiency/software/vscode' },
          { text: 'WebStorm 配置', link: '/efficiency/software/webstorm' },
          { text: 'Zsh 配置', link: '/workflow/terminal/zsh' },
          { text: '命令行工具', link: '/workflow/terminal/toolkit' },
          { text: 'Shell 命令', link: '/workflow/terminal/shell' },
          { text: 'Git 相关技巧', link: '/workflow/git/' },
          { text: 'Git 命令清单', link: '/workflow/git/command' }
        ]
      },
      { text: '在线工具', link: '/efficiency/online-tools' },
      { text: '书签脚本', link: '/efficiency/bookmark-scripts' },
      {
        text: '常用工具/方法',
        items: [
          { text: '工具库整理', link: '/workflow/utils/library' },
          { text: '常用正则整理', link: '/workflow/utils/regexp' },
          { text: '常用方法整理', link: '/workflow/utils/function' }
        ]
      }
    ],
    activeMatch: '^/efficiency'
  },
  {
    text: 'zombie',
    items: [
      { text: '个人主页', link: 'http://www.zhaojing58.top' },
      {
        text: '日常笔记',
        link: 'https://github.com/zombiezjzj/zombie-note'
      }
    ]
  }
]
