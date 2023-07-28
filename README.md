# Dynamic-CLI-Builder
一個可以讓你簡單的用 Node.js 創建動態 CLI 介面的工具

# 範例
```js
const { CLI } = require('./DynamicCliBuilder.js')

let cli = new CLI()
  .addPage('A Page', () => {return ['這是第一行', '這是第二行', '這是第三行'])
```

# 安裝
1. 將 DynamicCliBuilder.js 複製到你的專案
2. 使用 npm 下載 wcwidth (`npm i wcwidth`)
3. 安裝完成！

# 目錄
* [CLI](#cli)
  * [setLayout](#setlayout)
  * [setStyle](#setstyle)
  * [addPage](#addpage)
  * [removePage](#removepage)
  * [setInput](#setinput)
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

## setStyle()
```js
.setStyle(style) //設定 CLI 的風格 (顏色)
```
* `style <object>`｜一個包含風格的物件 (必須一次提供以下所有的資料)
```js
//預設風格
{
  background: BackgroundColor.reset,

  selectBackground: BackgroundColor.white,
  selectFont: FontColor.gray,
  notSelectBackground: BackgroundColor.gray,
  notSelectFont: FontColor.white
}
```

## addPage()
```js
.addPage(name, callback, hide) //添加頁面
```
* `name <string>`｜頁面的名稱 (不可重複)
* `callback <function>`｜頁面顯示時呼叫的函數，此函數必須返回一個陣列，此陣列將會為此頁面的內容
* `hide <boolean>`｜是否要在 pageTab 上隱藏該頁面，如果為 true，用戶將不能切換到此介面，只能由程式切換

## removePage()
```js
.removePage(name) //移除頁面
```
* `name <string>`｜要移除的頁面的名稱

## switchPage()
```js
.switchPage(index) //切換頁面
```
* `index <number>`｜頁面的索引 (頁面是用陣列進行儲存的，所以頁面的索引跟他被添加的順序有關)

## setInput ()
```js
.setInput(string)｜設定輸入
```
* `string <string>`｜設定輸入的內容

# Layout
```js
const { Layout } = require('./DynamicCliBuilder.js')
Layout.<佈局名稱> //取得佈局的佈局碼
```
* 
