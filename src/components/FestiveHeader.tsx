import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Mail, Lightbulb, Search, ThumbsUp } from 'lucide-react';

interface FestiveHeaderProps {
  onOpenSuggestions: () => void;
  onOpenInbox: () => void;
  onOpenRanking?: () => void; // Tornando opcional para mobile
  onOpenBaloes: () => void;
  onOpenVoteFlow: () => void;
}

const FestiveHeader: React.FC<FestiveHeaderProps> = ({ 
  onOpenSuggestions, 
  onOpenInbox, 
  onOpenRanking,
  onOpenBaloes,
  onOpenVoteFlow
}) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 p-6 rounded-b-3xl shadow-lg mb-8 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -10 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
            className={`absolute w-4 h-6 ${
              i % 4 === 0 ? 'bg-blue-500' :
              i % 4 === 1 ? 'bg-cyan-500' :
              i % 4 === 2 ? 'bg-indigo-500' : 'bg-purple-500'
            }`}
            style={{ 
              left: `${(i * 5)}%`,
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-4xl">🎓</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg flex items-center gap-3 justify-center">
            Correio Elegante Digital
            <img src="/71YIvBZnx0L.jpg" alt="Semana W" className="w-12 h-12 rounded-full border-2 border-cyan-400 object-cover shadow-md bg-white" />
          </h1>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <span className="text-4xl">🎉</span>
          </motion.div>
        </motion.div>
        
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-cyan-100 mb-6"
        >
          🎓 Semana W 2025 🎉
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-cyan-100 mb-6 max-w-2xl mx-auto"
        >
          Envie mensagens carinhosas para seus novos amigos nesta semana especial! 
          Espalhe alegria e boas-vindas na Semana W! 💌
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={onOpenSuggestions}
            className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <Lightbulb className="w-5 h-5" />
            Ver Sugestões
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={onOpenBaloes}
            className="bg-white text-green-600 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <span className="text-xl">🎈</span>
            Ver Mensagens
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            onClick={onOpenInbox}
            className="bg-white text-red-600 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <Mail className="w-5 h-5" />
            Minhas Mensagens
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            onClick={onOpenVoteFlow}
            className="bg-white text-pink-500 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <ThumbsUp className="w-5 h-5" />
            Votar
          </motion.button>

          {/* Botão Ranking só aparece em telas pequenas */}
          {onOpenRanking && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              onClick={onOpenRanking}
              className="bg-white text-yellow-600 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center md:hidden"
            >
              {/* Trophy importado do lucide-react */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8M12 17v4m-6-8V5a2 2 0 012-2h8a2 2 0 012 2v8a6 6 0 01-12 0z" /></svg>
              Ranking
            </motion.button>
          )}
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-4 left-4 text-2xl"
      >
        🎓
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute top-8 right-8 text-3xl"
      >
        🎉
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-4 left-8 text-2xl"
      >
        🌟
      </motion.div>
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
        className="absolute bottom-6 right-4 text-2xl"
      >
        🎊
      </motion.div>
    </div>
  );
};

export default FestiveHeader;
