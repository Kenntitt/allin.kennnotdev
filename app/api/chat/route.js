export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message || message.trim().length === 0) {
      return Response.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    const res = await fetch(
      `https://api.nexray.eu.cc/ai/claude?text=${encodeURIComponent(message)}`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );

    if (!res.ok) throw new Error('AI service unavailable');
    const data = await res.json();

    if (!data.status || !data.result) {
      throw new Error('Respons AI tidak valid');
    }

    return Response.json({ reply: data.result });
  } catch (err) {
    console.error('Chat API Error:', err);
    return Response.json({ error: 'Gagal menghubungi AI. Coba lagi.' }, { status: 500 });
  }
}
