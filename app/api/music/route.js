export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    if (!q) {
      return Response.json({ error: 'Query required' }, { status: 400 });
    }

    // JioSaavn public API - free, full songs
    const res = await fetch(
      `https://api.nexray.eu.cc/downloader/spotifyplay?query=${encodeURIComponent(q)}&page=1&limit=12`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );

    if (!res.ok) throw new Error('Music service unavailable');
    const data = await res.json();

    if (!data.data?.results?.length) {
      return Response.json({ results: [] });
    }

    const results = data.data.results.map(song => ({
      id: song.id,
      name: song.name,
      artist: song.artists?.primary?.map(a => a.name).join(', ') || 'Unknown',
      album: song.album?.name || '',
      duration: song.duration || 0,
      image: song.image?.[2]?.url || song.image?.[1]?.url || song.image?.[0]?.url || null,
      // pick highest quality download url
      url: song.downloadUrl?.[4]?.url || song.downloadUrl?.[3]?.url || song.downloadUrl?.[2]?.url || null,
    })).filter(s => s.url);

    return Response.json({ results });
  } catch (err) {
    console.error('Music API Error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
