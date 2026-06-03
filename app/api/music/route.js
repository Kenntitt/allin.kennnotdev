export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Parse duration string "4:22" → total seconds
function parseDuration(str) {
  if (!str) return 0;
  const parts = String(str).split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    if (!q) {
      return Response.json({ error: 'Query required' }, { status: 400 });
    }

    const res = await fetch(
      `https://api.nexray.eu.cc/downloader/spotifyplay?q=${encodeURIComponent(q)}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );

    if (!res.ok) throw new Error('Music service unavailable');
    const data = await res.json();

    // Response: { status: true, result: { title, artist, duration, thumbnail, download_url, ... } }
    if (!data.status || !data.result) {
      return Response.json({ results: [] });
    }

    const song = data.result;

    // Validasi download_url ada
    if (!song.download_url) {
      return Response.json({ results: [] });
    }

    const result = {
      id: song.url || q, // spotify track url sebagai unique id
      name: song.title || 'Unknown',
      artist: song.artist || 'Unknown',
      album: song.album || '',
      duration: parseDuration(song.duration),
      image: song.thumbnail || null,
      url: song.download_url,
      spotify_url: song.url || null,
    };

    return Response.json({ results: [result] });
  } catch (err) {
    console.error('Music API Error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
