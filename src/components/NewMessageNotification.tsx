import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, X } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { LastMessage, Person } from '../services/api';

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
  const fotoSrc = !recipient?.urlFoto || recipient.urlFoto.trim() === '' || imgError
    ? '/71YIvBZnx0L.jpg'
    : recipient.urlFoto;

  useEffect(() => {
    const sound = audioRef.current;
    if (sound) {
      sound.loop = true;
      sound.play();
    }

    const timer = setTimeout(onClose, 7000); // Fecha automaticamente após 7 segundos

    return () => {
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
        sound.loop = false;
      }
      clearTimeout(timer);
    };
  }, [onClose, audioRef]);

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