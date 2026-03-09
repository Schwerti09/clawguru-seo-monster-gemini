'use client';

import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceCopilotProps {
  lang?: string;
}

export default function VoiceCopilot({ lang = 'de' }: VoiceCopilotProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const toggleListening = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert('Speech Recognition wird von deinem Browser nicht unterstützt.');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      const current = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setTranscript(current);
    };

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleListening}
        className="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-2xl border border-zinc-700 transition-all shadow-xl"
      >
        {isListening ? <MicOff className="w-5 h-5 text-red-500" /> : <Mic className="w-5 h-5" />}
        <span>{isListening ? 'Stoppen' : 'Sprach-Copilot'}</span>
      </button>

      {transcript && (
        <div className="mt-3 bg-zinc-900 border border-zinc-700 rounded-2xl p-4 max-w-xs text-sm">
          {transcript}
        </div>
      )}
    </div>
  );
}