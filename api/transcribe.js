const { createClient } = require('@deepgram/sdk');
const multiparty = require('multiparty');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
    if (!deepgramApiKey) {
      return res.status(500).json({ error: 'Deepgram API key not configured' });
    }

    // Parse multipart form data
    const form = new multiparty.Form();
    
    const audioBuffer = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!files.audio || !files.audio[0]) {
          reject(new Error('No audio file provided'));
          return;
        }

        const fs = require('fs');
        const buffer = fs.readFileSync(files.audio[0].path);
        resolve(buffer);
      });
    });

    // Initialize Deepgram client
    const deepgram = createClient(deepgramApiKey);

    // Transcribe the audio
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: 'nova-2',
        smart_format: true,
        punctuate: true,
        diarize: false,
        language: 'en',
        keywords: [
          'anemia:2',
          'leukocytes:2',
          'neutropenia:2',
          'lymphocytes:2',
          'platelets:2',
          'blasts:2',
          'erythroid:2',
          'myeloid:2',
          'megakaryocytes:2',
          'cellularity:2',
          'dyspoiesis:2',
          'anisopoikilocytosis:2',
          'dacrocytes:2',
          'hypercellular:2',
          'hypocellular:2',
          'normocytic:2',
          'microcytic:2',
          'macrocytic:2'
        ].join(',')
      }
    );

    if (error) {
      console.error('Deepgram error:', error);
      return res.status(500).json({ error: 'Transcription failed', details: error.message });
    }

    const transcript = result.results?.channels[0]?.alternatives[0]?.transcript;

    if (!transcript) {
      return res.status(500).json({ error: 'No transcription returned' });
    }

    return res.status(200).json({
      success: true,
      transcript: transcript,
      confidence: result.results?.channels[0]?.alternatives[0]?.confidence || 0,
      words: result.results?.channels[0]?.alternatives[0]?.words || []
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({ 
      error: 'Transcription failed', 
      details: error.message 
    });
  }
};

