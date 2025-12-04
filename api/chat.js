const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');
  try {
    const { prompt, model } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) return res.status(500).json({ error: 'Server not configured: missing OPENAI_API_KEY' });

    const payload = {
      model: model || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful tutor specialized in class 12 PCM topics. Keep answers clear and concise. If asked for step-by-step math, show steps.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 700
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPENAI_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({ error: text });
    }

    const j = await r.json();
    const message = j.choices?.[0]?.message?.content;
    return res.status(200).json({ message: message || 'No text returned from model' });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};
