import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchPeople, Person, fetchAllMessages, ReceivedMessage, fetchLastMessage, markMessageAsRead, LastMessage, voteOnMessage, VotoRequest } from '../services/api';
import PersonCard from '../components/PersonCard';
import SendModal from '../components/SendModal';
import SuggestionsModal from '../components/SuggestionsModal';
import InboxModal from '../components/InboxModal';
import FestiveHeader from '../components/FestiveHeader';
import { useToast } from '../hooks/use-toast';
import { RefreshCw, Trophy, Crown } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../components/ui/drawer';
import ReactConfetti from 'react-confetti';
import NewMessageNotification from '../components/NewMessageNotification';
import PopularMessagesModal from '../components/PopularMessagesModal';
import LikeModal from '../components/LikeModal';
import IdentificationModal from '../components/IdentificationModal';

const CARDS_PER_PAGE_DESKTOP = 10;
const CARDS_PER_PAGE_TABLET = 6;
const CARDS_PER_PAGE_MOBILE = 2;
const AUTO_SCROLL_INTERVAL = 9000; // 8 segundos
const AUTO_REFRESH_INTERVAL = 10000; // 10 segundos

const BalaoCard = ({ balão, likesCount = 0 }) => {
  const [imgError, setImgError] = useState(false);
  const fotoSrc = !balão.urlFoto || balão.urlFoto.trim() === '' || imgError ? '/71YIvBZnx0L.jpg' : balão.urlFoto;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative z-20 flex h-full w-full"
    >
      <div className="relative flex w-full flex-col items-center rounded-3xl border-4 border-blue-400 bg-white/90 p-3 pt-8 shadow-2xl animate-float">
        <div className="relative mb-2 shrink-0">
          <img
            src={fotoSrc}
            alt={balão.name}
            className="w-12 h-12 rounded-full border-4 border-cyan-300 object-cover shadow-lg sm:w-16 sm:h-16"
            onError={() => setImgError(true)}
          />
        </div>
        <div className="mb-1 w-full break-words px-2 text-center text-sm font-extrabold text-blue-700 drop-shadow sm:text-lg">
          {balão.name}
        </div>
        <div className="mb-2 w-full break-words px-2 text-center text-xs italic text-blue-600 sm:text-sm">
          Recebeu uma mensagem de <span className="font-bold">{balão.remetente}</span>
        </div>
        <div className="mt-auto flex w-full flex-grow items-center justify-center rounded-xl border border-blue-200 bg-gradient-to-r from-blue-100 to-cyan-100 p-2 text-center text-sm font-bold text-blue-800 shadow min-h-[80px] sm:p-3 sm:text-lg">
          <p className="w-full break-words">"{balão.mensagem}"</p>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs sm:text-sm text-blue-600 font-semibold">
          <span className="text-blue-500">❤️</span>
          <span>{balão.likesCount || 0} {(balão.likesCount || 0) === 1 ? 'voto' : 'votos'}</span>
        </div>
      </div>
    </motion.div>
  );
};

const Index = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isSuggestionsModalOpen, setIsSuggestionsModalOpen] = useState(false);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const { toast } = useToast();
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [ranking, setRanking] = useState<any[]>([]);
  const [isRankingLoading, setIsRankingLoading] = useState(false);
  const [showBaloes, setShowBaloes] = useState(false);
  const [baloes, setBaloes] = useState<ReceivedMessage[]>([]);
  const [isBaloesLoading, setIsBaloesLoading] = useState(false);
  const [carouselPage, setCarouselPage] = useState(0);
  const carouselInterval = useRef<NodeJS.Timeout | null>(null);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);
  const [cardsPerPage, setCardsPerPage] = useState(CARDS_PER_PAGE_DESKTOP);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [lastMessage, setLastMessage] = useState<LastMessage | null>(null);
  const [isPopularModalOpen, setIsPopularModalOpen] = useState(false);
  const [isLikeModalOpen, setIsLikeModalOpen] = useState(false);
  const [isIdentificationModalOpen, setIsIdentificationModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Person | null>(null);

  useEffect(() => {
    loadPeople();
  }, []);

  // Busca a última mensagem periodicamente
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const message = await fetchLastMessage();
        setLastMessage(currentMessage => {
          if (message && !message.lida && message.id !== currentMessage?.id) {
            return message;
          }
          return currentMessage;
        });
      } catch (error) {
        console.error('Erro ao verificar novas mensagens:', error);
      }
    }, 5000); // Verifica a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const handleCloseNotification = useCallback(async () => {
    if (lastMessage) {
      try {
        await markMessageAsRead(lastMessage.id);
      } catch (error) {
        console.error('Falha ao marcar mensagem como lida', error);
      } finally {
        setLastMessage(null);
      }
    }
  }, [lastMessage]);

  // Função para definir quantos cards por página de acordo com o tamanho da tela
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setCardsPerPage(CARDS_PER_PAGE_MOBILE);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(CARDS_PER_PAGE_TABLET);
      } else {
        setCardsPerPage(CARDS_PER_PAGE_DESKTOP);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadPeople = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPeople();
      setPeople(data);
    } catch (error) {
      toast({
        title: "😔 Erro ao carregar",
        description: "Não foi possível carregar as pessoas. Verifique se a API está funcionando.",
        variant: "destructive",
      });
      console.error('Erro ao carregar pessoas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (person: Person) => {
    setSelectedPerson(person);
    setIsSendModalOpen(true);
  };

  const closeSendModal = () => {
    setIsSendModalOpen(false);
    setSelectedPerson(null);
  };

  const fetchRanking = async () => {
    setIsRankingLoading(true);
    try {
      const baseEnvUrl = import.meta.env.VITE_API_URL;
      if (!baseEnvUrl) throw new Error('VITE_API_URL não está definida!');
      const url = baseEnvUrl.replace(/\/$/, '') + '/api/correio/ranking';
      const res = await fetch(url);
      const data = await res.json();
      setRanking(data.pessoas || []);
    } catch (e) {
      toast({
        title: 'Erro ao buscar ranking',
        description: 'Não foi possível carregar o ranking.',
        variant: 'destructive',
      });
    } finally {
      setIsRankingLoading(false);
    }
  };

  const openBaloes = async () => {
    setIsBaloesLoading(true);
    setShowBaloes(true);
    try {
      const data = await fetchAllMessages();
      setBaloes(data);
      // Limpa as notificações antigas e reseta o set de ids ao abrir
      // notifiedMessageIds.current.clear(); // This line is removed as notifiedMessageIds is removed
      // data.forEach(msg => { // This block is removed as notifiedMessageIds is removed
      //   const uniqueId = `${msg.remetente}-${msg.name}-${msg.mensagem}`;
      //   notifiedMessageIds.current.add(uniqueId);
      // });
    } catch (e) {
      toast({
        title: 'Erro ao buscar mensagens',
        description: 'Não foi possível carregar as mensagens recebidas.',
        variant: 'destructive',
      });
    } finally {
      setIsBaloesLoading(false);
    }
  };

  // Atualização automática dos balões
  useEffect(() => {
    if (!showBaloes) return;
    // Atualiza as mensagens periodicamente
    async function fetchBaloes() {
      try {
        const data = await fetchAllMessages();

        // Detectar novas mensagens
        // const newMessages = data.filter(msg => { // This block is removed as notifiedMessageIds is removed
        //     const uniqueId = `${msg.remetente}-${msg.name}-${msg.mensagem}`;
        //     return !notifiedMessageIds.current.has(uniqueId);
        // });

        // if (newMessages.length > 0) { // This block is removed as notifiedMessageIds is removed
        //   audioRef.current?.play();
        //   newMessages.forEach(msg => {
        //     const uniqueId = `${msg.remetente}-${msg.name}-${msg.mensagem}`;
        //     sonnerToast.custom((t) => <NewMessageToast message={msg} toastId={t} />, {
        //       duration: 5000,
        //     });
        //     notifiedMessageIds.current.add(uniqueId);
        //   });
        // }

        setBaloes(data);
      } catch (e) {
        // erro já tratado
      }
    }
    fetchBaloes();
    refreshInterval.current = setInterval(fetchBaloes, AUTO_REFRESH_INTERVAL);
    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, [showBaloes]);

  // Carrossel automático
  useEffect(() => {
    if (!showBaloes) return;
    if (baloes.length <= cardsPerPage) {
      setCarouselPage(0);
      return;
    }
    carouselInterval.current = setInterval(() => {
      setCarouselPage((prev) => {
        const maxPage = Math.ceil(baloes.length / cardsPerPage) - 1;
        return prev >= maxPage ? 0 : prev + 1;
      });
    }, AUTO_SCROLL_INTERVAL);
    return () => {
      if (carouselInterval.current) clearInterval(carouselInterval.current);
    };
  }, [showBaloes, baloes, cardsPerPage]);

  // Resetar carrossel ao abrir/fechar
  useEffect(() => {
    if (!showBaloes) setCarouselPage(0);
  }, [showBaloes]);

  const recipientForLastMessage = people.find(p => p.name === lastMessage?.destinatario);

  const openVoteFlow = () => {
    if (currentUser) {
      setIsLikeModalOpen(true);
    } else {
      setIsIdentificationModalOpen(true);
    }
  };

  const handleIdentify = (person: Person) => {
    setCurrentUser(person);
    setIsIdentificationModalOpen(false);
    setIsLikeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-50 to-indigo-100 relative overflow-hidden">
      <audio ref={audioRef} src="/45_0HW2p0x.mp3" preload="auto" />

      <AnimatePresence>
        {lastMessage && (
          <NewMessageNotification
            message={lastMessage}
            recipient={recipientForLastMessage}
            onClose={handleCloseNotification}
            audioRef={audioRef}
          />
        )}
      </AnimatePresence>

      {/* Botão lateral para ranking */}
      <button
        onClick={() => {
          setIsRankingOpen(true);
          fetchRanking();
        }}
        className="fixed top-1/2 right-0 z-50 bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 text-white px-8 py-5 rounded-l-3xl shadow-2xl border-4 border-cyan-300 flex items-center gap-4 hover:from-blue-500 hover:to-cyan-600 transition-all animate-pulse ring-4 ring-blue-200 ring-offset-2 scale-110 hidden md:flex"
        style={{ transform: 'translateY(-50%)', boxShadow: '0 0 32px 8px #60a5fa, 0 0 64px 16px #06b6d4' }}
      >
        <Trophy className="w-10 h-10 drop-shadow-lg animate-bounce text-cyan-100" />
        <span className="text-2xl font-extrabold tracking-wider drop-shadow-lg">Mais Populares</span>
      </button>

      {/* Botão para Mensagens Populares */}
      <button
        onClick={() => setIsPopularModalOpen(true)}
        className="fixed top-1/2 right-0 z-50 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white px-8 py-5 rounded-l-3xl shadow-2xl border-4 border-blue-300 flex items-center gap-4 hover:from-blue-600 hover:to-purple-700 transition-all animate-pulse ring-4 ring-blue-200 ring-offset-2 scale-110 hidden md:flex"
        style={{ transform: 'translateY(calc(-50% + 80px))', boxShadow: '0 0 32px 8px #60a5fa, 0 0 64px 16px #a78bfa' }}
      >
        <Crown className="w-10 h-10 drop-shadow-lg animate-bounce text-yellow-300" />
        <span className="text-2xl font-extrabold tracking-wider drop-shadow-lg">Votação</span>
      </button>
      
      {/* Drawer do Ranking de Popularidade */}
      <Drawer open={isRankingOpen} onOpenChange={setIsRankingOpen}>
        <DrawerContent className="bg-gradient-to-br from-blue-50 via-cyan-100 to-indigo-50 border-4 border-blue-300 shadow-2xl md:block">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-4 text-4xl text-blue-700 font-extrabold justify-center drop-shadow-lg">
              <Trophy className="w-12 h-12 text-blue-400 animate-pulse drop-shadow-lg" />
              Ranking de Mensagens Recebidas
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {isRankingLoading ? (
              <div className="text-center py-8 text-blue-600">Carregando ranking...</div>
            ) : ranking.length === 0 ? (
              <div className="text-center py-8 text-blue-600">Nenhum dado de ranking encontrado.</div>
            ) : (
              (() => {
                // Calcular os valores máximos para empates
                const counts = ranking.map(p => p.mensagemCount);
                const uniqueSorted = Array.from(new Set(counts)).sort((a, b) => b - a);
                const top1 = uniqueSorted[0];
                const top2 = uniqueSorted[1];
                const top3 = uniqueSorted[2];
                return (
                  <ul className="space-y-6">
                    {ranking.map((pessoa, idx) => {
                      let destaque = '';
                      let medalha = null;
                      let borderImg = 'border-cyan-200';
                      if (pessoa.mensagemCount === 0) {
                        destaque = 'border-gray-300 bg-gray-50 opacity-70';
                      } else if (pessoa.mensagemCount === top1) {
                        destaque = 'border-blue-400 bg-blue-100 scale-105 ring-4 ring-blue-200';
                        medalha = '🥇';
                        borderImg = 'border-blue-400';
                      } else if (pessoa.mensagemCount === top2) {
                        destaque = 'border-cyan-300 bg-cyan-50 scale-100 ring-2 ring-cyan-200';
                        medalha = '🥈';
                        borderImg = 'border-cyan-300';
                      } else if (pessoa.mensagemCount === top3) {
                        destaque = 'border-indigo-300 bg-indigo-50 scale-100 ring-2 ring-indigo-200';
                        medalha = '🥉';
                        borderImg = 'border-indigo-300';
                      }
                      return (
                        <li
                          key={pessoa.nome}
                          className={`flex items-center gap-6 p-6 rounded-2xl border-4 shadow-xl transition-all duration-300 ${destaque}`}
                        >
                          <div className="relative">
                            <img
                              src={pessoa.foto}
                              alt={pessoa.nome}
                              className={`w-20 h-20 rounded-full border-4 ${borderImg} object-cover shadow-lg`}
                              onError={e => (e.currentTarget.src = '/71YIvBZnx0L.jpg')}
                            />
                            {medalha && (
                              <span className={`absolute -top-3 -right-3 ${medalha === '🥇' ? 'bg-blue-400' : medalha === '🥈' ? 'bg-cyan-300' : 'bg-indigo-300'} text-white rounded-full px-3 py-1 text-lg font-extrabold shadow-lg`}>{medalha}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-extrabold text-blue-700 drop-shadow-lg">{pessoa.nome}</span>
                              {medalha === '🥇' && <Trophy className="w-7 h-7 text-blue-500 drop-shadow-lg" />}
                              {pessoa.mensagemCount === 0 && <span className="text-lg text-gray-400">Sem mensagens</span>}
                            </div>
                            <div className="text-lg text-gray-700 font-bold mt-1">Mensagens recebidas: <span className="text-blue-600">{pessoa.mensagemCount}</span></div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                );
              })()
            )}
          </div>
          {ranking.length > 0 && ranking[0]?.mensagemCount > 0 && (
            <ReactConfetti numberOfPieces={200} recycle={false} width={window.innerWidth} height={300} className="pointer-events-none" />
          )}
        </DrawerContent>
      </Drawer>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-cyan-400 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-400 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-18 h-18 bg-purple-400 rounded-full"></div>
      </div>

      <div className="relative z-10">
        <FestiveHeader
          onOpenSuggestions={() => setIsSuggestionsModalOpen(true)}
          onOpenInbox={() => setIsInboxModalOpen(true)}
          onOpenRanking={() => setIsPopularModalOpen(true)}
          onOpenBaloes={openBaloes}
          onOpenVoteFlow={openVoteFlow}
        />

        <div className="container mx-auto px-4 pb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl font-bold text-blue-700 mb-4">
              👥 Pessoas Disponíveis para Receber Mensagens
            </h3>
            <p className="text-blue-600 mb-6">
              Clique em uma pessoa para enviar uma mensagem carinhosa!
            </p>
            
            {people.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={loadPeople}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 mx-auto mb-6"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar Lista
              </motion.button>
            )}
          </motion.div>

          {isLoading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-blue-600 text-lg">Carregando pessoas...</p>
            </div>
          ) : people.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">😔</div>
              <p className="text-blue-600 text-lg mb-4">
                Nenhuma pessoa disponível no momento
              </p>
              <p className="text-blue-500 text-sm mb-6">
                Verifique se a API está rodando em http://localhost:5046
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={loadPeople}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              >
                Tentar Novamente
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {people.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PersonCard
                    person={person}
                    onSendMessage={handleSendMessage}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/*
          <div className="flex flex-col sm:flex-row sm:justify-center items-stretch sm:items-center gap-4 mb-8 mt-8 md:mt-0">
            <button
              onClick={openBaloes}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full font-extrabold text-xl shadow-xl border-4 border-blue-300 flex items-center justify-center gap-3 hover:from-blue-600 hover:to-blue-800 transition-all sm:animate-bounce w-full sm:w-auto"
            >
              <span className="text-2xl">🎈</span> Ver Mensagens
            </button>
            <button
              onClick={openVoteFlow}
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-full font-extrabold text-xl shadow-xl border-4 border-pink-300 flex items-center justify-center gap-3 hover:from-pink-600 hover:to-red-600 transition-all w-full sm:w-auto"
            >
              <ThumbsUp className="w-7 h-7" /> Votar
            </button>
          </div>
          */}
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-6 mt-12"
        >
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg font-medium mb-2">
              🎓 Semana W 2025 - Correio Elegante Digital 🎉
            </p>
            <p className="text-cyan-100">
              Espalhe amor e alegria nesta semana especial! ❤️
            </p>
          </div>
        </motion.footer>
      </div>

      {/* Modais */}
      <SendModal
        isOpen={isSendModalOpen}
        onClose={closeSendModal}
        recipient={selectedPerson}
      />

      <SuggestionsModal
        isOpen={isSuggestionsModalOpen}
        onClose={() => setIsSuggestionsModalOpen(false)}
      />

      <InboxModal
        isOpen={isInboxModalOpen}
        onClose={() => setIsInboxModalOpen(false)}
      />

      <PopularMessagesModal 
        isOpen={isPopularModalOpen}
        onClose={() => setIsPopularModalOpen(false)}
      />

      <IdentificationModal
        isOpen={isIdentificationModalOpen}
        onClose={() => setIsIdentificationModalOpen(false)}
        onIdentify={handleIdentify}
      />

      <LikeModal
        isOpen={isLikeModalOpen}
        onClose={() => setIsLikeModalOpen(false)}
        currentUser={currentUser}
      />

      {showBaloes && (
        <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-100 via-cyan-100 to-indigo-200 bg-opacity-95 z-50 flex justify-center items-center overflow-auto p-2">
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Elementos animados de fundo */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 90}%`,
                  top: `${Math.random() * 90}%`,
                  zIndex: 1,
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50, 0],
                  x: [0, Math.random() * 100 - 50, 0],
                  rotate: [0, Math.random() * 30 - 15, 0],
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              >
                <span className="text-5xl select-none">
                  {['🎉','🎓','🎊','💙','🌟','✨','🎈','💫','🎯','🚀','🌈','⭐'][i % 12]}
                </span>
              </motion.div>
            ))}
          </div>
          <button
            onClick={() => setShowBaloes(false)}
            className="fixed top-4 right-4 z-50 text-blue-600 hover:text-blue-800 transition-colors bg-white/80 rounded-full p-3 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full max-w-7xl max-h-[95vh] bg-white/70 rounded-2xl shadow-2xl p-1 sm:p-2 overflow-auto flex flex-col items-center justify-center">
            {isBaloesLoading ? (
              <div className="flex items-center justify-center h-full text-3xl text-blue-600 font-bold animate-pulse">
                Carregando mensagens...
              </div>
            ) : baloes.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <div className="text-8xl mb-4">💌</div>
                  <p className="text-2xl text-blue-600 font-bold mb-2">Nenhuma mensagem recebida ainda</p>
                  <p className="text-blue-500">Seja o primeiro a enviar uma mensagem!</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 p-2 sm:p-4 w-full">
                {baloes.slice(carouselPage * cardsPerPage, (carouselPage + 1) * cardsPerPage).map((msg, idx) => (
                  <BalaoCard key={idx} balão={msg} likesCount={msg.likesCount} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
