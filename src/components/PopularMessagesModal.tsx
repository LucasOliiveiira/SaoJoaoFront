import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, ThumbsUp, X } from 'lucide-react';
import { fetchPopularMessages, TopMessage } from '../services/api';
import { useToast } from '../hooks/use-toast';

interface PopularMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PopularMessagesModal: React.FC<PopularMessagesModalProps> = ({ isOpen, onClose }) => {
  const [popularMessages, setPopularMessages] = useState<TopMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchPopularMessages()
        .then(setPopularMessages)
        .catch(() => {
          toast({
            title: 'Erro ao carregar o ranking',
            description: 'Não foi possível carregar as mensagens populares.',
            variant: 'destructive',
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, toast]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-4 border-blue-400 rounded-3xl p-6 w-full max-w-3xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-blue-200">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-500" />
                <h2 className="text-3xl font-bold text-blue-800">Mensagens Populares</h2>
              </div>
              <button onClick={onClose} className="text-blue-500 hover:text-blue-700 transition-colors">
                <X className="w-7 h-7" />
              </button>
            </div>
            
            {/* Mensagem explicativa sobre anonimato */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 text-center">
                <strong>💡 Lembre-se:</strong> As mensagens são anônimas! 
                Não identificamos quem enviou cada mensagem, apenas quem recebeu.
              </p>
            </div>
            
            <div className="overflow-y-auto pr-2">
              {isLoading ? (
                <p className="text-center text-blue-600">Carregando ranking...</p>
              ) : popularMessages.length === 0 ? (
                <p className="text-center text-blue-600">Ainda não há mensagens no ranking.</p>
              ) : (
                <ul className="space-y-4">
                  {popularMessages.map((msg, index) => (
                    <motion.li
                      key={msg.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/80 rounded-2xl p-3 sm:p-4 flex items-start gap-3 sm:gap-4 shadow-md border border-blue-100"
                    >
                      <div className="flex-shrink-0 text-xl sm:text-2xl font-bold text-blue-400 w-6 sm:w-8 text-center">
                        {index + 1}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-base sm:text-lg text-blue-900 font-semibold italic break-words">"{msg.mensagem}"</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-2 break-words">
                          De: <span className="font-medium text-blue-700">{msg.remetente}</span><br/>
                          Para: <span className="font-medium text-blue-700">{msg.destinatario}</span>
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2 bg-blue-100 text-blue-600 font-bold px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                        <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{msg.likesCount}</span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopularMessagesModal; 