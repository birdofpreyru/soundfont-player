/* global AudioContext */
const ac = new AudioContext()
const sf = require('..')
const names = require('./assets/musyngkite.json')
const NOTES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const notes = NOTES.map(function (n, i) {
  return { time: i * 0.3, note: n + 60 }
})

function loadAndPlay (name) {
  console.log('Loading... ', name)
  sf.instrument(ac, name, { soundfont: 'FluidR3_GM' }).then(function (p1) {
    const now = ac.currentTime
    p1.schedule(now, notes)
    sf.instrument(ac, name, { soundfont: 'MusyngKite' }).then(function (p2) {
      p2.schedule(now + 12 * 0.3, notes)
    })
  })
}

function viewName (name) {
  return '<a href="#">' + name + '</a><br/>'
}

document.body.innerHTML = '<div>' + names.map(viewName).join('') + '</div>'

const links = document.querySelectorAll('a')
for (let i = 0; i < links.length; i++) {
  const a = links.item(i)
  a.onclick = function (e) {
    loadAndPlay(e.target.text)
  }
}
