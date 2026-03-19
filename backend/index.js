require('dotenv').config();

const app = require('./app');

// ✅ Listen sempre por último
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});