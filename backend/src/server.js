import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import conexao from "./config/database.js";
import usuariosRoutes from "./routes/usuarios.js";
import loginRoutes from "./routes/login.js";
import animaisRoutes from "./routes/animais.js";  
import pedidosRoutes from "./routes/pedidos.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API do Pet Match funcionando.",
  });
});

app.get("/api/teste-banco", async (req, res) => {
  try {
    await conexao.query("SELECT 1");

    res.json({
      mensagem: "Conexão com o banco funcionando.",
    });
  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      mensagem: "Erro ao conectar com o banco.",
    });
  }
});

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/animais", animaisRoutes);
app.use("/api/pedidos", pedidosRoutes);

const PORTA = process.env.PORT || 3001;

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}` );
});