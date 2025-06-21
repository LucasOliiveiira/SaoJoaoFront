import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, X } from 'lucide-react';
import { fetchPeople, Person } from '../services/api';

interface IdentificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIdentify: (person: Person) => void;
}

const IdentificationModal: React.FC<IdentificationModalProps> = ({ isOpen, onClose, onIdentify }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchPeople().then(setPeople);
    }
  }, [isOpen]);

  const handleIdentify = () => {
    const person = people.find(p => p.id.toString() === selectedPersonId);
    if (person) {
      onIdentify(person);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[70]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <UserCheck className="w-12 h-12 mx-auto text-blue-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Quem está votando?</h2>
              <p className="text-gray-600 mb-4">Selecione seu nome para continuar.</p>
              
              {/* Aviso sobre anonimato */}
              <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700 text-center">
                  <strong>💡 Importante:</strong> Apenas o envio de mensagens é anônimo. 
                  Para votar, precisamos identificar quem está votando para evitar votos duplicados.
                </p>
              </div>
              
              <select
                value={selectedPersonId}
                onChange={(e) => setSelectedPersonId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-6"
              >
                <option value="" disabled>Selecione seu nome...</option>
                {people.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleIdentify}
                disabled={!selectedPersonId}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
              >
                Confirmar Identidade
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IdentificationModal; 