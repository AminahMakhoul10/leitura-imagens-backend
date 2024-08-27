import axios from 'axios';

const apiKey = process.env.GEMINI_API_KEY;

export async function analyzeImage(base64Image: string) {
  try {
    const response = await axios.post('https://gemini-api-url', {
      image: base64Image
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao analisar imagem:', error);
    throw new Error('Erro na integração com a API do Google Gemini');
  }
}
//instalar o axios npm i axios