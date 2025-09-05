const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors'); // Importante para o front-end se comunicar com o back-end

const app = express();
const port = 3000;

// Middleware para permitir requisições do navegador
app.use(cors());
// Middleware para entender dados JSON
app.use(express.json());

// Conecta ao banco de dados SQLite (cria se não existir)
const db = new Database('scores.db');

// Cria a tabela de scores se ela não existir
const createTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT,
    score INTEGER,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
createTable.run();

// Rota para receber um novo score
app.post('/api/scores', (req, res) => {
  try {
    const { playerName, score } = req.body;

    const insert = db.prepare('INSERT INTO scores (player_name, score) VALUES (?, ?)');
    const result = insert.run(playerName, score);

    res.json({ 
      success: true, 
      message: 'Score salvo com sucesso!',
      id: result.lastInsertRowid 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao salvar score' });
  }
});

// Rota para buscar os top 10 scores
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
                <a href="https://seujogo.netlify.app">Jogar Agora</a>
            </div>
        </body>
        </html>
    `);
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;

// Isso é crucial para o Render!
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});;