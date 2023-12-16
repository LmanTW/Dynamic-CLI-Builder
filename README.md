# Dynamic-CLI-Builder
A tool in Node.js to build a dynamic CLI.

## Example
```js
const { CLI } = require('./DynamicCliBuilder.js')

let cli = new CLI()
  .addPage('page1', 'A Page', () => ['Apple', 'Banana', 'Orange'])
```

## Dependence
* [wcwidth](https://www.npmjs.com/package/wcwidth)
* [readline](https://www.npmjs.com/package/readline)

## Contents
* [DynamicCliBuilder](#dynamicclibuilder)
  * [pages](#pages)
  * [input](#input)
  * [currentPage](#currentpage)
  * [setLayout()](#setlayout)
  * [setStyle()](#setstyle)
  * [addPage()](#addpage)
  * [removePage()](#removepage)
  * [listen()](#listen)
* [Layout](#layout)
* [FontColor](#fontcolor)
* [BackgroundColor](#backgroundcolor)

# DynamicCliBuilder
```js
const { DynamicCliBuilder } = require('./DynamicCliBuilder.js')
let cli = new DynamicCliBuilder(options) //Create a CLI
```
* `options <object>`
  * `updateInterval <number>` | The interval between update (display)
 
## pages
```js
.page //Get pages
```
return an `<array>` containing page IDs

## input
```js
.input //Get input
```
return an `<string>`

## currentPage
```js
.currentPage //Get current page
```
return an `<string>` which is the id of current page

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

### Example
```js
.listen('switchPage', (pageID) => {
  //Do something
})
```

### Events
| name       | callback data | description                       |
| ---        | ---           | ---                               |
| switchPage | (pageID)      | Triggered when user switches pages|
| enter      | (input)       | Triggered when user press enter   |
| input      | (key)         | Triggered when user input         |

# Layout
```js
const { Layout } = require('./DynamicCliBuilder.js')
Layout.<name>() //Get layout data
```

| name       | parameter    | description                  |
| ---        | ---          | ---                          |
| blank      | ()           | A blank line                 |
| text       | (content)    | A line of text               |
| pageTabs   | ()           | A line of page tabs          |
| pageContent| ()           | Multiple line of page content|
| input      | (placeholder)| A line of input              |

# FontColor
```js
const { FontColor } = require('./DynamicCliBuilder.js')
FontColor.<name> //Get color code
```
| name        | code    |
| ---         | ---     |
| reset       | \x1b[0m |
| red         | \x1b[31m|
| brightRed   | \x1b[92m|
| yellow      | \x1b[33m|
| brightYellow| \x1b[93m|
| green       | \x1b[32m|
| brightGreen | \x1b[92m|
| cyan        | \x1b[36m|
| brightCyan  | \x1b[96m|
| blue        | \x1b[34m|
| brightBlue  | \x1b[94m|
| purple      | \x1b[35m|
| brightPurple| \x1b[95m|
| white       | \x1b[97m|
| black       | \x1b[30m|
| gray        | \x1b[90m|

# BackgroundColor
```js
const { BackgroundColor } = require('./DynamicCliBuilder.js')
BackgroundColor.<name> //Get color code
```
| name        | code     |
| ---         | ---      |
| reset       | \x1b[0m  |
| red         | \x1b[41m |
| brightRed   | \x1b[101m|
| yellow      | \x1b[43m |
| brightYellow| \x1b[103m|
| green       | \x1b[42m |
| brightGreen | \x1b[102m|
| cyan        | \x1b[46m |
| brightCyan  | \x1b[106m|
| blue        | \x1b[44m |
| brightBlue  | \x1b[104m|
| purple      | \x1b[45m |
| brightPurple| \x1b[105m|
| white       | \x1b[107m |
| black       | \x1b[40m |
| gray        | \x1b[100m |
