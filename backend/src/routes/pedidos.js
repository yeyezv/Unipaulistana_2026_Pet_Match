import express from "express";
import conexao from "../config/database.js";

const router = express.Router();

router.get("/animal/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [animais] = await conexao.query(
      `
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
          animais.usuario_id,
          usuarios.nome AS nome_doador
        FROM animais
        INNER JOIN usuarios
          ON animais.usuario_id = usuarios.id
        WHERE animais.id = ?
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
    console.error("Erro ao buscar detalhes do animal:", erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar detalhes do animal.",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      animal_id,
      adotante_id,
      mensagem,
    } = req.body;

    if (!animal_id || !adotante_id) {
      return res.status(400).json({
        mensagem: "Animal e adotante são obrigatórios.",
      });
    }

    const [usuarios] = await conexao.query(
      `
        SELECT id, tipo_perfil
        FROM usuarios
        WHERE id = ?
      `,
      [adotante_id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado.",
      });
    }

    if (usuarios[0].tipo_perfil !== "adotante") {
      return res.status(403).json({
        mensagem: "Somente adotantes podem enviar pedidos.",
      });
    }

    const [animais] = await conexao.query(
      `
        SELECT id, status
        FROM animais
        WHERE id = ?
      `,
      [animal_id]
    );

    if (animais.length === 0) {
      return res.status(404).json({
        mensagem: "Animal não encontrado.",
      });
    }

    if (animais[0].status !== "disponivel") {
      return res.status(400).json({
        mensagem: "Este animal não está disponível para adoção.",
      });
    }

    const [pedidosExistentes] = await conexao.query(
      `
        SELECT id
        FROM pedidos_adocao
        WHERE animal_id = ?
          AND adotante_id = ?
          AND status IN (
            'solicitado',
            'em_analise',
            'agendado'
          )
      `,
      [animal_id, adotante_id]
    );

    if (pedidosExistentes.length > 0) {
      return res.status(400).json({
        mensagem: "Você já enviou um pedido para este animal.",
      });
    }

    const [resultado] = await conexao.query(
      `
        INSERT INTO pedidos_adocao
        (
          animal_id,
          adotante_id,
          mensagem,
          status
        )
        VALUES (?, ?, ?, 'solicitado')
      `,
      [
        animal_id,
        adotante_id,
        mensagem || null,
      ]
    );

    return res.status(201).json({
      mensagem: "Pedido de adoção enviado com sucesso.",
      id: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao criar pedido de adoção:", erro);

    return res.status(500).json({
      mensagem: "Erro ao enviar pedido de adoção.",
    });
  }
});

router.get("/adotante/:id", async (req, res) => {
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

    if (usuarios[0].tipo_perfil !== "adotante") {
      return res.status(403).json({
        mensagem: "Apenas adotantes podem visualizar seus pedidos.",
      });
    }

    const [pedidos] = await conexao.query(
      `
        SELECT
          pedidos_adocao.id,
          pedidos_adocao.animal_id,
          pedidos_adocao.adotante_id,
          pedidos_adocao.mensagem,
          pedidos_adocao.status,
          pedidos_adocao.criado_em,

          animais.nome AS nome_animal,
          animais.tipo AS tipo_animal,
          animais.raca AS raca_animal,
          animais.cidade AS cidade_animal,
          animais.imagem AS imagem_animal,

          usuarios.nome AS nome_doador,
          usuarios.email AS email_doador

        FROM pedidos_adocao

        INNER JOIN animais
          ON pedidos_adocao.animal_id = animais.id

        INNER JOIN usuarios
          ON animais.usuario_id = usuarios.id

        WHERE pedidos_adocao.adotante_id = ?

        ORDER BY pedidos_adocao.id DESC
      `,
      [id]
    );

    return res.status(200).json(pedidos);
  } catch (erro) {
    console.error("Erro ao buscar pedidos do adotante:", erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar pedidos do adotante.",
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
        mensagem: "Apenas doadores podem visualizar pedidos recebidos.",
      });
    }

    const [pedidos] = await conexao.query(
      `
        SELECT
          pedidos_adocao.id,
          pedidos_adocao.animal_id,
          pedidos_adocao.adotante_id,
          pedidos_adocao.mensagem,
          pedidos_adocao.status,
          pedidos_adocao.criado_em,

          animais.nome AS nome_animal,
          animais.imagem AS imagem_animal,

          usuarios.nome AS nome_adotante,
          usuarios.email AS email_adotante,
          usuarios.cidade AS cidade_adotante

        FROM pedidos_adocao

        INNER JOIN animais
          ON pedidos_adocao.animal_id = animais.id

        INNER JOIN usuarios
          ON pedidos_adocao.adotante_id = usuarios.id

        WHERE animais.usuario_id = ?

        ORDER BY pedidos_adocao.id DESC
      `,
      [id]
    );

    return res.status(200).json(pedidos);
  } catch (erro) {
    console.error("Erro ao buscar pedidos recebidos:", erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar pedidos recebidos.",
    });
  }
});


router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { doador_id, status } = req.body;
    const doadorIdNumero = Number(doador_id);

    const statusPermitidos = [
      "solicitado",
      "em_analise",
      "agendado",
      "aprovado",
      "recusado",
      "cancelado",
    ];

    if (!doador_id || !status) {
      return res.status(400).json({
        mensagem: "Doador e status são obrigatórios.",
      });
    }

    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({
        mensagem: "Status informado não é válido.",
      });
    }

    const [pedidos] = await conexao.query(
      `
        SELECT
          pedidos_adocao.id,
          pedidos_adocao.animal_id,
          animais.usuario_id AS doador_id
        FROM pedidos_adocao

        INNER JOIN animais
          ON pedidos_adocao.animal_id = animais.id

        WHERE pedidos_adocao.id = ?
      `,
      [id]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({
        mensagem: "Pedido não encontrado.",
      });
    }

    if (Number(pedidos[0].doador_id) !== doadorIdNumero) {
      return res.status(403).json({
        mensagem: "Você só pode atualizar pedidos dos seus animais.",
      });
    }

    await conexao.query(
      `
        UPDATE pedidos_adocao
        SET status = ?
        WHERE id = ?
      `,
      [status, id]
    );

    const statusAnimal = status === "aprovado"
      ? "adotado"
      : "disponivel";

    await conexao.query(
      `
        UPDATE animais
        SET status = ?
        WHERE id = ?
      `,
      [statusAnimal, pedidos[0].animal_id]
    );

    return res.status(200).json({
      mensagem: "Status do pedido atualizado com sucesso.",
    });
  } catch (erro) {
    console.error("Erro ao atualizar status do pedido:", erro);

    return res.status(500).json({
      mensagem: "Erro ao atualizar status do pedido.",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [pedidos] = await conexao.query(
      `
        SELECT
          pedidos_adocao.id,
          pedidos_adocao.animal_id,
          pedidos_adocao.adotante_id,
          pedidos_adocao.mensagem,
          pedidos_adocao.status,
          pedidos_adocao.criado_em,

          animais.nome AS nome_animal,
          animais.imagem AS imagem_animal,

          adotante.nome AS nome_adotante,
          adotante.email AS email_adotante,

          doador.nome AS nome_doador,
          doador.email AS email_doador

        FROM pedidos_adocao

        INNER JOIN animais
          ON pedidos_adocao.animal_id = animais.id

        INNER JOIN usuarios AS adotante
          ON pedidos_adocao.adotante_id = adotante.id

        INNER JOIN usuarios AS doador
          ON animais.usuario_id = doador.id

        WHERE pedidos_adocao.id = ?
      `,
      [id]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({
        mensagem: "Pedido não encontrado.",
      });
    }

    return res.status(200).json(pedidos[0]);
  } catch (erro) {
    console.error("Erro ao buscar pedido:", erro);

    return res.status(500).json({
      mensagem: "Erro ao buscar pedido.",
    });
  }
});

export default router;
