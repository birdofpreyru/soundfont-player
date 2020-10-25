/* global describe it AudioContext */
require('web-audio-test-api')
var assert = require('assert')
var fs = require('fs')
var path = require('path')
var load = require('@dr.pogodin/audio-loader')
var Soundfont = require('..')

var piano = fs.readFileSync(path.join(__dirname, '../examples/assets/acoustic_grand_piano-ogg.js'))

const SF_BASE = 'https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages';

load.fetch = function (url) {
  load.fetch.url = url
  return Promise.resolve(piano.toString())
}

describe('Soundfont player', function () {
  describe('Load instruments', function () {
    it('returns a promise', function () {
      var ac = new AudioContext()
      assert.strictEqual(typeof Soundfont.instrument(ac, 'piano')
        .then, 'function')
    })
    it('loads mp3 by default', () => {
      var ac = new AudioContext()
      return Soundfont.instrument(ac, 'acoustic_grand_piano')
        .then(function (piano) {
          assert.strictEqual(
            piano.url,
            `${SF_BASE}/MusyngKite/acoustic_grand_piano-mp3.js`,
          )
        })
    })
    it('the promise resolve to an instrument', () => {
      var ac = new AudioContext()
      return Soundfont.instrument(ac, 'acoustic_grand_piano')
      .then((piano) => {
        assert(piano)
        assert.strictEqual(piano.name, 'acoustic_grand_piano')
        assert.strictEqual(typeof piano.play, 'function')
      })
    })
    it('options.nameToUrl', function () {
      const TEST_URL = `${SF_BASE}/MusyngKite/acoustic_grand_piano-mp3.js`;
      var ac = new AudioContext()
      var toUrl = () => TEST_URL;
      return Soundfont.instrument(ac, 'xxx', { nameToUrl: toUrl })
        .then((piano) => assert.strictEqual(piano.url, TEST_URL));
    })
  })
  describe('Build urls', function () {
    it('get default url', function () {
      assert.strictEqual(Soundfont.nameToUrl('marimba'),
        `${SF_BASE}/MusyngKite/marimba-mp3.js`);
    })
    it('get FluidR3_GM url', function () {
      assert.strictEqual(Soundfont.nameToUrl('marimba', 'FluidR3_GM'),
        `${SF_BASE}/FluidR3_GM/marimba-mp3.js`)
    })
    it('accepts ogg', function () {
      assert.strictEqual(Soundfont.nameToUrl('marimba', null, 'ogg'),
        `${SF_BASE}/MusyngKite/marimba-ogg.js`)
    })
  })
})
