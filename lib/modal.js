class Modal {

  constructor(commands) {
    this.keydown = (event) => {
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
      if (commands[mode] == undefined) {
        return
      }
      let command = commands[mode][name]
      if (command) {
        event.preventDefault()
        command()
      }
      else {
        let fallback = commands[mode].default
        if (fallback) {
          fallback(name)
        }
      }
    }
  }

  listen() {
    window.addEventListener('keydown', this.keydown, true)
  }

  unlisten() {
    window.removeEventListener('keydown', this.keydown, true)
  }

}
