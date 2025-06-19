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
  const [sender, setSender] = useState('');
  const [showSenderInput, setShowSenderInput] = useState(false);
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
        remetente: showSenderInput ? sender : 'Anônimo',
        destinatario: recipient.name,
        mensagem: message
      });
      
      toast({
        title: "🎉 Mensagem enviada!",
        description: `Sua mensagem para ${recipient.name} foi enviada com sucesso!`,
      });
      
      setSender('');
      setMessage('');
      setShowSenderInput(false);
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
            className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-red-400 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                <h2 className="text-2xl font-bold text-red-700">Enviar Cartinha</h2>
              </div>
              <button
                onClick={onClose}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {recipient && (
              <div className="text-center mb-6 p-4 bg-white rounded-2xl border-2 border-yellow-300">
                <img
                  src={!recipient.urlFoto || recipient.urlFoto.trim() === '' || imgError ? '/71YIvBZnx0L.jpg' : recipient.urlFoto}
                  alt={recipient.name}
                  className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-red-400"
                  onError={() => setImgError(true)}
                />
                <p className="text-red-700 font-bold">Para: {recipient.name}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="showSenderInput"
                  checked={showSenderInput}
                  onChange={() => {
                    setShowSenderInput((prev) => !prev);
                    if (showSenderInput) setSender('');
                  }}
                  className="mr-2 accent-red-500"
                />
                <label htmlFor="showSenderInput" className="text-red-700 font-medium cursor-pointer">
                  Quero me identificar
                </label>
              </div>
              <div>
                {showSenderInput && (
                  <>
                    <label className="block text-red-700 font-bold mb-2">
                      Seu nome:
                    </label>
                    <input
                      type="text"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      className="w-full p-3 border-2 border-yellow-300 rounded-xl focus:border-red-400 focus:outline-none bg-white"
                      placeholder="Digite seu nome..."
                    />
                  </>
                )}
              </div>

              <div>
                <label className="block text-red-700 font-bold mb-2">
                  Sua mensagem:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border-2 border-yellow-300 rounded-xl focus:border-red-400 focus:outline-none bg-white h-32 resize-none"
                  placeholder="Escreva sua mensagem aqui..."
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
                  disabled={isLoading || !message.trim() || (showSenderInput && !sender.trim())}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
