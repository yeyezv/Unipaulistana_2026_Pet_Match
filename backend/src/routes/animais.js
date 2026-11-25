import express from "express";
import conexao from "../config/database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { tipo, raca, cidade } = req.query;

    let sql = `
      SELECT
        animais.id,
        animais.nome,
        animais.tipo,
        animais.raca,
        animais.idade,
        animais.sexo,
        animais.cidade,
        animais.descricao,
        animais.imagem,
        animais.status,
        usuarios.nome AS responsavel
      FROM animais
      INNER JOIN usuarios
        ON animais.usuario_id = usuarios.id
      WHERE animais.status = 'disponivel'
    `;

    const valores = [];

    if (tipo) {
      sql += " AND animais.tipo = ?";
      valores.push(tipo);
    }

    if (raca) {
      sql += " AND animais.raca LIKE ?";
      valores.push(`%${raca}%`);
    }

    if (cidade) {
      sql += " AND animais.cidade LIKE ?";
      valores.push(`%${cidade}%`);
    }

    sql += " ORDER BY animais.id DESC";

    const [animais] = await conexao.query(sql, valores);

    return res.status(200).json(animais);
  } catch (erro) {
    console.error("Erro ao buscar animais:", erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar animais.",
    });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [animais] = await conexao.query(
      `
        SELECT *
        FROM animais
        WHERE id = ?
      `,
      [id]
    );

    if (animais.length === 0) {
      return res.status(404).json({
        mensagem: "Animal não encontrado.",
      });
    }

    return res.status(200).json(animais[0]);
  } catch (erro) {
    console.error("Erro ao buscar animal:", erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar animal.",
    });
  }
});


router.get("/doador/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [usuarios] = await conexao.query(
      `
        SELECT id, tipo_perfil
        FROM usuarios
        WHERE id = ?
      `,
      [id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    if (usuarios[0].tipo_perfil !== "doador") {
      return res.status(403).json({
        mensagem: "Apenas doadores podem acessar seus animais.",
      });
    }

    const [animais] = await conexao.query(
      `
        SELECT
          id,
          nome,
          tipo,
          raca,
          idade,
          sexo,
          cidade,
          descricao,
          imagem,
          status,
          criado_em
        FROM animais
        WHERE usuario_id = ?
        ORDER BY id DESC
      `,
      [id]
    );

    return res.status(200).json(animais);
  } catch (erro) {
    console.error("Erro ao buscar animais do doador:", erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar seus animais.",
    });
  }
});


router.post("/", async (req, res) => {
  try {
    const {
      usuario_id,
      nome,
      tipo,
      raca,
      idade,
      sexo,
      cidade,
      descricao,
      imagem,
    } = req.body;

    if (
      !usuario_id ||
      !nome ||
      !tipo ||
      !raca ||
      !cidade ||
      !descricao
    ) {
      return res.status(400).json({
        mensagem: "Preencha os campos obrigatórios.",
      });
    }

    const [usuarios] = await conexao.query(
      `
        SELECT id, tipo_perfil
        FROM usuarios
        WHERE id = ?
      `,
      [usuario_id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    if (usuarios[0].tipo_perfil !== "doador") {
      return res.status(403).json({
        mensagem: "Somente doadores podem cadastrar animais.",
      });
    }

    const [resultado] = await conexao.query(
      `
        INSERT INTO animais
        (
          usuario_id,
          nome,
          tipo,
          raca,
          idade,
          sexo,
          cidade,
          descricao,
          imagem
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        usuario_id,
        nome,
        tipo,
        raca,
        idade || null,
        sexo || "nao_informado",
        cidade,
        descricao,
        imagem || null,
      ]
    );

    return res.status(201).json({
      mensagem: "Animal cadastrado com sucesso.",
      id: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar animal:", erro);

    return res.status(500).json({
      mensagem: "Erro ao cadastrar animal.",
    });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      usuario_id,
      nome,
      tipo,
      raca,
      idade,
      sexo,
      cidade,
      descricao,
      imagem,
    } = req.body;

    if (
      !usuario_id ||
      !nome ||
      !tipo ||
      !raca ||
      !cidade ||
      !descricao
    ) {
      return res.status(400).json({
        mensagem: "Preencha os campos obrigatórios.",
      });
    }

    const [animais] = await conexao.query(
      `
        SELECT id, usuario_id
        FROM animais
        WHERE id = ?
      `,
      [id]
    );

    if (animais.length === 0) {
      return res.status(404).json({
        mensagem: "Animal não encontrado.",
      });
    }

    if (animais[0].usuario_id !== Number(usuario_id)) {
      return res.status(403).json({
        mensagem: "Você só pode editar seus próprios animais.",
      });
    }

    await conexao.query(
      `
        UPDATE animais
        SET
          nome = ?,
          tipo = ?,
          raca = ?,
          idade = ?,
          sexo = ?,
          cidade = ?,
          descricao = ?,
          imagem = ?
        WHERE id = ?
      `,
      [
        nome,
        tipo,
        raca,
        idade || null,
        sexo || "nao_informado",
        cidade,
        descricao,
        imagem || null,
        id,
      ]
    );

    return res.status(200).json({
      mensagem: "Animal atualizado com sucesso.",
    });
  } catch (erro) {
    console.error("Erro ao editar animal:", erro);

    return res.status(500).json({
      mensagem: "Erro ao editar animal.",
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id } = req.body;

    const [animais] = await conexao.query(
      `
        SELECT id, usuario_id
        FROM animais
        WHERE id = ?
      `,
      [id]
    );

    if (animais.length === 0) {
      return res.status(404).json({
        mensagem: "Animal não encontrado.",
      });
    }

    if (animais[0].usuario_id !== Number(usuario_id)) {
      return res.status(403).json({
        mensagem: "Você só pode excluir seus próprios animais.",
      });
    }

    await conexao.query(
      "DELETE FROM animais WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      mensagem: "Animal excluído com sucesso.",
    });
  } catch (erro) {
    console.error("Erro ao excluir animal:", erro);

    return res.status(500).json({
      mensagem: "Erro ao excluir animal.",
    });
  }
});


export default router;