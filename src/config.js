const { RepeatMode } = require('distube');

module.exports = {
    botName: 'MixMusicDC',
    botActivity: '🎵 /play to start music!',

    colors: {
        primary: 0x5865F2,
        success: 0x57F287,
        error: 0xED4245,
        warning: 0xFEE75C,
        music: 0x1DB954,
        info: 0x5865F2,
    },

    emojis: {
        play: '▶️',
        pause: '⏸️',
        stop: '⏹️',
        skip: '⏭️',
        queue: '📋',
        music: '🎵',
        volume: '🔊',
        loop: '🔁',
        shuffle: '🔀',
        lyrics: '📝',
        filter: '🎛️',
        error: '❌',
        success: '✅',
        loading: '⏳',
        autoplay: '🤖',
        search: '🔍',
        playlist: '📂',
        nowplaying: '🎶',
        time: '⏱️',
        user: '👤',
        link: '🔗',
    },

    loopModes: {
        off: RepeatMode.DISABLED,
        song: RepeatMode.SONG,
        queue: RepeatMode.QUEUE,
    },

    // Audio filters for /filter command
    filters: {
        '3d': '3d',
        bassboost: 'bassboost',
        echo: 'echo',
        flanger: 'flanger',
        karaoke: 'karaoke',
        nightcore: 'nightcore',
        reverse: 'reverse',
        vaporwave: 'vaporwave',
        phaser: 'phaser',
        tremolo: 'tremolo',
        surrounding: 'surrounding',
        pulsator: 'pulsator',
        subboost: 'subboost',
        normalizer: 'normalizer',
        compressor: 'compressor',
        chorus: 'chorus',
        fadein: 'fadein',
        speed: 'speed',
    },

    queuePageSize: 10,
    maxVolume: 100,
    defaultVolume: 50,
};
