const { createPlaylistEmbed } = require('../../utils/embed');

module.exports = {
    name: 'addList',
    async execute(queue, playlist, client) {
        const embed = createPlaylistEmbed(playlist, playlist.songs[0]);
        queue.textChannel?.send({ embeds: [embed] }).catch(() => { });
    },
};
