class Modal {

  constructor(commands, options) {
    options = {
      context: true,
      ...options
    }
    this.properties = {
      ui: {
        events: {},
        html: {
          modal: null,
        },
        css: {
          modal: 'modal',
          title: 'title',
          key: 'key',
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
    let names = ['normal', 'insert']
    for (name in Object.keys(values)) {
      if (!name in names) {
        throw `${name} should not be in mode commands`
      }
    }
    let modes = {
      normal: {},
      insert: {},
      ...values
    }
    for (let [mode, commands] of Object.entries(modes)) {
      if (typeof commands != 'object') {
        throw `${mode} should be object`
      }
      for (let [command, object] of Object.entries(commands)) {
        if (typeof object.command != 'function') {
          throw `${command} should be function`
        }
      }
    }
    this.properties.commands = modes
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
      let mode = isElementEditable(event.target)
        ? 'insert'
        : 'normal'
      let name = event.key
      if (event.ctrlKey) {
        name = 'c-' + name
      }
      if (event.altKey) {
        name = 'a-' + name
      }
      if (event.metaKey) {
        name = 'm-' + name
      }
      let object = this.commands[mode][name]
      if (object) {
        event.preventDefault()
        event.stopImmediatePropagation()
        object.command()
      }
      else {
        let object = this.commands[mode].default
        if (object) {
          object.command(name)
        }
      }
    }
    window.addEventListener('keydown', this.properties.ui.events.keydown, { capture: true })
  }

  stop() {
    this.clear(false)
    window.removeEventListener('keydown', this.properties.ui.events.keydown, { capture: true })
  }

  // Drawing ├──────────────────────────────────────────────────────────────────

  draw() {
    let ui = this.properties.ui
    ui.html.modal = document.createElement('div')
    ui.html.modal.id = ui.css.modal
    let activeMode = isElementEditable(document.activeElement)
      ? 'insert'
      : 'normal'
    let modes = this.commands
    for (let [mode, commands] of Object.entries(modes)) {

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

      for (let [command, object] of Object.entries(commands)) {

        let htmlEntry = document.createElement('li')
        if (command == 'default') {
          htmlEntry.classList.add(ui.css.default)
        }
        htmlList.appendChild(htmlEntry)

        let htmlKey = document.createElement('span')
        htmlKey.classList.add(ui.css.key)
        htmlKey.innerText = command
        htmlEntry.appendChild(htmlKey)

        let htmlDescription = document.createElement('span')
        htmlDescription.classList.add(ui.css.description)
        htmlDescription.innerText = object.description
        htmlEntry.appendChild(htmlDescription)

      }
    }
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

}
