import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Lightbulb, Check } from 'lucide-react';
import { fetchSuggestions, Suggestion } from '../services/api';
import { useToast } from '../hooks/use-toast';

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuggestionsModal: React.FC<SuggestionsModalProps> = ({ isOpen, onClose }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadSuggestions();
    }
  }, [isOpen]);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSuggestions();
      setSuggestions(data);
    } catch (error) {
      toast({
        title: "😔 Erro ao carregar",
        description: "Não foi possível carregar as sugestões.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({
        title: "📋 Copiado!",
        description: "Sugestão copiada para a área de transferência!",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast({
        title: "😔 Erro ao copiar",
        description: "Não foi possível copiar a sugestão.",
        variant: "destructive",
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 border-4 border-blue-400 rounded-3xl p-4 sm:p-6 w-full max-w-lg sm:max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <h2 className="text-2xl font-bold text-blue-700">Sugestões de Mensagens</h2>
              </div>
              <button
                onClick={onClose}
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-96 space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-blue-600">Carregando sugestões...</p>
                </div>
              ) : suggestions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-blue-600">Nenhuma sugestão disponível no momento.</p>
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id ?? index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-yellow-200 via-pink-100 to-red-200 border-4 border-pink-400 rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-2xl shadow-lg transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Elementos festivos animados */}
                    <div className="absolute -top-4 -left-4 text-yellow-200 text-5xl select-none pointer-events-none rotate-[-15deg] animate-bounce">🎉</div>
                    <div className="absolute -bottom-4 -right-4 text-pink-200 text-4xl select-none pointer-events-none rotate-[10deg] animate-pulse">🎊</div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                      <p className="text-pink-700 w-full leading-relaxed text-lg sm:text-xl md:text-2xl font-extrabold italic text-center drop-shadow-lg px-2 break-words">
                        "{suggestion.texto || suggestion.mensagem}"
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyToClipboard(suggestion.texto || suggestion.mensagem || '', suggestion.id ?? index)}
                        className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white p-2 sm:p-3 rounded-xl hover:from-pink-400 hover:to-yellow-400 transition-all duration-300 flex items-center gap-1 text-sm sm:text-base font-extrabold shadow-lg flex-shrink-0 w-full sm:w-auto justify-center"
                      >
                        {copiedId === (suggestion.id ?? index) ? (
                          <>
                            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                    {/* Mais elementos engraçados */}
                    <div className="flex justify-center gap-2 mt-3">
                      <span className="text-2xl animate-bounce">🔥</span>
                      <span className="text-2xl animate-pulse">🌽</span>
                      <span className="text-2xl animate-spin-slow">🎈</span>
                      <span className="text-2xl animate-bounce">💃</span>
                      <span className="text-2xl animate-pulse">🕺</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              >
                Fechar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuggestionsModal;
