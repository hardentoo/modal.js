JavaScript library to build modal interfaces.

Features
--------

- Modes
  - Normal
  - Insert
- Single key support, but chainable
- Contextual help
- CSS

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
    <key>: {
      description: <description>,
      function: <function>
    },
    default: {
      description: <description>,
      function: <function>
    }
  }
}
```

With `mode` being:

- `normal`
- `insert`

With `key` being a single key.

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
        function: () => window.scrollBy(0, 40)
      },
      k: {
        description: 'Up',
        function: () => window.scrollBy(0, -40)
      },
      h: {
        description: 'Left',
        function: () => window.scrollBy(-40, 0)
      },
      l: {
        description: 'Right',
        function: () => window.scrollBy(40, 0)
      },
      J: {
        description: 'Page Down',
        function: () => window.scrollBy(0, window.innerHeight)
      },
      K: {
        description: 'Page Up',
        function: () => window.scrollBy(0, -window.innerHeight)
      },
      g: {
        description: 'Home',
        function: () => window.scroll(0, 0)
      },
      G: {
        description: 'End',
        function: () => window.scroll(0, document.body.scrollHeight)
      },
      H: {
        description: 'Back',
        function: () => history.go(-1)
      },
      L: {
        description: 'Forward',
        function: () => history.go(1)
      },
      r: {
        description: 'Reload',
        function: () => location.reload()
      },
      R: {
        description: 'Reload (no cache)',
        function: () => location.reload(true)
      },
      u: {
        description: 'Parent location',
        function: () => location.href = location.href.replace(new RegExp('^([a-z]+://.+)/.+/?$'), '$1')
      },
      U: {
        description: 'Root location',
        function: () => location.href = location.origin
      },
      Escape: {
        description: 'Escape node',
        function: () => document.activeElement.blur()
      },
      ['a-Escape']: {
        description: 'Idle mode',
        function: () => {
          UI.Main.stop()
          UI.Idle.start()
        }
      }
    },
    insert: {
      Escape: {
        description: 'Escape node',
        function: () => document.activeElement.blur()
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
        function: () => {
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
