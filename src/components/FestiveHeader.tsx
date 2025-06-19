import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Mail, Lightbulb, Search } from 'lucide-react';

interface FestiveHeaderProps {
  onOpenSuggestions: () => void;
  onOpenInbox: () => void;
}

const FestiveHeader: React.FC<FestiveHeaderProps> = ({ onOpenSuggestions, onOpenInbox }) => {
  return (
    <div className="relative bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 p-6 rounded-b-3xl shadow-lg mb-8 overflow-hidden">
      {/* Bandeirinhas animadas */}
      <div className="absolute top-0 left-0 right-0 h-2">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -10 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
            className={`absolute w-4 h-6 ${
              i % 4 === 0 ? 'bg-red-500' :
              i % 4 === 1 ? 'bg-yellow-500' :
              i % 4 === 2 ? 'bg-green-500' : 'bg-blue-500'
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
            <Flame className="w-8 h-8 text-orange-200 fill-orange-300" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg flex items-center gap-3 justify-center">
            Correio Elegante Digital
            <img src="/71YIvBZnx0L.jpg" alt="Festa Junina" className="w-12 h-12 rounded-full border-2 border-yellow-400 object-cover shadow-md bg-white" />
          </h1>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <Flame className="w-8 h-8 text-orange-200 fill-orange-300" />
          </motion.div>
        </motion.div>
        
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-yellow-100 mb-6"
        >
          🎪 Arraia WLS 2025 🎪
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-yellow-100 mb-6 max-w-2xl mx-auto"
        >
          Envie mensagens carinhosas para seus amigos nesta festa junina! 
          Espalhe alegria e carinho neste São João especial! 💌
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            transition={{ delay: 0.9 }}
            onClick={onOpenInbox}
            className="bg-white text-red-600 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center"
          >
            <Search className="w-5 h-5" />
            Ver Mensagens
          </motion.button>
        </div>
      </div>

      {/* Elementos decorativos flutuantes */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-4 left-4 text-2xl"
      >
        🎈
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute top-8 right-8 text-3xl"
      >
        🎪
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-4 left-8 text-2xl"
      >
        🌽
      </motion.div>
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
        className="absolute bottom-6 right-4 text-2xl"
      >
        🎭
      </motion.div>
    </div>
  );
};

export default FestiveHeader;
