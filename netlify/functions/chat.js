const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/interactions';
const ALLOWED_MODELS = new Set(['gemini-3.8-flash', 'gemini-3.5-flash-lite']);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { Allow: 'POST' }, body: 'Method not allowed' };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json(503, { error: { message: 'Chat is not configured yet.' } });

  let payload;
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf8')
      : event.body || '';
    if (Buffer.byteLength(raw, 'utf8') > 20000) {
      return json(413, { error: { message: 'Message is too large.' } });
    }
    payload = JSON.parse(raw);
  } catch {
    return json(400, { error: { message: 'Invalid request.' } });
  }

  if (!payload || typeof payload.input !== 'string' || payload.input.length > 12000) {
    return json(400, { error: { message: 'Message is missing or too long.' } });
  }
  if (!ALLOWED_MODELS.has(payload.model)) payload.model = 'gemini-3.8-flash';

  try {
    const upstream = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(payload),
    });
    const body = await upstream.text();
    return {
      statusCode: upstream.status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body,
    };
  } catch {
    return json(502, { error: { message: 'Could not reach the AI service.' } });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
  };
}
