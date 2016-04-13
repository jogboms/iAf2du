
var win = typeof nw == 'undefined' ? window : nw.Window.get();

// NW.js fix
// window.nw_global = window.global
// window.global = undefined

win.App = {
  name : 'iAf2du'
}

export let Window = win
