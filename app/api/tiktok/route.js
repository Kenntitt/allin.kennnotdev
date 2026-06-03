export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url || !url.includes('tiktok.com')) {
      return Response.json({ error: 'URL TikTok tidak valid' }, { status: 400 });
    }

    const form = new URLSearchParams();
    form.append('url', url);
    form.append('hd', '1');

    const res = await fetch('https://www.tikwm.com/api/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: form,
    });
    
    const data = await res.json();

    if (data.code !== 0 || !data.data) {
      return Response.json({ error: 'Gagal memproses video. Pastikan link benar dan video tidak di-private.' }, { status: 400 });
    }

    return Response.json({
      title: data.data.title || 'Tanpa Judul',
      cover: data.data.cover,
      play: data.data.play,
      hdplay: data.data.hdplay,
      music: data.data.music,
      author: data.data.author,
    });
  } catch (err) {
    console.error('TikTok API Error:', err);
    return Response.json({ error: 'Server sedang sibuk atau API limit tercapai. Coba lagi nanti.' }, { status: 500 });
  }
}