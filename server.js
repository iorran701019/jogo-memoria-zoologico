const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve arquivos estáticos

// Banco de dados em memória
let scores = [];

// Rotas da API
app.get('/api/scores', (req, res) => {
  try {
    const topScores = [...scores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((score, index) => ({
        id: index + 1,
        player_name: score.player_name,
        score: score.score,
        date: score.date
      }));
    
    res.json(topScores);
  } catch (error) {
    console.error('Erro ao buscar scores:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar scores' });
  }
});

app.post('/api/scores', (req, res) => {
  try {
    const { playerName, score } = req.body;
    
    if (!playerName || score === undefined) {
      return res.status(400).json({ success: false, message: 'Dados incompletos' });
    }

    scores.push({
      player_name: playerName,
      score: score,
      date: new Date().toISOString()
    });
    
    res.json({ 
      success: true, 
      message: 'Score salvo com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao salvar score:', error);
    res.status(500).json({ success: false, message: 'Erro ao salvar score' });
  }
});

// Rota principal - Serve o jogo completo
app.get('/', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (error) {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Jogo da Memória - Erro</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #e74c3c; }
        </style>
      </head>
      <body>
        <h1>❌ Erro ao carregar o jogo</h1>
        <p>Arquivo index.html não encontrado</p>
        <p>Verifique se o arquivo foi commitado no GitHub</p>
      </body>
      </html>
    `);
  }
});

// Health check para o Render
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Inicia o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Jogo disponível em: http://localhost:${PORT}`);
  console.log(`📊 API de scores em: http://localhost:${PORT}/api/scores`);
});