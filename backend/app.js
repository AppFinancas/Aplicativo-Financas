const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const transacoesRoutes = require('./routes/transacoes');
const contasRoutes = require('./routes/contas');
const categoriasRoutes = require('./routes/categorias');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', healthRoutes);
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', transacoesRoutes);
app.use('/', contasRoutes);
app.use('/', categoriasRoutes);

module.exports = app;

