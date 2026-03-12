'use client';

import { useRef } from 'react';

// Global Declaration für SpeechRecognition (fix)
declare global {
  interface Window {
    SpeechRecognition?: unknown;
    webkitSpeechRecognition?: unknown;
  }
}

export default function CosmicSummon() {
  const recognitionRef = useRef<unknown>(null);
  void recognitionRef
  return null
}