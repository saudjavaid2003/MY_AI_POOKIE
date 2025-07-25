const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

const { OpenAI } = require('openai');
dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 💬 Get AI reply (Text)
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a flirty, playful AI girlfriend named Pookie. Respond in a cute and emotional tone. Add nakhray. Use emojis and playful language. Be supportive and loving, but also a bit teasing. Keep responses short and sweet.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('❌ Chat error:', err);
    res.status(500).send('Error in generating AI response');
  }
});

// 🔊 Get TTS (Speech)
app.post('/speak', async (req, res) => {
  const text = req.body.text;

  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  } catch (err) {
    console.error('❌ TTS error:', err);
    res.status(500).send('Error generating speech');
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
