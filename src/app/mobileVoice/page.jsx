"use client";
import { useRef, useState } from "react";

export default function MobileVoicePage() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false; // mobile stable
    recognition.interimResults = true;
    recognition.lang = "en-US"; // change bn-BD if needed

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
      setError("Error: " + e.error);
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

  const clearText = () => {
    setText("");
    setInterim("");
  };

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-6">Mobile Voice Input</h1>

      <button
        onClick={listening ? stopListening : startListening}
        className={`px-6 py-4 rounded-full text-white text-lg ${
          listening ? "bg-red-600" : "bg-blue-600"
        }`}
      >
        {listening ? "Stop Listening" : "Start Speaking"}
      </button>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {(text || interim) && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Speech Text:</h2>
          <p>
            {text}
            <span className="text-gray-400 italic">{interim}</span>
          </p>

          <button
            onClick={clearText}
            className="mt-3 px-4 py-2 bg-gray-700 text-white rounded"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
