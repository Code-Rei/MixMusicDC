const { createNowPlayingEmbed } = require('../../utils/embed');

module.exports = {
    name: 'playSong',
    async execute(queue, song, client) {
        const embed = createNowPlayingEmbed(song, queue);
        queue.textChannel?.send({ embeds: [embed] }).catch(() => { });
    },
};
