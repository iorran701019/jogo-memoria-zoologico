const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Banco de dados em memória (simples e funciona sem instalação)
let scores = [];

// Rotas da API
app.get('/api/scores', (req, res) => {
  try {
    // Ordena por score decrescente e pega top 10
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

    // Adiciona ao array em memória
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

// Rota principal
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Jogo da Memória do Zoológico</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px; 
                background: linear-gradient(135deg, #87CEEB 0%, #98FB98 100%);
            }
            h1 { color: #2c5530; }
            a {
                display: inline-block;
                margin: 20px;
                padding: 15px 30px;
                background: #28a745;
                color: white;
                text-decoration: none;
                border-radius: 10px;
                font-size: 1.2rem;
            }
            a:hover { background: #218838; }
        </style>
    </head>
    <body>
        <h1>🦁 Jogo da Memória do Zoológico 🐘</h1>
        <p>Servidor está funcionando perfeitamente!</p>
        <div>
            <a href="/api/scores">Ver Ranking API</a>
        </div>
    </body>
    </html>
  `);
});

// Health check para o Render
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Inicia o servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
});