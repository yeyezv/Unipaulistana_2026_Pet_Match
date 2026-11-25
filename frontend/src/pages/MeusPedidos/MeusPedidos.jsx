import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PaginaInterna from "../../components/PaginaInterna/PaginaInterna";
import "./MeusPedidos.css";

function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function buscarPedidos() {
      const usuarioSalvo = localStorage.getItem("usuario");

      if (!usuarioSalvo) {
        setMensagem(
          "Você precisa fazer login para visualizar seus pedidos."
        );
        setCarregando(false);
        return;
      }

      const usuario = JSON.parse(usuarioSalvo);

      if (usuario.tipo_perfil !== "adotante") {
        setMensagem(
          "Apenas usuários adotantes podem acessar esta página."
        );
        setCarregando(false);
        return;
      }

      try {
        const resposta = await fetch(
          `http://localhost:3001/api/pedidos/adotante/${usuario.id}`
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          setMensagem(
            dados.mensagem || "Erro ao buscar seus pedidos."
          );
          setCarregando(false);
          return;
        }

        setPedidos(dados);
      } catch (erro) {
        console.error("Erro ao buscar pedidos:", erro);

        setMensagem(
          "Não foi possível conectar ao servidor."
        );
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

  if (carregando) {
    return (
      <PaginaInterna
        titulo="Meus pedidos"
        descricao="Acompanhe seus pedidos de adoção."
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
        titulo="Meus pedidos"
        descricao={mensagem}
      >
        <Link
          to="/animais"
          className="botao-voltar-pedidos"
        >
          Ver animais disponíveis
        </Link>
      </PaginaInterna>
    );
  }

  return (
    <PaginaInterna
      titulo="Meus pedidos"
      descricao="Acompanhe o andamento dos seus pedidos de adoção."
    >
      {mensagem && (
        <p className="mensagem-pedidos erro">
          {mensagem}
        </p>
      )}

      {pedidos.length === 0 ? (
        <div className="sem-pedidos">
          <p>
            Você ainda não enviou nenhum pedido de adoção.
          </p>

          <Link
            to="/animais"
            className="botao-voltar-pedidos"
          >
            Ver animais disponíveis
          </Link>
        </div>
      ) : (
        <div className="meus-pedidos-lista">
          {pedidos.map((pedido) => (
            <article
              className="meu-pedido-card"
              key={pedido.id}
            >
              <div className="meu-pedido-imagem">
                {pedido.imagem_animal ? (
                  <img
                    src={pedido.imagem_animal}
                    alt={`Foto de ${pedido.nome_animal}`}
                  />
                ) : (
                  <span>🐾</span>
                )}
              </div>

              <div className="meu-pedido-conteudo">
                <div className="meu-pedido-topo">
                  <h2>
                    {pedido.nome_animal ||
                      "Animal não informado"}
                  </h2>

                  <span
                    className={classeStatus(pedido.status)}
                  >
                    {mostrarStatus(pedido.status)}
                  </span>
                </div>

                <div className="informacoes-animal-pedido">
                  <p>
                    <strong>Tipo:</strong>{" "}
                    {pedido.tipo_animal ||
                      "Não informado"}
                  </p>

                  <p>
                    <strong>Raça:</strong>{" "}
                    {pedido.raca_animal ||
                      "Não informada"}
                  </p>

                  <p>
                    <strong>Cidade:</strong>{" "}
                    {pedido.cidade_animal ||
                      "Não informada"}
                  </p>
                </div>

                <div className="informacoes-doador-pedido">
                  <p>
                    <strong>Doador:</strong>{" "}
                    {pedido.nome_doador ||
                      "Não informado"}
                  </p>

                  <p>
                    <strong>E-mail do doador:</strong>{" "}
                    {pedido.email_doador ||
                      "Não informado"}
                  </p>
                </div>

                <p className="data-pedido">
                  <strong>Data do pedido:</strong>{" "}
                  {formatarData(pedido.criado_em)}
                </p>

                <div className="mensagem-meu-pedido">
                  <strong>Sua mensagem:</strong>

                  <p>
                    {pedido.mensagem ||
                      "Nenhuma mensagem enviada."}
                  </p>
                </div>

                <Link
                  to={`/animais/${pedido.animal_id}`}
                  className="botao-ver-animal-pedido"
                >
                  Ver anúncio
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </PaginaInterna>
  );
}

export default MeusPedidos;