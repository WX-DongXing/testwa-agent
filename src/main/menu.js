import { app } from 'electron'

export const menu = [
  {
    label: app.getName(),
    submenu: [
      {label: '关于Testwa', role: 'about'},
      {label: '了解更多', click () { require('electron').shell.openExternal('www.testwa.com') }},
      {type: 'separator'},
      {label: '退出', role: 'quit'},
      {label: '关闭', role: 'close'},
      {label: '最小化', role: 'minimize'},
      {label: '全屏', role: 'togglefullscreen'}
    ]
  }, {
    label: '编辑',
    submenu: [
      {label: '撤销', role: 'undo'},
      {label: '重做', role: 'redo'},
      {type: 'separator'},
      {label: '剪切', role: 'cut'},
      {label: '复制', role: 'copy'},
      {label: '粘贴', role: 'paste'},
      {label: '粘贴并匹配样式', role: 'pasteandmatchstyle'},
      {label: '删除', role: 'delete'},
      {label: '全选', role: 'selectall'}
    ]
  }
]
