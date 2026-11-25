import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PaginaInterna from "../../components/PaginaInterna/PaginaInterna";
import "./PedidosRecebidos.css";

function PedidosRecebidos() {
  const [pedidos, setPedidos] = useState([]);
  const [statusSelecionados, setStatusSelecionados] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  useEffect(() => {
    async function buscarPedidos() {
      const usuarioSalvo = localStorage.getItem("usuario");

      if (!usuarioSalvo) {
        setMensagem(
          "Você precisa fazer login para visualizar os pedidos."
        );
        setTipoMensagem("erro");
        setCarregando(false);
        return;
      }

      const usuario = JSON.parse(usuarioSalvo);

      if (usuario.tipo_perfil !== "doador") {
        setMensagem(
          "Apenas usuários doadores podem acessar esta página."
        );
        setTipoMensagem("erro");
        setCarregando(false);
        return;
      }

      try {
        const resposta = await fetch(
          `http://localhost:3001/api/pedidos/doador/${usuario.id}`
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          setMensagem(
            dados.mensagem ||
              "Erro ao buscar pedidos recebidos."
          );
          setTipoMensagem("erro");
          return;
        }

        setPedidos(dados);

        const statusIniciais = {};

        dados.forEach((pedido) => {
          statusIniciais[pedido.id] = pedido.status;
        });

        setStatusSelecionados(statusIniciais);
      } catch (erro) {
        console.error("Erro ao buscar pedidos:", erro);

        setMensagem(
          "Não foi possível conectar ao servidor."
        );
        setTipoMensagem("erro");
      } finally {
        setCarregando(false);
      }
    }

    buscarPedidos();
  }, []);

  function mostrarStatus(status) {
    const nomesStatus = {
      solicitado: "Solicitado",
      em_analise: "Em análise",
      agendado: "Adoção agendada",
      aprovado: "Aprovado",
      recusado: "Recusado",
      cancelado: "Cancelado",
    };

    return nomesStatus[status] || status;
  }

  function classeStatus(status) {
    return `status-pedido status-${status}`;
  }

  function formatarData(data) {
    if (!data) {
      return "Data não informada";
    }

    return new Date(data).toLocaleDateString("pt-BR");
  }

  function alterarStatusSelecionado(id, novoStatus) {
    setStatusSelecionados({
      ...statusSelecionados,
      [id]: novoStatus,
    });
  }

  async function atualizarStatus(pedidoId) {
    const usuarioSalvo = localStorage.getItem("usuario");

    if (!usuarioSalvo) {
      setMensagem("Você precisa fazer login.");
      setTipoMensagem("erro");
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);
    const novoStatus = statusSelecionados[pedidoId];

    if (!novoStatus) {
      setMensagem("Selecione um status.");
      setTipoMensagem("erro");
      return;
    }

    setAtualizando(pedidoId);
    setMensagem("");

    try {
      const resposta = await fetch(
        `http://localhost:3001/api/pedidos/${pedidoId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doador_id: usuario.id,
            status: novoStatus,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem ||
            "Erro ao atualizar o status do pedido."
        );
        setTipoMensagem("erro");
        return;
      }

      setPedidos((pedidosAtuais) =>
        pedidosAtuais.map((pedido) =>
          pedido.id === pedidoId
            ? {
                ...pedido,
                status: novoStatus,
              }
            : pedido
        )
      );

      setMensagem("Status atualizado com sucesso!");
      setTipoMensagem("sucesso");
    } catch (erro) {
      console.error(
        "Erro ao atualizar status:",
        erro
      );

      setMensagem(
        "Não foi possível conectar ao servidor."
      );
      setTipoMensagem("erro");
    } finally {
      setAtualizando(null);
    }
  }

  if (carregando) {
    return (
      <PaginaInterna
        titulo="Pedidos recebidos"
        descricao="Visualize os pedidos de adoção dos seus animais."
      >
        <p className="mensagem-pedidos">
          Carregando pedidos...
        </p>
      </PaginaInterna>
    );
  }

  if (mensagem && pedidos.length === 0) {
    return (
      <PaginaInterna
        titulo="Pedidos recebidos"
        descricao={mensagem}
      >
        <Link
          to="/meus-animais"
          className="botao-voltar-pedidos"
        >
          Voltar para meus animais
        </Link>
      </PaginaInterna>
    );
  }

  return (
    <PaginaInterna
      titulo="Pedidos recebidos"
      descricao="Visualize e atualize os pedidos de adoção dos seus animais."
    >
      {mensagem && (
        <p className={`mensagem-pedidos ${tipoMensagem}`}>
          {mensagem}
        </p>
      )}

      {pedidos.length === 0 ? (
        <div className="sem-pedidos">
          <p>
            Você ainda não recebeu nenhum pedido de adoção.
          </p>

          <Link
            to="/meus-animais"
            className="botao-voltar-pedidos"
          >
            Ver meus animais
          </Link>
        </div>
      ) : (
        <div className="pedidos-recebidos-lista">
          {pedidos.map((pedido) => (
            <div
              className="pedido-recebido-card"
              key={pedido.id}
            >
              <div className="pedido-recebido-imagem">
                {pedido.imagem_animal ? (
                  <img
                    src={pedido.imagem_animal}
                    alt={`Foto de ${pedido.nome_animal}`}
                  />
                ) : (
                  <span>🐾</span>
                )}
              </div>

              <div className="pedido-recebido-conteudo">
                <div className="pedido-recebido-topo">
                  <h2>
                    Pedido para {pedido.nome_animal}
                  </h2>

                  <span
                    className={classeStatus(pedido.status)}
                  >
                    {mostrarStatus(pedido.status)}
                  </span>
                </div>

                <div className="dados-pedido">
                  <p>
                    <strong>Adotante:</strong>{" "}
                    {pedido.nome_adotante}
                  </p>

                  <p>
                    <strong>E-mail:</strong>{" "}
                    {pedido.email_adotante}
                  </p>

                  <p>
                    <strong>Cidade:</strong>{" "}
                    {pedido.cidade_adotante ||
                      "Não informada"}
                  </p>

                  <p>
                    <strong>Data do pedido:</strong>{" "}
                    {formatarData(pedido.criado_em)}
                  </p>
                </div>

                <div className="mensagem-adotante">
                  <strong>Mensagem do adotante:</strong>

                  <p>
                    {pedido.mensagem ||
                      "O adotante não enviou uma mensagem."}
                  </p>
                </div>

                <div className="controle-status">
                  <label
                    htmlFor={`status-${pedido.id}`}
                  >
                    Atualizar status
                  </label>

                  <div className="controle-status-linha">
                    <select
                      id={`status-${pedido.id}`}
                      value={
                        statusSelecionados[pedido.id] ||
                        pedido.status
                      }
                      onChange={(event) =>
                        alterarStatusSelecionado(
                          pedido.id,
                          event.target.value
                        )
                      }
                    >
                      <option value="solicitado">
                        Solicitado
                      </option>

                      <option value="em_analise">
                        Em análise
                      </option>

                      <option value="agendado">
                        Adoção agendada
                      </option>

                      <option value="aprovado">
                        Aprovado
                      </option>

                      <option value="recusado">
                        Recusado
                      </option>

                      <option value="cancelado">
                        Cancelado
                      </option>
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        atualizarStatus(pedido.id)
                      }
                      disabled={atualizando === pedido.id}
                    >
                      {atualizando === pedido.id
                        ? "Salvando..."
                        : "Atualizar status"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PaginaInterna>
  );
}

export default PedidosRecebidos;