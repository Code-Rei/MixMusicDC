const { createAddedEmbed } = require('../../utils/embed');

module.exports = {
    name: 'addSong',
    async execute(queue, song, client) {
        const position = queue.songs.indexOf(song);
        const embed = createAddedEmbed(song, position);
        queue.textChannel?.send({ embeds: [embed] }).catch(() => { });
    },
};
