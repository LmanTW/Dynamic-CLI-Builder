# Dynamic-CLI-Builder
A tool in Node.js to build a dynamic CLI.

## Example
```
const { CLI } = require('./DynamicCliBuilder.js')

let cli = new CLI()
  .addPage('page1', 'A Page', () => {return ['Apple', 'Banana', 'Orange'])
```

## Contents
* [DynamicCliBuilder](#dynamicclibuilder)
  * [setLayout()](#setlayout)
  * [setStyle()](#setstyle)
  * [addPage()](#addpage)
  * [removePage()](#removepage)
  * [listen()](#listen)
* [Layout](#layout)

# DynamicCliBuilder
```js
const { DynamicCliBuilder } = require('./DynamicCliBuilder.js')
let cli = new DynamicCliBuilder(options) //Create a CLI
```
* `options <object>`
  * `updateInterval <number>` | The interval between update (display)
 
## setLayout()
```js
.setLayout(layout) //Set the layout of the CLI
```
* `layout <array>` | An array contained [Layout](#layout)

## setStyle()
```js
.setStyle(style) //Set the style of the CLI
```
* `style <object>` | An object contained "style codes" and colors
```js
//Default Style
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
.addPage(id, name, callback) //Add page
```
* `id <string>` | The id of the page
* `name <string>` | The name of the page
* `callback <function>` | The callback function to get page content (this function must return an array)

## removePage()
```js
.removePage(id) //Remove page
```
* `id <string>` | The id of the page

## listen()
```js
.listen(name, callback) //Listen to event
```
* `name <string>` | The name of the event
* `callback <function>` | The callback of the event

# Layout
```js
const { Layout } = require('./DynamicCliBuilder.js')
Layout.<name>() //Get Layout Data
```

| name       | parameter    | description                  |
| ---        | ---          | ---                          |
| blank      | ()           | A blank line                 |
| text       | (content)    | A line of text               |
| pageTabs   | ()           | A line of page tabs          |
| pageContent| ()           | Multiple line of page content|
| input      | (placeholder)| A line of input              |
