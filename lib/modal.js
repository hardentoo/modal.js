class Modal {

  constructor(commands, options) {
    options = {
      context: true,
      ...options
    }
    this.properties = {
      ui: {
        events: {
          last: null,
        },
        html: {
          modal: null,
        },
        css: {
          modal: 'modal',
          title: 'title',
          keys: 'keys',
          key: 'key',
          join: 'join',
          description: 'description',
          active: 'active',
          inactive: 'inactive',
          default: 'default',
        },
      }
    }
    this.commands = commands
    for (let [name, value] of Object.entries(options)) {
      this[name] = value
    }
  }

  // Properties ├───────────────────────────────────────────────────────────────

  // Commands
  // ‾‾‾‾‾‾‾‾
  get commands() {
    return this.properties.commands
  }

  set commands(values) {
    if (typeof values != 'object') {
      throw 'commands should be object'
    }
    for (let command of values) {
      // Mode
      if (command.mode == undefined) {
        command.mode = 'normal'
      }
      if (typeof command.mode != 'string') {
        throw `mode should be string`
      }
      let modes = ['normal', 'insert']
      if (! command.mode in modes) {
        throw `${command.mode} should not be in mode commands`
      }
      // Key
      if (typeof command.key != 'string') {
        throw `${command.key} should be string`
      }
      // Modifiers
      if (command.modifiers == undefined) {
        command.modifiers = {}
      }
      else {
        if (typeof command.modifiers != 'object') {
          throw `modifiers should be object`
        }
      }
      command.modifiers = {
        control: false,
        alt: false,
        meta: false,
        ...command.modifiers
      }
      // Function
      if (typeof command.function != 'function') {
        throw `${command.key} should be function`
      }
      // Events
      if (command.events == undefined) {
        command.events = []
      }
      else {
        if (typeof command.events != 'object') {
          throw `events should be object`
        }
        let names = ['up']
        for (let event of command.events) {
          // Name
          if (! event.name in names) {
            throw `${event.name} event does not exist`
          }
          // Function
          if (typeof event.function != 'function') {
            throw `${event.name} should be function`
          }
        }
      }
    }
    this.properties.commands = values
  }

  // Context
  // ‾‾‾‾‾‾‾
  get context() {
    return this.properties.context
  }

  set context(value) {
    if (typeof value != 'boolean') {
      throw 'context should be boolean'
    }
    this.properties.context = value
  }

  // Running ├──────────────────────────────────────────────────────────────────

  start() {
    if (this.context) {
      this.draw()
    }
    this.properties.ui.events.keydown = (event) => {
      // Skip modifiers
      let modifiers = ['Shift', 'Control', 'Alt', 'Meta']
      if (modifiers.find((modifier) => (modifier == event.key))) {
        return
      }
      let command = this.getCommandFromEvent(event)
      if (command) {
        event.preventDefault()
        event.stopImmediatePropagation()
        let events = command.events.filter((event) =>
          event.name == 'up'
        )
        if (events.length) {
          if (this.properties.ui.events.last && this.properties.ui.events.last.keyCode == event.keyCode) {
            return
          }
          this.properties.ui.events.last = event
        }
        command.function()
      }
      else {
        let command = this.getDefaultCommandFromEvent(event)
        if (command) {
          command.function(name)
        }
      }
    }
    this.properties.ui.events.keyup = (event) => {
      let command = this.getCommandFromEvent(event)
      if (command) {
        let events = command.events.filter((event) =>
          event.name == 'up'
        )
        for (let event of events) {
          event.function()
        }
      }
      this.properties.ui.events.last = null
    }
    this.properties.ui.events.focus = (event) => {
      this.redraw()
    }
    window.addEventListener('keydown', this.properties.ui.events.keydown, { capture: true })
    window.addEventListener('keyup', this.properties.ui.events.keyup, { capture: true })
    if (this.context) {
      for (let element of document.querySelectorAll('input, textarea')) {
        element.addEventListener('focus', this.properties.ui.events.focus)
        element.addEventListener('blur', this.properties.ui.events.focus)
      }
    }
  }

  stop() {
    this.clear(false)
    window.removeEventListener('keydown', this.properties.ui.events.keydown, { capture: true })
    if (this.context) {
      for (let element of document.querySelectorAll('input, textarea')) {
        element.removeEventListener('focus', this.properties.ui.events.focus)
        element.removeEventListener('blur', this.properties.ui.events.focus)
      }
    }
  }

  // Drawing ├──────────────────────────────────────────────────────────────────

  draw() {
    let ui = this.properties.ui
    ui.html.modal = document.createElement('div')
    ui.html.modal.id = ui.css.modal
    let activeMode = this.getMode()
    let draw = (mode) => {

      let htmlMode = document.createElement('div')
      let css = (mode == activeMode)
        ? ui.css.active
        : ui.css.inactive
      htmlMode.classList.add(css)
      ui.html.modal.appendChild(htmlMode)

      let htmlTitle = document.createElement('h1')
      htmlTitle.classList.add(ui.css.title)
      htmlTitle.innerText = mode
      htmlMode.appendChild(htmlTitle)

      let htmlList = document.createElement('ul')
      htmlMode.appendChild(htmlList)

      let commands = this.commands.filter((command) =>
        command.mode == mode
      )
      for (let command of commands) {

        let htmlEntry = document.createElement('li')
        if (command.default) {
          htmlEntry.classList.add(ui.css.default)
        }
        htmlList.appendChild(htmlEntry)

        let htmlKeys = document.createElement('span')
        htmlKeys.classList.add(ui.css.keys)
        htmlKeys.innerHTML = this.commandToHTMLString(command, ui.css)
        htmlEntry.appendChild(htmlKeys)

        let htmlSpace = document.createTextNode(' ')
        htmlEntry.appendChild(htmlSpace)

        let htmlDescription = document.createElement('span')
        htmlDescription.classList.add(ui.css.description)
        htmlDescription.innerText = command.description
        htmlEntry.appendChild(htmlDescription)

      }
    }
    draw('normal')
    draw('insert')
    ui.html.modal.style.position = 'fixed'
    ui.html.modal.style.top = '0'
    ui.html.modal.style.right = '0'
    document.body.appendChild(ui.html.modal)
  }

  undraw() {
    if (document.body.contains(this.properties.ui.html.modal)) {
      document.body.removeChild(this.properties.ui.html.modal)
    }
  }

  redraw() {
    this.undraw()
    this.draw()
  }

  clear(redraw = true) {
    let method = redraw
      ? 'redraw'
      : 'undraw'
    this[method]()
  }

  // Helpers ├──────────────────────────────────────────────────────────────────

  getMode(element = document.activeElement) {
    return isElementEditable(element)
      ? 'insert'
      : 'normal'
  }

  getCommandFromEvent(event) {
    const mode = this.getMode(event.target)
    return this.commands.find((command) =>
      command.mode == mode &&
      command.modifiers.control == event.ctrlKey &&
      command.modifiers.alt == event.altKey &&
      command.modifiers.meta == event.metaKey &&
      command.key == event.key
    )
  }

  getDefaultCommandFromEvent(event) {
    const mode = this.getMode(event.target)
    return this.commands.find((command) =>
      command.mode == mode &&
      command.default
    )
  }

  commandToHTMLString(command, style) {
    let names = {
      control: 'Control',
      alt: 'Alt',
      meta: 'Meta',
    }
    let modifiers = Object.entries(command.modifiers).reduce((modifiers, [modifier, activated]) =>
      activated
        ? [ ...modifiers, names[modifier]]
        : modifiers
    , [])
    return [...modifiers, command.key].map((key) => `<kbd class=${style.key}>${key}</kbd>`).join(`<span class=${style.join}>-</span>`)
  }

}
