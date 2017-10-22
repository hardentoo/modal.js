class Modal {

  constructor(commands) {
    this.properties = {
      ui: {
        events: {}
      }
    }
    this.commands = commands
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
      for (let [command, action] of Object.entries(commands)) {
        if (typeof action != 'function') {
          throw `${command} should be function`
        }
      }
    }
    this.properties.commands = modes
  }

  // Running ├──────────────────────────────────────────────────────────────────

  start() {
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
      let command = this.commands[mode][name]
      if (command) {
        event.preventDefault()
        event.stopImmediatePropagation()
        command()
      }
      else {
        let fallback = this.commands[mode].default
        if (fallback) {
          fallback(name)
        }
      }
    }
    window.addEventListener('keydown', this.properties.ui.events.keydown, { capture: true })
  }

  stop() {
    window.removeEventListener('keydown', this.properties.ui.events.keydown, { capture: true })
  }

}
