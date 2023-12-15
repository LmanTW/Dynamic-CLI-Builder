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
.setLayout(layout)
```
* `layout <array>` | An array contained [Layout](#layout)
