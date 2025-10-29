import { useEffect, useRef, useState } from 'react';

interface UseSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  preferredVoice?: 'female' | 'male' | 'auto';
}

const getBestVoice = (lang: string, preferredVoice: 'female' | 'male' | 'auto' = 'auto'): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  
  const ptBRVoices = voices.filter(voice => 
    voice.lang.includes('pt-BR') || voice.lang.includes('pt_BR')
  );

  const googleVoices = ptBRVoices.filter(voice => 
    voice.name.includes('Google') || voice.name.includes('premium')
  );

  const femaleVoices = ptBRVoices.filter(voice => 
    voice.name.toLowerCase().includes('female') ||
    voice.name.toLowerCase().includes('feminina') ||
    voice.name.includes('Luciana') ||
    voice.name.includes('Maria') ||
    voice.name.includes('Joana')
  );

  const maleVoices = ptBRVoices.filter(voice => 
    voice.name.toLowerCase().includes('male') && !voice.name.toLowerCase().includes('female') ||
    voice.name.toLowerCase().includes('masculino') ||
    voice.name.includes('Daniel') ||
    voice.name.includes('Felipe')
  );

  if (preferredVoice === 'female' && femaleVoices.length > 0) {
    return googleVoices.find(v => femaleVoices.includes(v)) || femaleVoices[0];
  }
  
  if (preferredVoice === 'male' && maleVoices.length > 0) {
    return googleVoices.find(v => maleVoices.includes(v)) || maleVoices[0];
  }

  if (googleVoices.length > 0) {
    return googleVoices[0];
  }

  if (ptBRVoices.length > 0) {
    return ptBRVoices[0];
  }

  return voices.find(v => v.lang.includes(lang)) || voices[0] || null;
};

export const useSpeech = (options: UseSpeechOptions = {}) => {
  const {
    rate = 1.0,
    pitch = 1.0,
    volume = 1.0,
    lang = 'pt-BR',
    preferredVoice = 'female'
  } = options;

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoicesLoaded(true);
          console.log('Vozes disponíveis:', voices.map(v => ({
            name: v.name,
            lang: v.lang,
            default: v.default
          })));
        }
      };

      loadVoices();
      
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const speak = (text: string, onEnd?: () => void) => {
    if (!synthRef.current) {
      console.warn('Speech Synthesis não suportado neste navegador');
      return;
    }

    if (synthRef.current.speaking) {
      console.log('🔇 Cancelando voz anterior antes de falar novamente');
      synthRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = lang;

    const bestVoice = getBestVoice(lang, preferredVoice);
    if (bestVoice) {
      utterance.voice = bestVoice;
      console.log('🎤 Usando voz:', bestVoice.name);
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    utterance.onerror = (event) => {
      console.error('❌ Erro na síntese de voz:', event);
    };

    utteranceRef.current = utterance;
    console.log('🗣️ Iniciando fala:', text.substring(0, 50) + '...');
    synthRef.current.speak(utterance);
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const pause = () => {
    if (synthRef.current) {
      synthRef.current.pause();
    }
  };

  const resume = () => {
    if (synthRef.current) {
      synthRef.current.resume();
    }
  };

  return { speak, stop, pause, resume };
};

