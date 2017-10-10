JavaScript library to build modal interfaces.

Dependencies
------------

- [is-element-editable.js][]

Methods
-------

- `Modal`
  - `new`
    - `commands`
  - `listen`
  - `unlisten`

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

Examples
--------

``` javascript
UI = new Modal({
  normal: {
    j: () => window.scrollBy(0, +40),
    k: () => window.scrollBy(0, -40),
    h: () => window.scrollBy(-40, 0),
    l: () => window.scrollBy(+40, 0),
    J: () => window.scrollBy(0, +window.innerHeight),
    K: () => window.scrollBy(0, -window.innerHeight),
    g: () => window.scroll(0, 0),
    G: () => window.scroll(0, document.body.scrollHeight),
    H: () => history.go(-1),
    L: () => history.go(+1),
    r: () => location.reload(),
    R: () => location.reload(true),
    u: () => location.href = location.href.replace(new RegExp('^([a-z]+://.+)/.+/?$'), '$1'),
    U: () => location.href = location.origin,
    Escape: () => document.activeElement.blur()
  },
  insert: {
    Escape: () => document.activeElement.blur()
  }
})
```

``` javascript
UI.listen()
```

[is-element-editable.js]: https://github.com/alexherbo2/is-element-editable.js
