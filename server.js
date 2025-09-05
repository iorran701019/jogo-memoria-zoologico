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
app.get('/api/scores', (req, res) => {
  try {
    const scores = db.prepare('SELECT * FROM scores ORDER BY score DESC LIMIT 10').all();
    res.json(scores);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar scores' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});