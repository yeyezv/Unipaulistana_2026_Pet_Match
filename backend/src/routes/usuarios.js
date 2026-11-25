import express from "express";
import bcrypt from "bcryptjs";
import conexao from "../config/database.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      nome,
      email,
      telefone,
      senha,
      tipo_perfil,
    } = req.body;

    if (
      !nome ||
      !email ||
      !telefone ||
      !senha ||
      !tipo_perfil
    ) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos.",
      });
    }

    if (
      tipo_perfil !== "adotante" &&
      tipo_perfil !== "doador"
    ) {
      return res.status(400).json({
        mensagem: "Tipo de perfil inválido.",
      });
    }

    const [usuarioExistente] = await conexao.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (usuarioExistente.length > 0) {
      return res.status(400).json({
        mensagem: "Este e-mail já está cadastrado.",
      });
    }

    const senhaProtegida = await bcrypt.hash(senha, 10);

    const [resultado] = await conexao.query(
      `INSERT INTO usuarios
      (nome, email, telefone, senha_hash, tipo_perfil)
      VALUES (?, ?, ?, ?, ?)`,
      [
        nome,
        email,
        telefone,
        senhaProtegida,
        tipo_perfil,
      ]
    );

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario: {
        id: resultado.insertId,
        nome,
        email,
        telefone,
        tipo_perfil,
      },
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      mensagem: "Erro ao cadastrar usuário.",
    });
  }
});

export default router;