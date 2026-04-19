import soundtrackManifest from '../../assets/audio/manifest.json';

export const soundtrackTracks = Object.freeze(
  soundtrackManifest.tracks.map((track) =>
    Object.freeze({
      ...track,
      isLoop: true,
    })
  )
);

export function getSoundtrackTrack(trackId) {
  return soundtrackTracks.find((track) => track.id === trackId) ?? null;
}
