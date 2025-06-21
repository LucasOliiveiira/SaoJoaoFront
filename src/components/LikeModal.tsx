import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, X } from 'lucide-react';
import { voteOnMessage, fetchAllMessages, ReceivedMessage, Person } from '../services/api';
import { useToast } from '../hooks/use-toast';

interface LikeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Person | null;
}

const LikeModal: React.FC<LikeModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [messages, setMessages] = useState<ReceivedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [likedMessageIds, setLikedMessageIds] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetchAllMessages()
        .then(setMessages)
        .catch(() => {
          toast({
            title: 'Erro ao carregar mensagens',
            description: 'Não foi possível carregar as mensagens para votação.',
            variant: 'destructive',
          });
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, toast]);

  const handleLike = async (messageId: number) => {
    if (!currentUser || likedMessageIds.has(messageId)) return;

    try {
      await voteOnMessage({ mensagemId: messageId, usuarioId: currentUser.id });
      setLikedMessageIds(prev => new Set(prev).add(messageId));
      toast({
        title: 'Voto computado!',
        description: 'Obrigado por participar!',
      });
    } catch (error) {
      toast({
        title: 'Erro ao votar',
        description: error instanceof Error ? error.message : 'Não foi possível registrar seu voto.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 border-4 border-gray-300 rounded-3xl p-4 sm:p-6 w-full max-w-lg sm:max-w-3xl max-h-[85vh] sm:max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Votar na Melhor Mensagem</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X className="w-6 h-6 sm:w-7 sm:h-7" />
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
                <p className="text-center text-gray-600">Carregando mensagens...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-gray-600">Nenhuma mensagem para votar no momento.</p>
              ) : (
                <ul className="space-y-4">
                  {messages.map((msg) => {
                    const isLiked = likedMessageIds.has(msg.mensagemId);
                    return (
                      <motion.li
                        key={msg.mensagemId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-md border border-gray-200"
                      >
                        <div className="flex-grow w-full">
                          <p className="text-base sm:text-lg text-gray-800 italic break-words">"{msg.mensagem}"</p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-2 break-words">
                            De: <span className="font-medium text-gray-700">{msg.remetente}</span> para <span className="font-medium text-gray-700">{msg.name}</span>
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleLike(msg.mensagemId)}
                          disabled={isLiked}
                          whileHover={{ scale: isLiked ? 1 : 1.1 }}
                          whileTap={{ scale: isLiked ? 1 : 0.9 }}
                          className={`flex-shrink-0 flex items-center gap-1 sm:gap-2 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                            isLiked
                              ? 'bg-green-500 text-white cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline">{isLiked ? 'Votado' : 'Votar'}</span>
                        </motion.button>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LikeModal; 