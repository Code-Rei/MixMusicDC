/**
 * ytmusic.js — Singleton wrapper for ytmusic-api
 *
 * ytmusic-api uses ES Modules (import/export). Because MixMusicDC is a
 * CommonJS project we use a dynamic import() to load it at runtime.
 *
 * Usage anywhere in the bot:
 *   const { getYTMusic } = require('./utils/ytmusic');
 *   const ytm = await getYTMusic();
 *   const songs = await ytm.searchSongs('Blinding Lights');
 */

let _instance = null;
let _initPromise = null;

/**
 * Returns a ready-to-use YTMusic instance.
 * The first call initialises the client; subsequent calls return the cached one.
 * @returns {Promise<import('ytmusic-api').default>}
 */
async function getYTMusic() {
    if (_instance) return _instance;

    // Serialise concurrent callers — only one initialisation happens
    if (_initPromise) return _initPromise;

    _initPromise = (async () => {
        // Dynamic import needed because ytmusic-api is an ESM-only package
        const { default: YTMusic } = await import('ytmusic-api');
        const ytm = new YTMusic();
        await ytm.initialize(/* pass cookies string here if you need auth */);
        _instance = ytm;
        console.log('[YTMusic] Client initialised ✅');
        return _instance;
    })();

    return _initPromise;
}

module.exports = { getYTMusic };
