import express from "express";
import bcrypt from "bcryptjs";
import conexao from "../config/database.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "Informe o e-mail e a senha.",
      });
    }

    const [usuarios] = await conexao.query(
      `SELECT id, nome, email, telefone, senha_hash, tipo_perfil
       FROM usuarios
       WHERE email = ?`,
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        mensagem: "E-mail ou senha inválidos.",
      });
    }

    const usuario = usuarios[0];

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha_hash
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: "E-mail ou senha inválidos.",
      });
    }

    return res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        tipo_perfil: usuario.tipo_perfil,
      },
    });
  } catch (erro) {
    console.error("Erro ao realizar login:", erro);

    return res.status(500).json({
      mensagem: "Erro ao realizar login.",
    });
  }
});

export default router;