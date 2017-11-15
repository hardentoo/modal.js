JavaScript library to build modal interfaces.

Features
--------

- Modes
  - Normal
  - Insert
- Key
  - Press
  - Down
  - Up
- Single key support, but chainable
- Contextual help
- CSS

Dependencies
------------

- [editable-content.js][]

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

With `commands` being a list of `command`:

```
{
  mode: <mode>,
  key: <key>,
  modifiers: {
    control: <boolean>,
    alt: <boolean>,
    meta: <boolean>,
  },
  description: <description>,
  function: <function>,
  default: <boolean>
}
```

With `mode` being:

- `normal` (default)
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
  Main: new Modal([
    {
      key: 'j',
      description: 'Down',
      function: () => window.scrollBy(0, 40)
    },
    {
      key: 'k',
      description: 'Up',
      function: () => window.scrollBy(0, -40)
    },
    {
      key: 'h',
      description: 'Left',
      function: () => window.scrollBy(-40, 0)
    },
    {
      key: 'l',
      description: 'Right',
      function: () => window.scrollBy(40, 0)
    },
    {
      key: 'J',
      description: 'Page Down',
      function: () => window.scrollBy(0, window.innerHeight)
    },
    {
      key: 'K',
      description: 'Page Up',
      function: () => window.scrollBy(0, -window.innerHeight)
    },
    {
      key: 'g',
      description: 'Home',
      function: () => window.scroll(0, 0)
    },
    {
      key: 'G',
      description: 'End',
      function: () => window.scroll(0, document.body.scrollHeight)
    },
    {
      key: 'H',
      description: 'Back',
      function: () => history.go(-1)
    },
    {
      key: 'L',
      description: 'Forward',
      function: () => history.go(1)
    },
    {
      key: 'r',
      description: 'Reload',
      function: () => location.reload()
    },
    {
      key: 'R',
      description: 'Reload (no cache)',
      function: () => location.reload(true)
    },
    {
      key: 'u',
      description: 'Parent location',
      function: () => location.href = location.href.replace(new RegExp('^([a-z]+://.+)/.+/?$'), '$1')
    },
    {
      key: 'U',
      description: 'Root location',
      function: () => location.href = location.origin
    },
    {
      key: 'Escape',
      description: 'Escape node',
      function: () => document.activeElement.blur()
    },
    {
      key: 'Escape',
      modifiers: {
        alt: true
      },
      description: 'Idle mode',
      function: () => {
        UI.Main.stop()
        UI.Idle.start()
      }
    },
    {
      mode: 'insert',
      key: 'Escape',
      description: 'Escape node',
      function: () => document.activeElement.blur()
    }
  ],
  {
    context: false
  }),
  Idle: new Modal([
    {
      key: 'Escape',
      modifiers: {
        alt: true
      },
      description: 'Main mode',
      function: () => {
        UI.Idle.stop()
        UI.Main.start()
      }
    }
  ])
}
```

``` javascript
UI.Main.start()
```

[editable-content.js]: https://github.com/alexherbo2/editable-content.js
