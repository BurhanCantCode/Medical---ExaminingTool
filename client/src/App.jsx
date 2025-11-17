import React, { useState } from 'react';
import RecordingButton from './components/RecordingButton';
import TranscriptionEditor from './components/TranscriptionEditor';
import ReportDisplay from './components/ReportDisplay';

function App() {
  const [currentStep, setCurrentStep] = useState('record'); // record, edit, report
  const [transcription, setTranscription] = useState('');
  const [report, setReport] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecordingComplete = (transcript) => {
    setTranscription(transcript);
    setCurrentStep('edit');
  };

  const handleTranscriptionEdit = (editedTranscript) => {
    setTranscription(editedTranscript);
  };

  const handleGenerateReport = async () => {
    setIsProcessing(true);
    setCurrentStep('report');
    // The ReportDisplay component will handle the actual generation
  };

  const handleStartOver = () => {
    setCurrentStep('record');
    setTranscription('');
    setReport('');
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Medical Observation System
          </h1>
          <p className="text-gray-600">
            Record, transcribe, and generate professional pathology reports
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep === 'record' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                ${currentStep === 'record' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}`}>
                <span className="font-semibold">1</span>
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Record</span>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-300"></div>
            
            <div className={`flex items-center ${currentStep === 'edit' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                ${currentStep === 'edit' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}`}>
                <span className="font-semibold">2</span>
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Edit</span>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-300"></div>
            
            <div className={`flex items-center ${currentStep === 'report' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                ${currentStep === 'report' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}`}>
                <span className="font-semibold">3</span>
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Report</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="card">
          {currentStep === 'record' && (
            <RecordingButton onRecordingComplete={handleRecordingComplete} />
          )}

          {currentStep === 'edit' && (
            <TranscriptionEditor
              transcription={transcription}
              onEdit={handleTranscriptionEdit}
              onGenerateReport={handleGenerateReport}
              onBack={() => setCurrentStep('record')}
            />
          )}

          {currentStep === 'report' && (
            <ReportDisplay
              transcription={transcription}
              onStartOver={handleStartOver}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Deepgram & Claude AI</p>
        </div>
      </div>
    </div>
  );
}

export default App;

