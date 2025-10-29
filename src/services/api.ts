import axios from 'axios';

const baseEnvUrl = import.meta.env.VITE_API_URL;
if (!baseEnvUrl) {
  throw new Error('VITE_API_URL não está definida!');
}
const baseURL = baseEnvUrl.replace(/\/$/, '') + '/api/correio';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    console.log('Requisição:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });
    return Promise.reject(error);
  }
);

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
  id?: number;
  remetente: string;
  destinatario: string;
  mensagem: string;
  lida?: boolean;
  dataEnvio?: string;
  wlsPessoasId?: number;
  likesCount?: number;
  lerComVoz?: boolean;
  tipoVoz?: 'female' | 'male';
}

export interface LastMessage {
  id: number;
  remetente: string;
  destinatario: string;
  conteudo: string;
  dataEnvio: string;
  lida: boolean;
  lerComVoz?: boolean;
  tipoVoz?: 'female' | 'male';
}

export interface TopMessage {
  id: number;
  remetente: string;
  destinatario: string;
  mensagem: string;
  dataEnvio: string;
  likesCount: number;
}

export interface LikeRequest {
  mensagemId: number;
  wlsPessoaId: number;
}

export interface Suggestion {
  id?: number;
  texto?: string;
  mensagem?: string;
}

export interface VotoRequest {
  usuarioId: number;
  mensagemId: number;
}

// Buscar todas as mensagens recebidas
export interface ReceivedMessage {
  id: number; // Este é o ID da pessoa (destinatário)
  name: string;
  urlFoto: string;
  remetente: string;
  mensagem: string;
  mensagemId: number; // Este é o verdadeiro ID da mensagem
  likesCount?: number; // Contagem de likes da mensagem
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
    const payload = {
      id: 0,
      remetente: messageData.remetente,
      destinatario: messageData.destinatario,
      mensagem: messageData.mensagem,
      lida: false,
      dataEnvio: new Date().toISOString(),
      wlsPessoasId: 0,
      likesCount: 0,
      lerComVoz: messageData.lerComVoz !== undefined ? messageData.lerComVoz : true,
      tipoVoz: messageData.tipoVoz || 'female'
    };
    
    console.log('📤 Payload sendo enviado:', payload);
    console.log('📤 Dados originais recebidos:', messageData);
    const response = await api.post('', payload, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('Mensagem enviada com sucesso:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao enviar mensagem:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Dados inválidos. Verifique os campos e tente novamente.');
      } else if (error.response?.status === 500) {
        throw new Error('Erro no servidor. Tente novamente mais tarde.');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Erro de conexão. Verifique se a API está rodando.');
      }
    }
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
    const messagesResponse = await api.get('/BuscaTodasAsMensagens');
    const messages = messagesResponse.data;
    
    try {
      // Tentar buscar mensagens populares para obter likes
      const popularResponse = await api.get('/mensagens-populares');
      const popularMessages = popularResponse.data;
      
      // Criar um mapa de mensagemId -> likesCount
      const likesMap = new Map();
      popularMessages.forEach((popularMsg: TopMessage) => {
        likesMap.set(popularMsg.id, popularMsg.likesCount);
      });
      
      // Adicionar likesCount a cada mensagem
      const messagesWithLikes = messages.map((msg: ReceivedMessage) => ({
        ...msg,
        likesCount: likesMap.get(msg.mensagemId) || 0
      }));
      
      return messagesWithLikes;
    } catch (popularError) {
      // Se falhar ao buscar mensagens populares, retorna mensagens sem likes
      console.warn('Erro ao buscar mensagens populares, retornando mensagens sem likes:', popularError);
      return messages.map((msg: ReceivedMessage) => ({
        ...msg,
        likesCount: 0
      }));
    }
  } catch (error) {
    console.error('Erro ao buscar todas as mensagens:', error);
    throw new Error('Não foi possível carregar as mensagens recebidas');
  }
};

// Buscar a última mensagem
export const fetchLastMessage = async (): Promise<LastMessage | null> => {
  try {
    const response = await api.get('/ultima-mensagem');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error('Erro ao buscar a última mensagem:', error);
    throw new Error('Não foi possível buscar a última mensagem');
  }
};

// Marcar mensagem como lida
export const markMessageAsRead = async (messageId: number): Promise<void> => {
  try {
    await api.post('/mensagem-lida', messageId, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Erro ao marcar mensagem como lida:', error);
    throw new Error('Não foi possível marcar a mensagem como lida');
  }
};

// Buscar as 10 mensagens mais curtidas
export const fetchTop10Messages = async (): Promise<TopMessage[]> => {
  try {
    const response = await api.get('/top-10-mensagens');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar o top 10 de mensagens:', error);
    throw new Error('Não foi possível carregar o top 10 de mensagens');
  }
};

// Curtir uma mensagem
export const likeMessage = async (request: LikeRequest): Promise<void> => {
  try {
    await api.post('/curtir-mensagem', request);
  } catch (error) {
    console.error('Erro ao curtir mensagem:', error);
    throw new Error('Não foi possível registrar o like');
  }
};

// Buscar as mensagens mais populares
export const fetchPopularMessages = async (): Promise<TopMessage[]> => {
  try {
    const response = await api.get('/mensagens-populares');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar mensagens populares:', error);
    throw new Error('Não foi possível carregar as mensagens populares');
  }
};

// Votar em uma mensagem (agora aceita votação anônima)
export const voteOnMessage = async (request: VotoRequest): Promise<void> => {
  try {
    await api.post('/votar', request);
  } catch (error) {
    console.error('Erro ao votar na mensagem:', error);
    // Adiciona uma verificação para o erro de voto duplicado
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw new Error('Você já votou nesta mensagem.');
    }
    throw new Error('Não foi possível registrar o voto');
  }
};

export default api;
