export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message || message.trim().length === 0) {
      return Response.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    const prompt = encodeURIComponent(message);
    const response = await fetch(`https://text.pollinations.ai/${prompt}?model=openai`, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (!response.ok) throw new Error('AI service unavailable');
    
    const text = await response.text();

    return Response.json({ reply: text || 'Maaf, saya tidak bisa menghasilkan jawaban saat ini.' });
  } catch (err) {
    console.error('Chat API Error:', err);
    return Response.json({ error: 'Gagal menghubungi AI. Coba lagi.' }, { status: 500 });
  }
}