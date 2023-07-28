# Dynamic-CLI-Builder
一個可以讓你簡單的用 Node.js 創建動態 CLI 介面的工具

# 安裝
1. 將 DynamicCliBuilder.js 複製到你的專案
2. 使用 npm 下載 wcwidth (`npm i wcwidth`)
3. 安裝完成！

# 範例
```js
const { CLI } = require('./DynamicCliBuilder.js')

let cli = new CLI()
  .addPage('A Page', () => {return ['這是第一行', '這是第二行', '這是第三行'])
```

# 目錄
* [CLI](#cli)
  * [setLayout](#setlayout)
  * [setStyle](#setstyle)
  * [addPage](#addpage)
* [Layout](#layout)

# CLI
```js
const { CLI } = require('./DynamicCliBuilder.js')
let cli = new CLI() //創建一個 CLI
```

## setLayout()
```js
.setLayout(layout) //設定 CLI 的佈局
```
* `layout <array>`｜一個包含[佈局碼](#layout)的陣列
> 預設為 ['pageTab', 'background', 'pageContent', 'background', 'input', 'blank']

# Layout
```js
const { Layout } = require('./DynamicCliBuilder.js')
Layout.<佈局名稱> //取得佈局的佈局碼
```

| - 佈局名稱 - |  - 佈局作用 - |
