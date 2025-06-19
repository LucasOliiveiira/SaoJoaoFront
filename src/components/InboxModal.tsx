import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Mail, User, Calendar } from 'lucide-react';
import { fetchMyMessages, fetchPeople, Message, Person } from '../services/api';
import { useToast } from '../hooks/use-toast';

interface InboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InboxModal: React.FC<InboxModalProps> = ({ isOpen, onClose }) => {
  const [personId, setPersonId] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (isOpen) {
      fetchPeople()
        .then(setPeople)
        .catch(() => {
          toast({
            title: 'Erro ao carregar pessoas',
            description: 'Não foi possível carregar a lista de pessoas.',
            variant: 'destructive',
          });
        });
    }
  }, [isOpen, toast]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personId.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await fetchMyMessages(parseInt(personId));
      setMessages(data);
      if (data.length === 0) {
        toast({
          title: "📭 Caixa vazia",
          description: "Nenhuma mensagem encontrada para este pinpolho.",
        });
      }
    } catch (error) {
      toast({
        title: "😔 Erro na busca",
        description: "Não foi possível buscar as mensagens.",
        variant: "destructive",
      });
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setPersonId('');
    setMessages([]);
    setHasSearched(false);
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
            className="bg-gradient-to-br from-red-50 to-pink-50 border-4 border-red-400 rounded-3xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Mail className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-red-700">Caixa de Mensagens</h2>
              </div>
              <button
                onClick={onClose}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex flex-col md:flex-row gap-3 bg-white border-2 border-red-300 rounded-2xl p-4 shadow-md">
                <select
                  value={personId}
                  onChange={(e) => setPersonId(e.target.value)}
                  className="flex-1 p-3 border-2 border-red-300 rounded-xl focus:border-red-500 focus:outline-none bg-white"
                  required
                >
                  <option value="" disabled>Selecione uma pessoa...</option>
                  {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 w-full md:w-auto"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Buscar
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            <div className="overflow-y-auto max-h-96">
              {!hasSearched ? (
                <div className="text-center py-8">
                  <Mail className="w-16 h-16 text-red-300 mx-auto mb-4" />
                  <p className="text-red-600">Selecione uma pessoa para buscar as mensagens</p>
                </div>
              ) : messages.length === 0 && !isLoading ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-red-600">Nenhuma mensagem encontrada</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetSearch}
                    className="mt-4 text-red-500 hover:text-red-700 underline"
                  >
                    Fazer nova busca
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border-2 border-pink-300 rounded-2xl p-6 shadow-2xl hover:shadow-pink-400/60 transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute -top-4 -left-4 text-pink-200 text-6xl select-none pointer-events-none rotate-[-15deg]">💌</div>
                      <div className="absolute -bottom-4 -right-4 text-pink-100 text-5xl select-none pointer-events-none rotate-[10deg]">❤️</div>
                      {message.dataEnvio && (
                        <div className="flex items-center gap-1 text-xs text-pink-500 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(message.dataEnvio).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                      <div className="bg-gradient-to-r from-pink-100 to-red-100 rounded-xl p-4 border border-pink-200 flex flex-col items-center backdrop-brightness-95">
                        <p className="text-pink-700 leading-relaxed italic text-2xl text-center font-extrabold drop-shadow-md">
                          "{message.mensagem}"
                        </p>
                        <span className="block mt-4 text-pink-400 text-lg font-bold drop-shadow">Mensagem enviada com carinho 💖</span>
                        <span className="block mt-1 text-pink-300 text-base font-semibold">Que o amor esteja sempre presente! ✨</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300"
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

export default InboxModal;
