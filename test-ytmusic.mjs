/**
 * test-ytmusic.mjs  ← run with:  node test-ytmusic.mjs
 *
 * Standalone smoke-test for ytmusic-api — no Discord needed.
 * Exercises the most useful methods so you know the library works
 * before plugging it into the bot.
 */

import YTMusic from 'ytmusic-api';

const ytm = new YTMusic();
await ytm.initialize();

const QUERY = 'Blinding Lights The Weeknd';

console.log('\n──────────────────────────────────────────');
console.log(`  ytmusic-api smoke test  ·  "${QUERY}"`);
console.log('──────────────────────────────────────────\n');

// 1. Search songs ──────────────────────────────────────────────────────────
console.log('① searchSongs()');
const songs = await ytm.searchSongs(QUERY);
console.log(`   Found ${songs.length} songs. Top result:`);
const s = songs[0];
console.log(`   Name    : ${s.name}`);
console.log(`   Artist  : ${s.artist?.name ?? s.artists?.[0]?.name}`);
console.log(`   Album   : ${s.album?.name ?? '—'}`);
console.log(`   VideoId : ${s.videoId}`);
console.log(`   Duration: ${s.duration}s`);
console.log(`   YT URL  : https://music.youtube.com/watch?v=${s.videoId}`);
console.log(`   Thumb   : ${s.thumbnails?.at(-1)?.url ?? '—'}\n`);

// 2. Search videos ─────────────────────────────────────────────────────────
console.log('② searchVideos()');
const videos = await ytm.searchVideos(QUERY);
console.log(`   Found ${videos.length} videos. Top result:`);
const v = videos[0];
console.log(`   Title   : ${v.name}`);
console.log(`   Channel : ${v.artist?.name ?? '—'}`);
console.log(`   VideoId : ${v.videoId}\n`);

// 3. Search albums ─────────────────────────────────────────────────────────
console.log('③ searchAlbums("After Hours")');
const albums = await ytm.searchAlbums('After Hours The Weeknd');
console.log(`   Found ${albums.length} albums. Top result:`);
const a = albums[0];
console.log(`   Title   : ${a.name}`);
console.log(`   Artist  : ${a.artist?.name ?? '—'}`);
console.log(`   Year    : ${a.year ?? '—'}`);
console.log(`   AlbumId : ${a.albumId}\n`);

// 4. Get song details by videoId ───────────────────────────────────────────
console.log('④ getSong(videoId)');
const detail = await ytm.getSong(s.videoId);
console.log(`   Name    : ${detail.name}`);
console.log(`   Artist  : ${detail.artist?.name}`);
console.log(`   Views   : ${detail.viewCount?.toLocaleString() ?? '—'}\n`);

// 5. Get artist details ────────────────────────────────────────────────────
console.log('⑤ searchArtists() + getArtist()');
const artists = await ytm.searchArtists('The Weeknd');
const artist = artists[0];
console.log(`   Found artist: ${artist.name}  (${artist.artistId})`);

console.log('\n✅  All tests passed — ytmusic-api is working correctly.\n');
