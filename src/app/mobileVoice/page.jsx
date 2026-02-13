"use client";
import { useRef, useState } from "react";

export default function MobileVoicePage() {
  const [listening, setListening] = useState(false);
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");
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

    recognition.continuous = false;
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
        setText((prev) => prev + finalText);
        setInterim("");
      } else {
        setInterim(interimText);
      }
    };

    recognition.onerror = (e) => {
      setError(e.error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

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
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);
    };

    recorder.start();
    setRecording(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 space-y-6 text-white">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-wide">Mobile Voice Studio</h1>
          <p className="text-sm text-white/70 mt-1">Speech recognition + offline recording</p>
        </div>

        {/* SPEECH BUTTON */}
        <button
          onClick={listening ? stopListening : startListening}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg active:scale-95
            ${listening
              ? "bg-red-500 shadow-red-500/40 animate-pulse"
              : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/40"}`}
        >
          {listening ? "Listening... Tap to Stop" : "Start Voice Input"}
        </button>

        {/* RECORD BUTTON */}
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg active:scale-95
            ${recording
              ? "bg-rose-600 shadow-rose-500/40 animate-pulse"
              : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/40"}`}
        >
          {recording ? "Recording... Tap to Stop" : "Record Audio (Offline)"}
        </button>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/40 rounded-xl p-3 text-sm text-red-200 text-center">
            {error}
          </div>
        )}

        {/* TEXT OUTPUT */}
        {(text || interim) && (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 space-y-3">
            <p className="text-white leading-relaxed">
              {text}
              <span className="text-white/50 italic">{interim}</span>
            </p>

            <button
              onClick={clearText}
              className="w-full py-2 rounded-xl bg-white/20 hover:bg-white/30 transition"
            >
              Clear Text
            </button>
          </div>
        )}

        {/* AUDIO PLAYER */}
        {audioBlob && (
          <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-4 space-y-3">
            <p className="font-semibold text-emerald-200 text-center">Offline Recording Ready</p>

            <audio
              controls
              src={URL.createObjectURL(audioBlob)}
              className="w-full"
            />

            <button
              onClick={downloadAudio}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition font-semibold"
            >
              Download Audio
            </button>
          </div>
        )}

      </div>
    </div>
  );
}