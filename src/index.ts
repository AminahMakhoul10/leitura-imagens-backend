import express from 'express';
import { analyzeImage } from './geminiService';

const app = express();
app.use(express.json());


app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

app.post('/upload', async (req, res) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  if (typeof image !== 'string' || !/^data:image\/[a-z]+;base64,/.test(image)) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Imagem inválida, deve estar em formato base64'
    });
  }

  if (typeof customer_code !== 'string' || customer_code.trim() === '') {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Código do cliente inválido'
    });
  }

  if (isNaN(Date.parse(measure_datetime))) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Data de medição inválida'
    });
  }

  if (!['WATER', 'GAS'].includes(measure_type)) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Tipo de medição inválido, deve ser WATER ou GAS'
    });
  }

  try {
    const analysisResult = await analyzeImage(image);
    const alreadyExists = false; 
    if (alreadyExists) {
      return res.status(409).json({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada'
      });
    }

    res.status(200).json({
      image_url: analysisResult.image_url,
      measure_value: analysisResult.measure_value,
      measure_uuid: analysisResult.measure_uuid
    });
  } catch (error) {
    res.status(500).json({
      error_code: 'INTERNAL_ERROR',
      error_description: 'Erro ao processar a imagem'
    });
  }
});
