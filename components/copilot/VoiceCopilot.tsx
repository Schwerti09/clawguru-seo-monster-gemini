'use client';

import { useState, useCallback } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';

type SpeechRecognitionEventLike = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}

type SpeechRecognitionLike = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: any) => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike

interface VoiceCopilotProps {
  lang?: string;
  onTranscript?: (text: string) => void;
}

export default function VoiceCopilot({ lang = 'de', onTranscript }: VoiceCopilotProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [recognitionRef, setRecognitionRef] = useState<SpeechRecognitionLike | null>(null);

  const toggleListening = useCallback(() => {
    const win = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructorLike
      webkitSpeechRecognition?: SpeechRecognitionConstructorLike
    }
    const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setError('Speech Recognition wird von deinem Browser nicht unterstützt.');
      return;
    }

    if (isListening && recognitionRef) {
      recognitionRef.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const current = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setTranscript(current);
      setError('');
    };

    recognition.onerror = (event: any) => {
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.start();
    setRecognitionRef(recognition);
    setIsListening(true);
    setError('');
  }, [isListening, recognitionRef, lang]);

  const sendTranscript = useCallback(() => {
    if (transcript.trim() && onTranscript) {
      onTranscript(transcript);
      setTranscript('');
      if (recognitionRef) {
        recognitionRef.stop();
        setIsListening(false);
      }
    }
  }, [transcript, onTranscript, recognitionRef]);

  const clear = useCallback(() => {
    setTranscript('');
    setError('');
    if (recognitionRef) {
      recognitionRef.stop();
      setIsListening(false);
    }
  }, [recognitionRef]);

  return (
    <div className="w-full space-y-4 p-5 rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/30 to-black/20">
      <div className="flex items-center gap-3 justify-between">
        <button
          onClick={toggleListening}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
            isListening
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
              : 'bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 animate-pulse" />
              Stoppen
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Sprechen
            </>
          )}
        </button>
        {transcript && (
          <div className="text-xs text-gray-400">
            {isListening ? '🔴 Listening...' : '✓ Ready'}
          </div>
        )}
      </div>

      {transcript && (
        <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-700/40">
          <div className="text-xs text-gray-500 mb-2">Transkription:</div>
          <div className="text-sm text-gray-200 leading-relaxed">{transcript}</div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-900/20 border border-red-700/40">
          <div className="text-xs text-red-400">{error}</div>
        </div>
      )}

      {transcript && (
        <div className="flex gap-2">
          <button
            onClick={sendTranscript}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-cyan/20 to-brand-cyan/10 border border-brand-cyan/40 text-brand-cyan hover:from-brand-cyan/30 hover:to-brand-cyan/20 font-semibold transition-all"
          >
            <Send className="w-4 h-4" />
            An Copilot senden
          </button>
          <button
            onClick={clear}
            className="px-4 py-2 rounded-xl bg-gray-700/20 border border-gray-600/40 text-gray-400 hover:bg-gray-700/30 transition-all"
          >
            Löschen
          </button>
        </div>
      )}
    </div>
  );
}