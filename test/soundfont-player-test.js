/* global describe it AudioContext */
require('web-audio-test-api');
const assert = require('assert');
const fs = require('fs');

const load = require('@dr.pogodin/audio-loader');

const { nameToUrl, newInstrument } = require('..');

global.atob = require('atob');

const pianoSoundfont = fs.readFileSync(
  `${__dirname}/support/acoustic_grand_piano-ogg.js`,
);

const SF_BASE = 'https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages';

load.fetch = function fetch(url) {
  load.fetch.url = url;
  return Promise.resolve(pianoSoundfont.toString());
};

describe('Soundfont player', () => {
  describe('Load instruments', () => {
    it('returns a promise', () => {
      const ac = new AudioContext();
      assert.strictEqual(
        typeof newInstrument(ac, 'piano').then,
        'function',
      );
    });
    it('loads mp3 by default', () => {
      const ac = new AudioContext();
      return newInstrument(ac, 'acoustic_grand_piano')
        .then((piano) => {
          assert.strictEqual(
            piano.url,
            `${SF_BASE}/MusyngKite/acoustic_grand_piano-mp3.js`,
          );
        });
    });
    it('the promise resolve to an instrument', () => {
      const ac = new AudioContext();
      return newInstrument(ac, 'acoustic_grand_piano')
        .then((piano) => {
          assert(piano);
          assert.strictEqual(piano.name, 'acoustic_grand_piano');
          assert.strictEqual(typeof piano.play, 'function');
        });
    });
    it('options.nameToUrl', () => {
      const TEST_URL = `${SF_BASE}/MusyngKite/acoustic_grand_piano-mp3.js`;
      const ac = new AudioContext();
      const toUrl = () => TEST_URL;
      return newInstrument(ac, 'xxx', { nameToUrl: toUrl })
        .then((piano) => assert.strictEqual(piano.url, TEST_URL));
    });
  });
  describe('Build urls', () => {
    it('get default url', () => {
      assert.strictEqual(nameToUrl('marimba'),
        `${SF_BASE}/MusyngKite/marimba-mp3.js`);
    });
    it('get FluidR3_GM url', () => {
      assert.strictEqual(nameToUrl('marimba', 'FluidR3_GM'),
        `${SF_BASE}/FluidR3_GM/marimba-mp3.js`);
    });
    it('accepts ogg', () => {
      assert.strictEqual(nameToUrl('marimba', undefined, 'ogg'),
        `${SF_BASE}/MusyngKite/marimba-ogg.js`);
    });
  });
});
