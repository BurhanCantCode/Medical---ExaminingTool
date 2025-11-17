const Anthropic = require('@anthropic-ai/sdk');

const MEDICAL_REPORT_PROMPT = `You are a medical report formatting assistant specializing in hematology and pathology reports. Your task is to convert conversational medical observations spoken by a doctor into a professionally formatted, structured medical report.

INSTRUCTIONS:
1. Extract all relevant medical observations from the transcribed text
2. Organize the information into appropriate sections
3. Use proper medical terminology and correct any obvious errors in medical terms
4. Format the report in a clear, professional structure
5. Maintain medical accuracy and completeness
6. If information is missing for a section, omit that section rather than adding placeholder text

STANDARD SECTIONS (use only applicable sections):
- PERIPHERAL BLOOD SMEARS
- BONE MARROW ASPIRATE SMEARS/TOUCH PREPARATION
- BONE MARROW CORE/CLOT SECTION
- IMMUNOHISTOCHEMISTRY/SPECIAL STAINS (if applicable)
- FLOW CYTOMETRY (if applicable)
- CYTOGENETICS (if applicable)
- MOLECULAR STUDIES (if applicable)

FORMATTING GUIDELINES:
- Use clear section headers in ALL CAPS followed by a colon
- Each section should contain detailed observations in paragraph form
- Use proper medical terminology
- Include specific measurements, percentages, and quantitative observations when mentioned
- Maintain professional, objective tone
- Use complete sentences with proper grammar
- Preserve the doctor's observations without adding information they didn't mention

Now, please format the following transcribed observation into a professional medical report:`;

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
    const { transcription } = req.body;

    if (!transcription || typeof transcription !== 'string') {
      return res.status(400).json({ error: 'Transcription text is required' });
    }

    if (transcription.trim().length === 0) {
      return res.status(400).json({ error: 'Transcription cannot be empty' });
    }

    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      return res.status(500).json({ error: 'Anthropic API key not configured' });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    });

    // Generate the report using Claude
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: `${MEDICAL_REPORT_PROMPT}\n\n${transcription}`
        }
      ]
    });

    const report = message.content[0].text;

    if (!report) {
      return res.status(500).json({ error: 'Failed to generate report' });
    }

    return res.status(200).json({
      success: true,
      report: report,
      usage: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens
      }
    });

  } catch (error) {
    console.error('Report generation error:', error);
    return res.status(500).json({ 
      error: 'Report generation failed', 
      details: error.message 
    });
  }
};

