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
  .addPage('A Page', () => {return ['這是一頁'])
```

#目錄
* [CLI](#cli)
 * [layout](#layout)
 * [style](#style)
 * [pages](#pages)
 * [data](#data)
 * [setLayout()](#setLayout)

# CLI
```js
let cli = new CLI() //創建一個 CLI
```

## layout
```js
cli.layout //取得 CLI 的佈局
```
* 返回一個 `<array>`

## style
```js
cli.style //取得 CLI 的風格
```
* 返回一個 `object`
