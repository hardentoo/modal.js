class Modal {

  constructor(commands) {
    this.properties = {
      ui: {
        events: {}
      }
    }
    this.properties.commands = commands
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
      if (this.properties.commands[mode] == undefined) {
        return
      }
      let command = this.properties.commands[mode][name]
      if (command) {
        event.preventDefault()
        event.stopImmediatePropagation()
        command()
      }
      else {
        let fallback = this.properties.commands[mode].default
        if (fallback) {
          fallback(name)
        }
      }
    }
  }

  start() {
    window.addEventListener('keydown', this.properties.ui.events.keydown, { capture: true })
  }

  stop() {
    window.removeEventListener('keydown', this.properties.ui.events.keydown, { capture: true })
  }

}
