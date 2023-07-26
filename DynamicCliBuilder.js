const readline = require('readline')
const wcwidth = require('wcwidth')

//CLI
class CLI {
  #layout = [Layout.pageTab, Layout.blank, Layout.pageContent, Layout.blank, Layout.input, Layout.blank]
  #style = {
    background: BackgroundColor.reset,

    selectBackground: BackgroundColor.white,
    selectFont: FontColor.gray,
    notSelectBackground: BackgroundColor.gray,
    notSelectFont: FontColor.white
  }
  #pages = []

  #data = {
    events: {},
    currentPage: 0,
    input: ''
  }

  constructor () {
    let stream = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    process.stdin.on('data', (data) => {
      if (data.toString('hex') === '0d') {
        this.#callEvent('enter', this.#data.input)
        this.#data.input = ''
      } else if (data.toString('hex') === '7f') this.#data.input = this.#data.input.substring(0, this.#data.input.length-1)
      else if (data.toString('hex') === '1b5b44') this.#data.currentPage--
      else if (data.toString('hex') === '1b5b43') this.#data.currentPage++
      else if (data.toString('hex') === '1b5b41') {
        if (this.#pages[this.#data.currentPage].scrollY > 0) this.#pages[this.#data.currentPage].scrollY--
      } else if (data.toString('hex') === '1b5b42') {
        let pageContent = this.#pages[this.#data.currentPage].callback()
        if (!Array.isArray(pageContent)) throw new Error('參數 callback 必須為一個返回 <array> 的 <function>')
        if (this.#pages.length > 0 && this.#pages[this.#data.currentPage].scrollY < pageContent.length-((process.stdout.rows-this.#layout.length)+1)) this.#pages[this.#data.currentPage].scrollY++
      } else if (data.toString('hex') !== '09') {
        this.#data.input+=data.toString('utf8')
        this.#callEvent('input', data.toString('utf8'))
      }
      this.#callEvent('keyPress', data)

      if (this.#data.currentPage >= this.#pages.length) this.#data.currentPage = 0
      else if (this.#data.currentPage < 0) this.#data.currentPage = this.#pages.length-1
    })

    stream.on('close', () => {})

    setInterval(() => this.#display(this), 150)
  }

  get layout () {return this.#layout}
  get style () {return this.#style}
  get pages () {return this.#pages}
  get data () {return this.#data}

  //設定佈局
  setLayout (layout) {
    if (!Array.isArray(layout)) throw new Error('參數 layout 必須為一個 <array>')
    if (layout.filter((item) => item === 'pageContent').length > 1) throw new Error(`佈局中最多只能有一個 pagetContent`)
    layout.forEach((item) => {
      if (item !== 'pageTab' || item !== 'pageContent' || item !== 'input' || item !== 'blank') throw new Error(`找不到佈局 ${item}`)
    })
    this.#layout = layout
    return this
  }

  //設定風格
  setStyle (style) {
    if (typeof style !== 'object') throw new Error('參數 style 必須為一個 <object>')
    this.#style = style
    return this
  }

  //添加頁面
  addPage (name, callback) {
    if (typeof name !== 'string') throw new Error(`參數 name 必須為一個 <string>`)
    if (typeof callback !== 'function') throw new Error(`參數 callback 必須為一個 <function>`)
    this.#pages.forEach((item) => {
      if (item.name === name) throw new Error(`已有名為 ${name} 的頁面`)
    })
    this.#pages.push({ name, callback, scrollY: 0 })
    return this
  }

  //移除頁面
  removePage (name) {
    for (let i = 0; i < this.#pages.length; i++) {
      if (this.#pages[i].name === name) {
        this.#pages.splice(i, 1)
        return this
      }
    }
    throw new Error(`找不到名為 ${name} 的頁面`)
  }

  //切換頁面
  switchPage (index) {
    if (index >= this.#pages.length) index = 0
    else if (index < 0) index = this.#pages.length-1
    this.#data.currentPage = index
    return this
  }

  //設定輸入
  setInput (string) {
    if (typeof string !== 'string') throw new Error('參數 string 必須為一個 <string>')
    this.#data.input = string
  }

  //聆聽事件
  event (name, callback) {
    if (typeof callback !== 'function') throw new Error('參數 <callback> 必須為一個 <function>')
    if (this.#data.events[name] === undefined) this.#data.events[name] = []
    this.#data.events[name].push(callback)
    return this
  }

  //呼叫事件
  #callEvent (name, data) {
    if (this.#data.events[name] !== undefined) {
      this.#data.events[name].forEach((item) => item(data))
    }
  }

  //顯示
  #display () {
    let lines = []
    this.#layout.forEach((item) => {
      lines = lines.concat(this.#displayComponents(item))
    })
    while (lines.length < process.stdout.rows) lines.push('')
    lines.forEach((item, index) => {
      if (item.length > 0) {
        let analysis = []
        let currentColor = ''
        for (let i = 0; i < item.length; i++) {
          if (item.substring(i, i+2) === '\x1b[') {
            for (let end = i+2; end < item.length; end++) {
              if (item[end] == 'm') {
                currentColor = item.substring(i, end)
                i+=((end-i)-1)
                break
              }
            }
          } else {
            analysis.push({ string: item[i], color: currentColor })
            currentColor = ''
          }
        }
        while (wcwidth(analysis.map((item) => {return item.string}).join('')) < process.stdout.columns) analysis.push({ string: ' ', color: '' })
        while (wcwidth(analysis.map((item) => {return item.string}).join('')) > process.stdout.columns) analysis.splice(analysis.length-1, 1)
        lines[index] = `${this.#style.background}${analysis.map((item) => {return `${item.color}${item.string}`}).join('')}`
      }
    })

    let string = lines.join(`\n`)

    process.stdout.write(`\x1B[2J\x1B[3J\x1B[H\x1Bc ${lines.join(`\n${BackgroundColor.reset}`)}`)
  }

  //顯示組件
  #displayComponents (name) {
    let lines = []
    if (name === 'pageTab') {
      lines.push('')
      this.#pages.forEach((item, index) => {
        if (this.#data.currentPage === index) lines[0]+=` ${this.#style.selectBackground} ${this.#style.selectFont}${item.name} ${this.#style.background} `
        else lines[0]+=` ${this.#style.notSelectBackground} ${this.#style.notSelectFont}${item.name} ${this.#style.background} `
      })
    } else if (name === 'pageContent') {
      let pageContent = this.#pages[this.#data.currentPage].callback()
      if (!Array.isArray(pageContent)) throw new Error('參數 callback 必須為一個返回 <array> 的 <function>')
      for (let i = 0; i < process.stdout.rows-(this.#layout.length-1); i++) {
        if (i+this.#pages[this.#data.currentPage].scrollY < pageContent.length) lines.push(` ${i+this.#pages[this.#data.currentPage].scrollY+1}｜${pageContent[i+this.#pages[this.#data.currentPage].scrollY]}`)
        else lines.push('')
      }
    } else if (name === 'input') {
      if (this.#data.input.length > 0) lines.push(` ${this.#style.selectBackground} ${this.#style.selectFont}${this.#data.input} `)
      else lines.push(` ${this.#style.notSelectBackground} ${this.#style.notSelectFont}⇦ ⇨ 切換頁面 - ⇧⇩ 滑動頁面 - 打字來輸入內容`)
    } else if (name === 'blank') lines.push('')
    return lines
  }
}

//佈局
class Layout {
  static get pageTab () {return 'pageTab'}
  static get pageContent () {return 'pageContent'}
  static get input () {return 'input'}
  static get blank () {return 'blank'}
}

//文字顏色
class FontColor {
  //紅色
  static get red () {return '\x1b[31m'}
  static get brightRed () {return '\x1b[92m'}

  //黃色
  static get yellow () {return '\x1b[33m'}
  static get brightYellow () {return '\x1b[93m'}

  //綠色
  static get green () {return '\x1b[32m'}
  static get brightGreen () {return '\x1b[92m'}

  //青色
  static get cyan () {return '\x1b[36m'}
  static get brightCyan () {return '\x1b[96m'}

  //藍色
  static get blue () {return '\x1b[34m'}
  static get brightBlue () {return '\x1b[94m'}

  //紫色
  static get purple () {return '\x1b[35m'}
  static get brightPurple () {return '\x1b[95m'}

  //黑白灰色
  static get white () {return '\x1b[97m'}
  static get black () {return '\x1b[30m'}
  static get gray () {return '\x1b[90m'}
}

//背景顏色
class BackgroundColor {
  static get reset () {return '\x1b[0m'}

  //紅色
  static get red () {return '\x1b[41m'}
  static get brightRed () {return '\x1b[101m'}

  //黃色
  static get yellow () {return '\x1b[43m'}
  static get brightYellow () {return '\x1b[103m'}

  //綠色
  static get green () {return '\x1b[42m'}
  static get brightGreen () {return '\x1b[102m'}

  //青色
  static get cyan () {return '\x1b[46m'}
  static get brightCyan () {return '\x1b[106m'}

  //藍色
  static get blue () {return '\x1b[44m'}
  static get brightBlue () {return '\x1b[104m'}

  //紫色
  static get purple () {return '\x1b[45m'}
  static get brightPurple () {return '\x1b[105m'}

  //黑白灰色
  static get white () {return '\x1b[107m'}
  static get black () {return '\x1b[40m'}
  static get gray () {return '\x1b[100m'}
}

module.exports = { CLI, Layout, FontColor, BackgroundColor }