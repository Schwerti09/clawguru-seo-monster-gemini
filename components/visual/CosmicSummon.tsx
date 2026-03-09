'use client';

import { useState, useRef } from 'react';
// deine anderen Imports bleiben gleich

// Global Declaration für SpeechRecognition (fix)
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export default function CosmicSummon() {
  // dein gesamter restlicher Code bleibt unverändert
  const recognitionRef = useRef<any>(null);
  // ... der Rest der Datei bleibt genau wie bei dir

  // (der Rest deines Codes hier – nichts ändern)
}