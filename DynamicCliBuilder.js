const readline = require('readline')
const wcwidth = require('wcwidth')

// Dynamic CLI Builder
class DynamicCliBuilder {
  #layout = [Layout.pageTabs(), Layout.blank(), Layout.pageContent(), Layout.blank(), Layout.input()]
  #style = {
    background: BackgroundColor.reset,

    selectBackground: BackgroundColor.white,
    selectFont: FontColor.gray,
    notSelectBackground: BackgroundColor.gray,
    notSelectFont: FontColor.white
  }

  #pages = {}

  #events = {}

  #data = {
    input: '',
    currentPage: undefined
  }

  constructor (options) {
    options = Object.assign({
      updateInterval: 50
    }, (options === undefined) ? {} : options)

    readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    process.stdin.on('data', (data) => this.#inputHandler(data))

    setInterval(() => {
      this.#display()
    }, options.updateInterval)
  }

  get pages () {return Object.keys(this.#pages)}
  get input () {return this.#data.input}
  get currentPage () {return this.#data.currentPage}

  set input (data) {this.#data.input = data}

  // Set Layout
  setLayout (layout) {
    layout.forEach((item) => {
      if (!['blank', 'text', 'pageTabs', 'pageContent', 'input'].includes(item.type)) throw new Error(`Layout Type Not Found: ${item.type}`)
    })

    this.#layout = layout

    return this
  }

  // Set Style
  setStyle (style) {
    this.#style = Object.assign(this.#style, style)

    return this
  }

  // Add Page
  addPage (id, name, callback) {
    if (this.#pages[id] !== undefined) throw new Error(`Page With ID "${id}" Already Exist`)
    if (!Array.isArray(callback())) throw new Error(`Callback Must Return An Array`)

    if (Object.keys(this.#pages).length < 1) this.#data.currentPage = id 

    this.#pages[id] = { name, callback, cursorY: 0, scrollY: 0 }

    return this
  }

  // Remove Page
  removePage (id) {
    if (this.#pages[id] === undefined) throw new Error(`Page Not Found: ${id}`)

    if (this.#data.currentPage === id) this.#data.currentPage = Object.keys(this.#pages)[0]

    delete this.#pages[id]

    return this
  }

  // Switch Page
  switchPage(id) {
    if (this.#pages[id] === undefined) throw new Error(`Page Not Found: ${id}`)

    this.#data.currentPage = id
  }

  // Listen To Event
  listen (name, callback) {
    if (this.#events[name] === undefined) this.#events[name] = []

    this.#events[name].push(callback)

    return this
  }

  #callEvent (name, data) {
    if (this.#events[name] !== undefined) this.#events[name].forEach((item) => item(data))
  }

  // Display
  #display () {
    let lines = []

    this.#layout.forEach((item) => lines = lines.concat(this.#displayComponent(item)))

    lines = lines.slice(0, process.stdout.rows-1).map((item) => {
      let planTextData = sperateColorCode(item)
      let planText = planTextData.map((item) => item.text).join('')

      if (wcwidth(planText) < process.stdout.columns) planTextData.push({ color: this.#style.background, text: ' '.repeat(process.stdout.columns-wcwidth(planText)) })
      else if (wcwidth(planText)+(getNewlineAmount(planText)*2) > process.stdout.columns) {
        while (wcwidth(planText)+(getNewlineAmount(planText)*2) > process.stdout.columns) {
          planTextData = planTextData.slice(0, planTextData.length-1)
          planText = planText.substring(0, planText.length-1)
        }
      }

      return `${this.#style.background}${planTextData.map((item2) => (item2.color === undefined) ? item2.text : `${item2.color}${item2.text}`).join('')}`
    })

    process.stdout.write(`\x1B[2J\x1B[3J\x1B[H\x1Bc${lines.map((item) => item.replaceAll('\n', '\\n')).join('\n')}\n${FontColor.reset}`)
  }

  // Display Component
  #displayComponent (data) {
    if (data.type === 'blank') return [this.#style.background] 
    if (data.type === 'text') return [data.callback()]
    if (data.type === 'pageTabs') {
      let tabs = []

      Object.keys(this.#pages).forEach((item) => {
        if (item === this.#data.currentPage) tabs.push(`${this.#style.selectBackground} ${this.#style.selectFont}${this.#pages[item].name} ${this.#style.background}`)
        else tabs.push(`${this.#style.notSelectBackground} ${this.#style.notSelectFont}${this.#pages[item].name} ${this.#style.background}`)
      })

      return [` ${tabs.join(' ')} `]
    }
    if (data.type === 'pageContent') {
      let lines = []

      let pageData = this.#pages[this.#data.currentPage].callback()

      for (let i = this.#pages[this.#data.currentPage].scrollY; i < this.#pages[this.#data.currentPage].scrollY+(process.stdout.rows-this.#layout.length) && i < pageData.length; i++) {
        let lineNumber = ((i+1).toString().length > 1) ? (i+1).toString() : ` ${(i+1).toString()}`

        if (this.#pages[this.#data.currentPage].cursorY === i) lines.push(`${this.#style.selectBackground} ${this.#style.selectFont}${lineNumber}${FontColor.reset}${this.#style.background} | ${pageData[i]}`)
        else lines.push(` ${lineNumber} | ${pageData[i]}`)
      }

      if (lines.length < process.stdout.rows-this.#layout.length) {
        while (lines.length < process.stdout.rows-this.#layout.length) lines.push('')
      }

      if (this.#pages[this.#data.currentPage].cursorY > pageData.length) {
        this.#pages[this.#data.currentPage].cursorY = pageData.length-1
        this.#pages[this.#data.currentPage].scrollY = pageData.length-(process.stdout.rows-this.#layout.length)
        
        if (this.#pages[this.#data.currentPage].scrollY < 0) this.#pages[this.#data.currentPage].scrollY = 0
      }

      return lines
    }
    if (data.type === 'input') {
      let string = ` ${(this.#data.input.length > 0) ? `${this.#style.selectBackground}${this.#style.selectFont}` : `${this.#style.notSelectBackground}${this.#style.notSelectFont}`} `

      if (this.#data.input.length > 0) string+=this.#data.input
      else {
        if (data.placeholder === undefined) string+=`⇧⇩ Scroll | ⇦⇨ Switch Page | Type to give input`
        else string+=data.placeholder
      }

      string+=' '.repeat(process.stdout.columns-wcwidth(sperateColorCode(string).map((item) => item.text).join('')+' '))
      string+=this.#style.background
    
      return string
    }
  }

  // Input Handler
  #inputHandler (data) {
    if ([keys.upArrow, keys.downArrow, keys.leftArrow, keys.rightArrow].includes(data.toString('hex'))) {
      let page = this.#pages[this.#data.currentPage]

      if (page === undefined) return

      if (data.toString('hex') === keys.upArrow) {
        if (page.cursorY > page.scrollY) page.cursorY--
        else if (page.scrollY > 0) {
          page.cursorY--
          page.scrollY--
        }
      } else if (data.toString('hex') === keys.downArrow) {
        let pageData = page.callback()

        if (page.cursorY-page.scrollY < (process.stdout.rows-this.#layout.length)-1 && page.cursorY < pageData.length-1) page.cursorY++
        else if (page.cursorY < pageData.length-1) {
          page.cursorY++
          page.scrollY++
        }
      } else if (data.toString('hex') === keys.leftArrow) {
        let pages = Object.keys(this.#pages)

        if (pages.indexOf(this.#data.currentPage) < 1) this.#data.currentPage = pages[pages.length-1]
        else this.#data.currentPage = pages[pages.indexOf(this.#data.currentPage)-1]

        this.#callEvent('switchPage', this.#data.currentPage)
      } else if (data.toString('hex') === keys.rightArrow) {
        let pages = Object.keys(this.#pages)

        if (pages.indexOf(this.#data.currentPage) > pages.length-2) this.#data.currentPage = pages[0]
        else this.#data.currentPage = pages[pages.indexOf(this.#data.currentPage)+1]

        this.#callEvent('switchPage', this.#data.currentPage)
      }
    } else if (data.toString('hex') === keys.enter) {
      if (this.#data.input === '') {
        if (this.#pages[this.#data.currentPage] !== undefined) this.#callEvent('select', { page: this.#data.currentPage, cursorY: this.#pages[this.#data.currentPage].cursorY })
      } else {
        this.#callEvent('enter', this.#data.input)

        this.#data.input = ''
      }
    } else if (data.toString('hex') === keys.backspace) {
      if (this.#data.input.length > 0) this.#data.input = this.#data.input.substring(0, this.#data.input.length-1)

      this.#callEvent('input', data)
    } else {
      this.#data.input+=data.toString().replaceAll('\n')

      this.#callEvent('input', data)
    }
  }
}

// Separate Color Code From Text
function sperateColorCode (text) {
  let letters = []
  let color

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\x1b') {
      if (color === undefined) color = ''

      let oldIndex = i

      while (text[i] !== 'm' && i < text.length) {
        color+=text[i]

        i++
      }

      if (text[i] === 'm') color+='m'
      else {
        i = oldIndex

        color
      }
    } else {
      if (color === undefined) letters.push({ text: text[i] })
      else {
        letters.push({ color, text: text[i] })

        color = undefined
      }
    }
  }

  return letters
}

// Get Newline amount
function getNewlineAmount (text) {
  let amount = 0

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\n') amount++
  }

  return amount
}

// Layout
class Layout {
  static blank () {return { type: 'blank' }}
  static text (callback) {return { type: 'text', callback }}
  static pageTabs () {return { type: 'pageTabs' }}
  static pageContent () {return { type: 'pageContent' }}
  static input (placeholder) {return { type: 'input', placeholder }}
}

// Font Color
class FontColor {
  static get reset () {return '\x1b[0m'}

  static get red () {return '\x1b[31m'}
  static get brightRed () {return '\x1b[92m'}

  static get yellow () {return '\x1b[33m'}
  static get brightYellow () {return '\x1b[93m'}

  static get green () {return '\x1b[32m'}
  static get brightGreen () {return '\x1b[92m'}

  static get cyan () {return '\x1b[36m'}
  static get brightCyan () {return '\x1b[96m'}

  static get blue () {return '\x1b[34m'}
  static get brightBlue () {return '\x1b[94m'}

  static get purple () {return '\x1b[35m'}
  static get brightPurple () {return '\x1b[95m'}

  static get white () {return '\x1b[97m'}
  static get black () {return '\x1b[30m'}
  static get gray () {return '\x1b[90m'}
}

// Background Color
class BackgroundColor {
  static get reset () {return '\x1b[0m'}

  static get red () {return '\x1b[41m'}
  static get brightRed () {return '\x1b[101m'}

  static get yellow () {return '\x1b[43m'}
  static get brightYellow () {return '\x1b[103m'}

  static get green () {return '\x1b[42m'}
  static get brightGreen () {return '\x1b[102m'}

  static get cyan () {return '\x1b[46m'}
  static get brightCyan () {return '\x1b[106m'}

  static get blue () {return '\x1b[44m'}
  static get brightBlue () {return '\x1b[104m'}

  static get purple () {return '\x1b[45m'}
  static get brightPurple () {return '\x1b[105m'}

  static get white () {return '\x1b[107m'}
  static get black () {return '\x1b[40m'}
  static get gray () {return '\x1b[100m'}
}

module.exports = { DynamicCliBuilder, Layout, FontColor, BackgroundColor }

const keys = {
  'upArrow': '1b5b41',
  'downArrow': '1b5b42',
  'leftArrow': '1b5b44',
  'rightArrow': '1b5b43',
  'enter': '0d',
  'backspace': '7f',
  'exit': '03'
}
