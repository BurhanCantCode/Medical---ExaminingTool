# Medical Transcription System

A professional web application for recording medical observations, transcribing audio to text, and generating structured pathology reports using AI. Built specifically for doctors and pathologists who need to document their microscopic observations efficiently.

## Features

- 🎤 **Audio Recording** - Record observations directly from your phone or computer while working at the microscope
- 🗣️ **Speech-to-Text** - Automatic transcription using Deepgram's advanced AI
- ✏️ **Edit & Review** - Review and edit transcriptions before generating the final report
- 🤖 **AI-Powered Formatting** - Claude AI structures your observations into professional medical reports
- 📄 **Multiple Export Options** - Download as PDF or plain text, or copy to clipboard
- 📱 **Mobile-Friendly** - Clean, responsive design works perfectly on phones and tablets
- 🔒 **Privacy-First** - No data storage, all processing is done on-demand

## Technology Stack

### Frontend
- **React** - Modern UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Beautiful, responsive styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **Deepgram API** - Audio transcription
- **Claude API (Anthropic)** - Medical report generation
- **PDFKit** - PDF generation

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

You'll also need API keys for:
- **Deepgram API** - [Sign up here](https://deepgram.com/)
- **Anthropic Claude API** - [Sign up here](https://www.anthropic.com/)

## Installation

### 1. Clone or Download the Project

```bash
cd adasameer
```

### 2. Install Dependencies

Install both backend and frontend dependencies:

```bash
npm run install-all
```

Or install them separately:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your API keys:

```env
# API Keys (REQUIRED)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DEEPGRAM_API_KEY=your_deepgram_api_key_here

# Server Configuration (Optional)
PORT=3001
CLIENT_URL=http://localhost:5173
```

#### How to Get API Keys

**Deepgram API Key:**
1. Go to [deepgram.com](https://deepgram.com/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Create a new API key
5. Copy the key to your `.env` file

**Anthropic Claude API Key:**
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up for an account
3. Go to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

## Usage

### Development Mode

Run both the backend server and frontend development server:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:5173`

### Production Build

Build the frontend for production:

```bash
cd client
npm run build
```

Run the backend server:

```bash
npm run server
```

## How It Works

### Workflow

1. **Record** 📹
   - Click the microphone button to start recording
   - Speak your observations naturally while looking at the microscope
   - Click again to stop recording
   - Audio is automatically transcribed using Deepgram

2. **Edit** ✏️
   - Review the transcription for accuracy
   - Edit any misheard terms or add additional details
   - Make corrections to measurements or percentages

3. **Generate Report** 📄
   - Click "Generate Medical Report"
   - Claude AI structures your observations into a professional pathology report
   - Report follows standard medical formatting with proper sections

4. **Export** 💾
   - Copy to clipboard for pasting into EMR systems
   - Download as formatted PDF
   - Download as plain text file

### API Endpoints

**Backend Server** (`http://localhost:3001`)

- `GET /health` - Health check endpoint
- `POST /api/transcribe` - Transcribe audio file to text
- `POST /api/generate-report` - Generate formatted medical report from transcription
- `POST /api/generate-pdf` - Generate PDF from formatted report

## Tips for Best Results

### Recording Tips
- 🎙️ Use a quiet environment
- 📏 Hold your phone 6-8 inches from your mouth
- 🗣️ Speak clearly and at a normal pace
- 🏥 Use medical terminology naturally
- ⏸️ Pause briefly between different observations

### Editing Tips
- ✓ Check for misheard medical terms
- ✓ Verify all percentages and measurements
- ✓ Remove filler words ("um", "uh", etc.)
- ✓ Add any forgotten observations
- ✓ Ensure proper names of tests and stains

## Report Format

The system generates reports in the following standard pathology format:

- **PERIPHERAL BLOOD SMEARS**
- **BONE MARROW ASPIRATE SMEARS/TOUCH PREPARATION**
- **BONE MARROW CORE/CLOT SECTION**
- **IMMUNOHISTOCHEMISTRY/SPECIAL STAINS** (if applicable)
- **FLOW CYTOMETRY** (if applicable)
- **CYTOGENETICS** (if applicable)
- **MOLECULAR STUDIES** (if applicable)

Only applicable sections are included based on your observations.

## Troubleshooting

### Microphone Access Issues
- Ensure you've granted microphone permissions to your browser
- Check browser settings for microphone access
- Try using HTTPS (required by some browsers)

### API Errors
- Verify your API keys are correct in the `.env` file
- Check that you have sufficient API credits
- Ensure there are no extra spaces in your API keys

### Transcription Accuracy
- Deepgram is optimized for medical terminology
- For best results, speak clearly and use proper medical terms
- You can always edit the transcription before generating the report

### Server Won't Start
- Make sure port 3001 is not already in use
- Check that all dependencies are installed: `npm run install-all`
- Verify Node.js version is 18 or higher: `node --version`

## Cost Considerations

### Deepgram
- ~$0.0125 per minute of audio (pay-as-you-go)
- Free tier includes $200 in credits
- Average 2-minute observation costs ~$0.025

### Anthropic Claude
- ~$0.003 per 1K input tokens
- ~$0.015 per 1K output tokens
- Average report generation costs ~$0.05

**Estimated cost per report: ~$0.08**

## Security & Privacy

- ✅ No data is stored on servers
- ✅ API keys are kept secure on the backend
- ✅ All processing is done on-demand
- ✅ Reports are generated and immediately available for download
- ✅ No patient information is retained

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Safari
- ✅ Firefox
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Support

For issues, questions, or feature requests:
1. Check the troubleshooting section above
2. Review the API documentation:
   - [Deepgram Docs](https://developers.deepgram.com/)
   - [Anthropic Claude Docs](https://docs.anthropic.com/)

## License

MIT License - Feel free to use and modify for your needs.

## Acknowledgments

- **Deepgram** for excellent medical transcription
- **Anthropic** for Claude AI's medical report formatting capabilities
- Built with ❤️ for the medical community

---

**Note:** This system is designed to assist medical professionals in documentation. Always review generated reports for accuracy before use in clinical settings.

