"use client";
import { useRef, useState, useEffect } from "react";

export default function MobileVoicePage() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");

  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // -----------------------------
  // SPEECH RECOGNITION
  // -----------------------------
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript + " ";
        else interimText += transcript;
      }

      if (finalText) {
        setText(prev => prev + finalText);
        setInterim("");
      } else {
        setInterim(interimText);
      }
    };

    recognition.onerror = (e) => {
      setError(e.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    setListening(true);
    setError("");
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  // -----------------------------
  // AUDIO RECORDING (OFFLINE)
  // -----------------------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      recorder.start();
      setRecording(true);
      setError("");
    } catch (err) {
      setError("Microphone access denied or error: " + err.message);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const downloadAudio = () => {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voice-recording.webm";
    a.click();
  };

  const clearText = () => {
    setText("");
    setInterim("");
  };

  const isActive = listening || recording;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <header className="w-full max-w-md mt-8 z-10">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center tracking-tight">
          Nexa Voice
        </h1>
        <p className="text-slate-400 text-center text-sm mt-2">AI-Powered Speech Assistant</p>
      </header>

      {/* Center Control Section */}
      <main className="flex flex-col items-center justify-center w-full z-10 flex-1 py-12">
        <div className="relative flex items-center justify-center w-64 h-64">
          {/* Animated Waves */}
          {isActive && (
            <>
              <div className="absolute w-full h-full rounded-full bg-blue-500/20 animate-ping" />
              <div className="absolute w-3/4 h-3/4 rounded-full bg-blue-500/30 animate-[ping_1.5s_linear_infinite]" />
              <div className="absolute w-1/2 h-1/2 rounded-full bg-blue-400/40 animate-[ping_2s_linear_infinite]" />
            </>
          )}

          {/* Main Action Button */}
          <button
            onClick={listening ? stopListening : startListening}
            className={`relative z-20 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              listening 
                ? "bg-red-500 hover:bg-red-400 scale-110 shadow-red-500/40" 
                : "bg-gradient-to-tr from-blue-600 to-indigo-500 hover:scale-105 shadow-blue-500/40"
            }`}
          >
            {listening ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-14 h-14">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <p className={`text-lg font-medium transition-colors ${listening ? "text-red-400 animate-pulse" : "text-blue-400"}`}>
            {listening ? "Listening..." : recording ? "Recording..." : "Tap to Speak"}
          </p>

          <button
            onClick={recording ? stopRecording : startRecording}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 border ${
              recording 
                ? "bg-red-500/10 border-red-500/50 text-red-500" 
                : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${recording ? "bg-red-500 animate-pulse" : "bg-slate-500"}`} />
            {recording ? "Stop Recording" : "Record Audio Link"}
          </button>
        </div>
      </main>

      {/* Output Bottom Sheet / Card */}
      <footer className="w-full max-w-md z-10 pb-8">
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center text-sm">
            {error}
          </div>
        )}

        {(text || interim || audioBlob) && (
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            { (text || interim) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transcription</span>
                  <button onClick={clearText} className="text-slate-500 hover:text-slate-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto custom-scrollbar">
                  <p className="text-lg leading-relaxed text-slate-200">
                    {text}
                    {interim && <span className="text-slate-500 italic"> {interim}</span>}
                  </p>
                </div>
              </div>
            )}

            {audioBlob && (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Audio Record</span>
                  <button onClick={downloadAudio} className="text-blue-400 hover:text-blue-300 text-xs font-bold">
                    SAVE FILE
                  </button>
                </div>
                <audio controls src={URL.createObjectURL(audioBlob)} className="w-full h-10 filter invert brightness-110 opacity-70" />
              </div>
            )}
          </div>
        )}
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

