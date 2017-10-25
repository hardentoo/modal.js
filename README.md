JavaScript library to build modal interfaces.

Features
--------

- Modes
  - Normal
  - Insert
- Contextual help

Dependencies
------------

- [is-element-editable.js][]

Methods
-------

- `Modal`
  - `new`
    - `commands`
    - Options
      - `context`
  - `commands`
  - `context`
  - `start`
  - `stop`

With `commands` being:

```
{
  <mode>: {
    <command>: <action>,
    default: <action>
  }
}
```

With `mode` being:

- `normal`
- `insert`

With `command` being a single key.

With `action` being a function.

CSS
---

- [css/modal.css](css/modal.css)

- `#modal`
  - `.active` `.inactive`
    - `.title`
    - `.key`
    - `.description`
    - `.default`

Examples
--------

``` javascript
UI = {
  Main: new Modal({
    normal: {
      j: {
        description: 'Down',
        command: () => window.scrollBy(0, 40)
      },
      k: {
        description: 'Up',
        command: () => window.scrollBy(0, -40)
      },
      h: {
        description: 'Left',
        command: () => window.scrollBy(-40, 0)
      },
      l: {
        description: 'Right',
        command: () => window.scrollBy(40, 0)
      },
      J: {
        description: 'Page Down',
        command: () => window.scrollBy(0, window.innerHeight)
      },
      K: {
        description: 'Page Up',
        command: () => window.scrollBy(0, -window.innerHeight)
      },
      g: {
        description: 'Home',
        command: () => window.scroll(0, 0)
      },
      G: {
        description: 'End',
        command: () => window.scroll(0, document.body.scrollHeight)
      },
      H: {
        description: 'Back',
        command: () => history.go(-1)
      },
      L: {
        description: 'Forward',
        command: () => history.go(1)
      },
      r: {
        description: 'Reload',
        command: () => location.reload()
      },
      R: {
        description: 'Reload (no cache)',
        command: () => location.reload(true)
      },
      u: {
        description: 'Parent location',
        command: () => location.href = location.href.replace(new RegExp('^([a-z]+://.+)/.+/?$'), '$1')
      },
      U: {
        description: 'Root location',
        command: () => location.href = location.origin
      },
      Escape: {
        description: 'Escape node',
        command: () => document.activeElement.blur()
      },
      ['a-Escape']: {
        description: 'Idle mode',
        command: () => {
          UI.Main.stop()
          UI.Idle.start()
        }
      }
    },
    insert: {
      Escape: {
        description: 'Escape node',
        command: () => document.activeElement.blur()
      }
    }
  },
  {
    context: false
  }),
  Idle: new Modal({
    normal: {
      ['a-Escape']: {
        description: 'Main mode',
        command: () => {
          UI.Idle.stop()
          UI.Main.start()
        }
      }
    }
  })
}
```

``` javascript
UI.Main.start()
```

[is-element-editable.js]: https://github.com/alexherbo2/is-element-editable.js
