import axios from 'axios';

const baseEnvUrl = import.meta.env.VITE_API_URL;
if (!baseEnvUrl) {
  throw new Error('VITE_API_URL não está definida!');
}
const baseURL = baseEnvUrl.replace(/\/$/, '') + '/api/correio';

const api = axios.create({
  baseURL,
  timeout: 10000,
});

export interface Person {
  id: number;
  name: string;
  urlFoto: string;
}

export interface Message {
  id: number;
  remetente: string;
  destinatario: string;
  mensagem: string;
  dataEnvio?: string;
}

export interface MessageRequest {
  remetente: string;
  destinatario: string;
  mensagem: string;
}

export interface Suggestion {
  id?: number;
  texto?: string;
  mensagem?: string;
}

// Buscar todas as mensagens recebidas
export interface ReceivedMessage {
  name: string;
  urlFoto: string;
  remetente: string;
  mensagem: string;
}

// Buscar pessoas disponíveis
export const fetchPeople = async (): Promise<Person[]> => {
  try {
    const response = await api.get('/pessoas');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pessoas:', error);
    throw new Error('Não foi possível carregar as pessoas disponíveis');
  }
};

// Enviar mensagem
export const sendMessage = async (messageData: MessageRequest): Promise<void> => {
  try {
    await api.post('/', messageData);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw new Error('Não foi possível enviar a mensagem');
  }
};

// Buscar sugestões
export const fetchSuggestions = async (): Promise<Suggestion[]> => {
  try {
    const response = await api.get('/sugestoes');
    let data = response.data;
    // Normalizar para garantir que cada sugestão tenha a propriedade 'texto'
    if (Array.isArray(data)) {
      data = data.map((s: any, idx: number) => ({
        id: s.id ?? idx,
        texto: s.texto ?? s.mensagem ?? '',
      }));
    }
    // Se não houver sugestões, retorna sugestões engraçadas
    if (!data || data.length === 0) {
      data = [
        { texto: 'Se eu fosse um correio elegante, te entregava flores todo dia!' },
        { texto: 'Você não é fogueira, mas fez meu coração pular!' },
        { texto: 'Se São João visse esse sorriso, mandava até mais balão!' },
        { texto: 'Queria ser milho pra virar pamonha e te conquistar no arraial.' },
        { texto: 'Se beleza fosse festa junina, você era o forró a noite toda!' },
        { texto: 'Me chama de quadrilha e me deixa dançar do seu lado!' },
        { texto: 'Você é o quentão que faltava no meu inverno.' },
        { texto: 'Se eu fosse balão, queria voar só pra te ver sorrir.' },
        { texto: 'Topa ser meu par na quadrilha do coração?' },
        { texto: 'Cuidado: risco de se apaixonar nesse arraiá!' },
        { texto: 'Se eu fosse bandeirinha, queria enfeitar seu caminho.' },
        { texto: 'Você é mais doce que canjica!' },
        { texto: 'Se eu fosse correio elegante, só entregava mensagem pra você.' },
        { texto: 'Me chama de fogueira e deixa eu te esquentar!' },
        { texto: 'Você é o xote do meu coração.' },
        { texto: 'Se eu fosse chapéu, queria estar na sua cabeça o tempo todo.' },
        { texto: 'Você é o prêmio da pescaria do meu coração.' },
        { texto: 'Se eu fosse paçoca, queria derreter na sua boca.' },
        { texto: 'Me chama de bandeirinha e deixa eu colorir sua vida.' },
        { texto: 'Você é o balão mais bonito desse São João!' },
      ];
    }
    return data;
  } catch (error) {
    console.error('Erro ao buscar sugestões:', error);
    // Retorna sugestões engraçadas caso a API falhe
    return [
      { texto: 'Se eu fosse um correio elegante, te entregava flores todo dia!' },
      { texto: 'Você não é fogueira, mas fez meu coração pular!' },
      { texto: 'Se São João visse esse sorriso, mandava até mais balão!' },
      { texto: 'Queria ser milho pra virar pamonha e te conquistar no arraial.' },
      { texto: 'Se beleza fosse festa junina, você era o forró a noite toda!' },
      { texto: 'Me chama de quadrilha e me deixa dançar do seu lado!' },
      { texto: 'Você é o quentão que faltava no meu inverno.' },
      { texto: 'Se eu fosse balão, queria voar só pra te ver sorrir.' },
      { texto: 'Topa ser meu par na quadrilha do coração?' },
      { texto: 'Cuidado: risco de se apaixonar nesse arraiá!' },
      { texto: 'Se eu fosse bandeirinha, queria enfeitar seu caminho.' },
      { texto: 'Você é mais doce que canjica!' },
      { texto: 'Se eu fosse correio elegante, só entregava mensagem pra você.' },
      { texto: 'Me chama de fogueira e deixa eu te esquentar!' },
      { texto: 'Você é o xote do meu coração.' },
      { texto: 'Se eu fosse chapéu, queria estar na sua cabeça o tempo todo.' },
      { texto: 'Você é o prêmio da pescaria do meu coração.' },
      { texto: 'Se eu fosse paçoca, queria derreter na sua boca.' },
      { texto: 'Me chama de bandeirinha e deixa eu colorir sua vida.' },
      { texto: 'Você é o balão mais bonito desse São João!' },
    ];
  }
};

// Buscar mensagens de uma pessoa
export const fetchMyMessages = async (id: number): Promise<Message[]> => {
  try {
    const response = await api.get(`/BuscaMinhasMensagens?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    throw new Error('Não foi possível carregar as mensagens');
  }
};

// Buscar todas as mensagens recebidas
export const fetchAllMessages = async (): Promise<ReceivedMessage[]> => {
  try {
    const response = await api.get('/BuscaTodasAsMensagens');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todas as mensagens:', error);
    throw new Error('Não foi possível carregar as mensagens recebidas');
  }
};

export default api;
