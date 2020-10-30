
const ctx = new window.AudioContext()
const soundfont = require('..')(ctx)

const osc = soundfont.instrument()
osc.onready(function () {
  const time = ctx.currentTime
  'G4 B4 D5'.split(' ').forEach(function (note, index) {
    osc.play(note, time + index)
  })
})
