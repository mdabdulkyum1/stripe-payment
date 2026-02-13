'use client';
import { useState, useEffect, useRef } from 'react';

export default function VoicePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [error, setError] = useState('');
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioChunksRef = useRef([]);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    // Check if mobile
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);

    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
      setIsSupported(true);
    }

    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsRecognitionSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinal += transcript + ' ';
          } else {
            currentInterim += transcript;
          }
        }

        if (currentFinal) {
          setTranscribedText(prev => (prev.endsWith(' ') ? prev : prev + ' ') + currentFinal);
          setInterimText(''); // Clear interim when we get final
        } else if (currentInterim) {
          setInterimText(currentInterim);
        }
        setError('');
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'aborted' && isMobile) {
          setError('Recording aborted. Mobile browsers often block simultaneous text & audio recording. Trying to fix...');
        } else {
          setError(`Speech Error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsRecognitionSupported(false);
      setError('Speech Recognition is NOT supported in this browser.');
    }
  }, []);

  const speak = (text) => {
    if (!isSupported) {
      alert('Speech synthesis is not supported in your browser');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setError('');
      
      // ON MOBILE: We skip MediaRecorder if prioritized for text to avoid "aborted" error
      // Many mobile browsers can't handle both streams at once.
      if (!isMobile) {
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setAudioBlob(audioBlob);
          console.log('Audio recording completed:', audioBlob);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } else {
        // on mobile we just set isRecording to true to show UI, but skip file creation
        setIsRecording(true);
        console.log('Mobile detected: Prioritizing transcription over file recording to prevent abort error');
      }

      // Start speech recognition
      if (recognitionRef.current) {
        setError('');
        try {
          recognitionRef.current.start();
          setIsListening(true);
          setTranscribedText('');
          setLastTranscript('');
        } catch (e) {
          console.error('Failed to start recognition:', e);
          setError('Failed to start speech recognition. It might already be running or blocked.');
        }
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    
    // Stop all tracks to release microphone
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(transcribedText);
      alert('Text copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy text:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = transcribedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Text copied to clipboard!');
    }
  };

  const clearText = () => {
    setTranscribedText('');
    setInterimText('');
    setAudioBlob(null);
  };

  const sendAudioToBackend = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('transcript', transcribedText);

      const response = await fetch('/api/audio-upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Audio uploaded successfully:', result);
        alert('Audio uploaded successfully!');
      } else {
        console.error('Failed to upload audio');
        alert('Failed to upload audio');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      alert('Error uploading audio');
    }
  };

  const welcomeMessages = [
    "Welcome to our Stripe Payment application! We're excited to have you here.",
    "Hello! Thank you for choosing our payment platform. How can we help you today?",
    "Welcome! You're now on our voice-enabled payment system. Feel free to explore our features.",
    "Hi there! Welcome to the future of payments. We're here to make your experience seamless."
  ];

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Voice Experience</h1>
        <p className="text-lg sm:text-xl text-gray-600">Experience our payment platform with voice interaction</p>
      </div>

      {/* Speech-to-Text Section */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center sm:text-left">Speech-to-Text Recording</h2>
        
        <div className="flex items-center justify-center mb-6">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-200 ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : 'bg-blue-600 hover:bg-blue-700'
            } cursor-pointer`}
          >
            {isRecording ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        <div className="text-center mb-4">
          <p className="text-gray-600">
            {isRecording ? 'Recording... Click to stop' : 'Click the microphone to start recording'}
          </p>
          {isListening && (
            <p className="text-green-600 font-semibold mt-2 animate-pulse">Listening for speech...</p>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
              {!isRecognitionSupported && (
                <p className="mt-1 font-bold">Try using Chrome on Android or Safari on iPhone.</p>
              )}
            </div>
          )}
        </div>

        {/* Floating Text Display */}
        {transcribedText && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 w-full relative z-50 shadow-sm min-h-[100px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
              <h3 className="font-semibold text-blue-900 mb-2 sm:mb-0">Transcribed Text:</h3>
              <div className="flex space-x-2 w-full sm:w-auto">
                <button
                  onClick={copyText}
                  className="flex-1 sm:flex-none bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Copy
                </button>
                <button
                  onClick={clearText}
                  className="flex-1 sm:flex-none bg-gray-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            </div>
            <p className="text-blue-800 whitespace-pre-wrap break-all sm:break-words text-base sm:text-lg leading-relaxed">
              {transcribedText}
              <span className="text-blue-400 italic">{interimText}</span>
            </p>
          </div>
        )}

        {/* Audio Recording Info */}
        {audioBlob && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-green-900 mb-2">Audio Recording:</h3>
            <p className="text-green-800 text-sm">
              File size: {(audioBlob.size / 1024).toFixed(2)} KB
            </p>
            <p className="text-green-800 text-sm">
              File type: {audioBlob.type}
            </p>
            {/* Audio playback */}
            <audio
              controls
              src={URL.createObjectURL(audioBlob)}
              className="w-full mt-2"
            >
              Your browser does not support the audio element.
            </audio>
            <button
              onClick={() => sendAudioToBackend(audioBlob)}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200"
            >
              Send to Backend
            </button>
            <div className="mt-2 bg-gray-100 p-2 rounded max-h-40 overflow-y-auto border border-gray-200">
                <p className="text-blue-800 whitespace-pre-wrap break-all sm:break-words text-base sm:text-lg leading-relaxed">
                  To:- {transcribedText}
                  <span className="text-blue-400 italic">{interimText}</span>
                </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Welcome Voice Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome Voice</h2>
          <p className="text-gray-600 mb-6">
            Click the button below to hear a welcome message from our application.
          </p>
          
          <div className="space-y-4">
            {welcomeMessages.map((message, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 mb-3">{message}</p>
                <button
                  onClick={() => speak(message)}
                  disabled={!isSupported || isPlaying}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isPlaying ? 'Playing...' : 'Play Message'}
                </button>
              </div>
            ))}
          </div>

          {isPlaying && (
            <button
              onClick={stopSpeaking}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Stop Speaking
            </button>
          )}
        </div>

        {/* Voice Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Voice Features</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Confirmation</h3>
              <p className="text-gray-600 mb-3">Hear confirmation when your payment is successful.</p>
              <button
                onClick={() => speak("Your payment has been processed successfully. Thank you for your purchase!")}
                disabled={!isSupported || isPlaying}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Play Confirmation
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Error Notification</h3>
              <p className="text-gray-600 mb-3">Voice notification for payment errors.</p>
              <button
                onClick={() => speak("We're sorry, but there was an error processing your payment. Please try again.")}
                disabled={!isSupported || isPlaying}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Play Error Message
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Help & Support</h3>
              <p className="text-gray-600 mb-3">Voice assistance for common questions.</p>
              <button
                onClick={() => speak("Need help? Our support team is available 24/7. You can contact us through our website or call our helpline.")}
                disabled={!isSupported || isPlaying}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Play Help Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Settings */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Voice Settings</h2>
        <p className="text-gray-600">
          This page demonstrates voice interaction capabilities. In a real application, you could:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
          <li>Enable voice navigation through the application</li>
          <li>Provide voice feedback for payment status</li>
          <li>Offer voice commands for common actions</li>
          <li>Implement accessibility features for visually impaired users</li>
          <li>Add voice authentication for enhanced security</li>
          <li>Record and store voice commands for analysis</li>
        </ul>
      </div>
    </div>
  );
} 