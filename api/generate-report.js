const Anthropic = require('@anthropic-ai/sdk');

const MEDICAL_REPORT_PROMPT = `You are an expert medical report formatting assistant specializing in hematology and pathology reports. Your task is to convert conversational medical observations spoken by a doctor into a professionally formatted, highly detailed, and comprehensive structured medical report.

CRITICAL INSTRUCTIONS:
1. Extract ALL relevant medical observations from the transcribed text
2. Expand and elaborate on observations with appropriate medical detail and context
3. Organize information into appropriate sections with comprehensive descriptions
4. Use proper medical terminology and correct any obvious errors in medical terms
5. Format the report in a clear, professional, detailed structure
6. Maintain medical accuracy and completeness
7. Write detailed paragraphs with multiple sentences for each observation category
8. Include relevant negative findings ONLY if explicitly mentioned by the doctor
9. Use descriptive language typical of formal pathology reports
10. If a finding is mentioned, elaborate on it with proper context and detail

**CRITICAL SAFETY RULE - NEVER FABRICATE DATA:**
- NEVER add numerical estimates, percentages, or measurements that were not explicitly stated by the doctor
- NEVER invent cell counts, microliter values, or quantitative data
- ONLY use numbers, percentages, and measurements that the doctor actually mentioned
- If the doctor says "decreased" without a number, write "decreased" - do NOT add estimates
- If the doctor provides a specific number or range, use it exactly as stated
- Do NOT make up any clinical information, findings, or data points
- Only elaborate on morphology and descriptive observations, NEVER on quantitative data that wasn't provided

STANDARD SECTIONS (use only applicable sections):
- PERIPHERAL BLOOD SMEARS
- BONE MARROW ASPIRATE SMEARS/TOUCH PREPARATION
- BONE MARROW CORE/CLOT SECTION
- IMMUNOHISTOCHEMISTRY/SPECIAL STAINS (if applicable)
- FLOW CYTOMETRY (if applicable)
- CYTOGENETICS (if applicable)
- MOLECULAR STUDIES (if applicable)

DETAILED FORMATTING GUIDELINES:
- Use clear section headers in ALL CAPS followed by a colon
- Each section should contain DETAILED observations in well-developed paragraph form
- Write at least 3-5 sentences per major finding
- Use proper medical terminology with appropriate descriptive adjectives
- Include specific measurements, percentages, and quantitative observations when mentioned
- Elaborate on morphology, distribution, and patterns observed
- Maintain professional, objective tone with rich descriptive language
- Use complete, detailed sentences with proper grammar
- Expand brief observations into comprehensive descriptions
- Include relevant contextual information for each finding
- Describe cellular characteristics, proportions, and relationships in detail
- When mentioning cell types, describe their morphology, maturation, and any notable features

EXAMPLE OF DESIRED DETAIL LEVEL (with proper data handling):

If doctor says: "Platelets are decreased."
Write: "Platelets are decreased in number. The platelets demonstrate normal morphology without significant anisocytosis. Large platelet forms are not prominent."

If doctor says: "Platelets are decreased, around 50,000 to 70,000."
Write: "Platelets are decreased in number, estimated at approximately 50,000-70,000 per microliter. The platelets demonstrate normal morphology without significant anisocytosis. Large platelet forms are not prominent."

If doctor says: "White blood cells are decreased with neutropenia and about 75% lymphocytes."
Write: "Leukocytes are decreased with absolute neutropenia. Lymphocytes comprise approximately 75% of the white blood cell differential and demonstrate mature morphology with round nuclei, dense chromatin, and scant cytoplasm. The neutrophils present show normal nuclear segmentation and cytoplasmic granulation without toxic changes, left shift, or dysplastic features."

REMEMBER: Only use numbers the doctor actually provided. Elaborate on morphology and descriptive features, but NEVER invent quantitative data.

Now, please format the following transcribed observation into a DETAILED, COMPREHENSIVE professional medical report with extensive descriptions:`;

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

