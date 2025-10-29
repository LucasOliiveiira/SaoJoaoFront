import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Heart } from 'lucide-react';
import { Person, sendMessage } from '../services/api';
import { useToast } from '../hooks/use-toast';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: Person | null;
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose, recipient }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [imgError, setImgError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !message.trim()) return;

    setIsLoading(true);
    try {
      await sendMessage({
        remetente: 'Anônimo', // showSenderInput is removed, so default to 'Anônimo'
        destinatario: recipient.name,
        mensagem: message
      });
      
      toast({
        title: "🎉 Mensagem enviada!",
        description: `Sua mensagem anônima para ${recipient.name} foi enviada com sucesso!`,
      });
      
      setMessage('');
      onClose();
    } catch (error) {
      toast({
        title: "😔 Erro ao enviar",
        description: "Não foi possível enviar a mensagem. Tente novamente!",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 border-4 border-blue-400 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-blue-500 fill-blue-500" />
                <h2 className="text-2xl font-bold text-blue-700">Enviar Cartinha</h2>
              </div>
              <button
                onClick={onClose}
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
              <p className="text-sm text-cyan-700 text-center">
                <strong>🔒 Mensagem Anônima:</strong> Sua identidade será mantida em sigilo. 
                Apenas o destinatário saberá que recebeu uma mensagem.
              </p>
            </div>

            {recipient && (
              <div className="text-center mb-6 p-4 bg-white rounded-2xl border-2 border-blue-300">
                <img
                  src={!recipient.urlFoto || recipient.urlFoto.trim() === '' || imgError ? '/71YIvBZnx0L.jpg' : recipient.urlFoto}
                  alt={recipient.name}
                  className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-blue-400"
                  onError={() => setImgError(true)}
                />
                <p className="text-blue-700 font-bold">Para: {recipient.name}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-blue-700 font-bold mb-2">
                  Sua mensagem:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border-2 border-blue-300 rounded-xl focus:border-blue-400 focus:outline-none bg-white h-32 resize-none"
                  placeholder="Escreva sua mensagem anônima aqui..."
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading || !message.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SendModal;
