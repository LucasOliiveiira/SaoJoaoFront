import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, X, Volume2, VolumeX } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { LastMessage, Person } from '../services/api';
import { useSpeech } from '../hooks/use-speech';

interface NewMessageNotificationProps {
  message: LastMessage;
  recipient: Person | undefined;
  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const NewMessageNotification: React.FC<NewMessageNotificationProps> = ({
  message,
  recipient,
  onClose,
  audioRef,
}) => {
  const [imgError, setImgError] = useState(false);
  const hasPlayedRef = useRef(false);
  
  const shouldSpeak = typeof message.lerComVoz === 'boolean' ? message.lerComVoz : true;
  const [isSpeaking, setIsSpeaking] = useState(shouldSpeak);
  const voiceGender = message.tipoVoz || 'female';
  
  console.log('📢 Configurações de voz da mensagem:', {
    lerComVoz: message.lerComVoz,
    tipoVoz: message.tipoVoz,
    shouldSpeak,
    voiceGender,
    messageId: message.id,
    hasPlayed: hasPlayedRef.current
  });
  
  if (typeof message.lerComVoz !== 'boolean') {
    console.warn('⚠️ O campo "lerComVoz" não está sendo retornado pelo backend. Usando valor padrão (true).');
    console.warn('Mensagem completa recebida:', message);
  }
  
  const { speak, stop } = useSpeech({
    rate: 1.3,
    pitch: voiceGender === 'female' ? 1.05 : 0.95,
    volume: 1.0,
    lang: 'pt-BR',
    preferredVoice: voiceGender
  });

  const fotoSrc = !recipient?.urlFoto || recipient.urlFoto.trim() === '' || imgError
    ? '/71YIvBZnx0L.jpg'
    : recipient.urlFoto;

  useEffect(() => {
    if (hasPlayedRef.current) {
      console.log('⚠️ Áudio já foi tocado, ignorando nova chamada');
      return;
    }
    
    hasPlayedRef.current = true;
    console.log('▶️ Iniciando reprodução de áudio e voz');
    
    const sound = audioRef.current;
    if (sound) {
      sound.volume = 0.3;
      sound.loop = true;
      sound.play().catch(err => console.error('Erro ao tocar áudio:', err));
    }

    if (shouldSpeak) {
      const textToSpeak = `Nova mensagem para ${message.destinatario}! ${message.conteudo}`;
      speak(textToSpeak);
    }

    const timer = setTimeout(() => {
      if (shouldSpeak) {
        stop();
      }
      onClose();
    }, 10000);

    return () => {
      console.log('🛑 Limpando áudio e voz');
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
        sound.loop = false;
        sound.volume = 1.0;
      }
      stop();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSpeech = () => {
    if (!shouldSpeak) return;
    
    if (isSpeaking) {
      stop();
    } else {
      const textToSpeak = `Nova mensagem para ${message.destinatario}! ${message.conteudo}`;
      speak(textToSpeak);
    }
    setIsSpeaking(!isSpeaking);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <ReactConfetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={400}
        colors={['#3b82f6', '#06b6d4', '#60a5fa', '#ffffff']}
        confettiSource={{ x: window.innerWidth / 2, y: window.innerHeight, w: window.innerWidth, h: 0 }}
      />
      <motion.div
        initial={{ scale: 0.5, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative w-full max-w-lg rounded-3xl border-8 border-blue-400 bg-gradient-to-br from-blue-500 to-cyan-500 p-8 text-white shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute -top-5 -right-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-500 shadow-lg transition-transform hover:scale-110"
        >
          <X size={28} />
        </button>
        {shouldSpeak && (
          <button
            onClick={toggleSpeech}
            className="absolute -top-5 -left-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-500 shadow-lg transition-transform hover:scale-110"
            title={isSpeaking ? "Desligar voz" : "Ligar voz"}
          >
            {isSpeaking ? <Volume2 size={28} /> : <VolumeX size={28} />}
          </button>
        )}
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Heart className="mb-4 h-16 w-16 text-white drop-shadow-lg" fill="white" />
          </motion.div>
          <h2 className="mb-2 text-3xl font-extrabold drop-shadow-lg">
            Nova Mensagem de Amor!
          </h2>
          <div className="mb-6 flex items-center gap-4 rounded-full bg-white/20 p-2">
            <img
              src={fotoSrc}
              alt={message.destinatario}
              className="h-14 w-14 rounded-full border-2 border-white object-cover"
              onError={() => setImgError(true)}
            />
            <p className="text-xl font-bold">
              Para: {message.destinatario}
            </p>
          </div>
          <div className="w-full rounded-2xl bg-white/90 p-6 text-gray-800">
            <p className="text-2xl font-bold italic leading-relaxed text-blue-700">
              "{message.conteudo}"
            </p>
            <p className="mt-4 text-right text-lg font-semibold text-blue-600">
              - {message.remetente}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewMessageNotification; 