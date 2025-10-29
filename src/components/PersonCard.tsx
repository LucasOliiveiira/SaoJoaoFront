import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail } from 'lucide-react';
import { Person } from '../services/api';

interface PersonCardProps {
  person: Person;
  onSendMessage: (person: Person) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onSendMessage }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-blue-100 to-cyan-100 border-4 border-blue-400 rounded-3xl p-6 shadow-lg hover:shadow-xl transform transition-all duration-300"
    >
      <div className="text-center">
        <div className="relative mb-4 flex justify-center">
          <img
            src={person.urlFoto && person.urlFoto.trim() !== '' ? person.urlFoto : '/71YIvBZnx0L.jpg'}
            alt={person.name}
            className="w-24 h-24 rounded-full border-4 object-cover shadow-lg"
            onError={e => {
              const target = e.currentTarget;
              if (target.src.indexOf('/71YIvBZnx0L.jpg') === -1) {
                target.src = '/71YIvBZnx0L.jpg';
              }
            }}
          />
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="absolute -top-1 -right-1"
          >
            <Heart className="w-6 h-6 text-blue-500 fill-blue-500" />
          </motion.div>
        </div>
        
        <h3 className="text-xl font-bold text-blue-700 mb-3 font-cursive">
          {person.name}
        </h3>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSendMessage(person)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
        >
          <Mail className="w-4 h-4" />
          Enviar Mensagem
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PersonCard;
