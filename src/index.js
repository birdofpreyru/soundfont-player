import load from '@dr.pogodin/audio-loader';
import player from 'sample-player';

function isSoundfontURL(name) {
  return /\.js(\?.*)?$/i.test(name);
}

/**
 * Given an instrument name returns a URL to to the Benjamin Gleitzman's
 * package of [pre-rendered sound fonts](https://github.com/gleitz/midi-js-soundfonts)
 *
 * @param {String} name - instrument name
 * @param {String} soundfont - (Optional) the soundfont name.
 *  One of 'FluidR3_GM' or 'MusyngKite' ('MusyngKite' by default)
 * @param {String} format - (Optional) Can be 'mp3' or 'ogg' (mp3 by default)
 * @returns {String} the Soundfont file url
 * @example
 * var Soundfont = require('soundfont-player')
 * Soundfont.nameToUrl('marimba', 'mp3')
 */
export function nameToUrl(name, sf = 'MusyngKite', format = 'mp3') {
  return `https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/${sf}/${name}-${format}.js`;
}

/**
 * Load a soundfont instrument. It returns a promise that resolves to a
 * instrument object.
 *
 * The instrument object returned by the promise has the following properties:
 *
 * - name: the instrument name
 * - play: A function to play notes from the buffer with the signature
 * `play(note, time, duration, options)`
 *
 *
 * The valid options are:
 *
 * - `format`: the soundfont format. 'mp3' by default. Can be 'ogg'
 * - `soundfont`: the soundfont name. 'MusyngKite' by default. Can be 'FluidR3_GM'
 * - `nameToUrl` <Function>: a function to convert from instrument names to URL
 * - `destination`: by default Soundfont uses the `audioContext.destination`
 *    but you can override it.
 * - `gain`: the gain of the player (1 by default)
 * - `notes`: an array of the notes to decode. It can be an array of strings
 * with note names or an array of numbers with midi note numbers. This is a
 * performance option: since decoding mp3 is a cpu intensive process, you can limit
 * limit the number of notes you want and reduce the time to load the instrument.
 *
 * @param {AudioContext} ac - the audio context
 * @param {String} name - the instrument name. For example: 'acoustic_grand_piano'
 * @param {Object} options - (Optional) the same options as Soundfont.loadBuffers
 * @return {Promise<object>}
 *
 * @example
 * var Soundfont = require('soundfont-player')
 * Soundfont.instrument('marimba').then(function (marimba) {
 *   marimba.play('C4')
 * })
 */
export function newInstrument(ac, name, options) {
  const opts = options || {};
  const isUrl = opts.isSoundfontURL || isSoundfontURL;
  const toUrl = opts.nameToUrl || nameToUrl;
  const url = isUrl(name) ? name : toUrl(name, opts.soundfont, opts.format);
  return load(url, { context: ac, only: opts.only || opts.notes })
    .then((buffers) => {
      const p = player(ac, buffers, opts)
        .connect(opts.destination ? opts.destination : ac.destination);
      p.url = url;
      p.name = name;
      return p;
    });
}
