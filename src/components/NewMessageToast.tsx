import { motion } from 'framer-motion';
import { PartyPopper, X } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { ReceivedMessage } from '../services/api';

interface NewMessageToastProps {
  message: ReceivedMessage;
  toastId: string | number;
}

const NewMessageToast: React.FC<NewMessageToastProps> = ({ message, toastId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative flex items-center gap-4 w-full max-w-sm p-4 bg-gradient-to-br from-green-400 to-teal-500 text-white rounded-2xl shadow-2xl border-2 border-white/50 overflow-hidden"
    >
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/20 rounded-full animate-pulse" />
      <div className="shrink-0 z-10">
        <PartyPopper className="w-8 h-8 text-yellow-300" />
      </div>
      <div className="flex-1 min-w-0 z-10">
        <p className="font-bold text-lg drop-shadow-md">Nova Mensagem!</p>
        <p className="text-sm truncate">
          <span className="font-semibold">{message.name}</span> recebeu de <span className="font-semibold">{message.remetente}</span>
        </p>
      </div>
      <button
        onClick={() => toast.dismiss(toastId)}
        className="shrink-0 text-white/70 hover:text-white transition-colors z-10"
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export default NewMessageToast; 