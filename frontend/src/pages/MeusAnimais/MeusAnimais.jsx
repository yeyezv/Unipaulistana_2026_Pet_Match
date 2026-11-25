import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PaginaInterna from "../../components/PaginaInterna/PaginaInterna";
import "./MeusAnimais.css";

function MeusAnimais() {
  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function buscarAnimais() {
      const usuarioSalvo = localStorage.getItem("usuario");

      if (!usuarioSalvo) {
        setMensagem(
          "Você precisa fazer login para visualizar seus animais."
        );
        setCarregando(false);
        return;
      }

      const usuario = JSON.parse(usuarioSalvo);

      if (usuario.tipo_perfil !== "doador") {
        setMensagem(
          "Apenas usuários doadores podem acessar esta página."
        );
        setCarregando(false);
        return;
      }

      try {
        const resposta = await fetch(
          `http://localhost:3001/api/animais/doador/${usuario.id}`
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          setMensagem(
            dados.mensagem || "Erro ao buscar seus animais."
          );
          return;
        }

        setAnimais(dados);
      } catch (erro) {
        console.error("Erro ao buscar animais:", erro);

        setMensagem(
          "Não foi possível conectar ao servidor."
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarAnimais();
  }, []);

  function mostrarStatus(status) {
    const nomesStatus = {
      disponivel: "Disponível",
      em_processo: "Em processo de adoção",
      adotado: "Adotado",
    };

    return nomesStatus[status] || status;
  }

  function classeStatus(status) {
    return `status-animal status-${status}`;
  }

  async function excluirAnimal(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este animal?"
    );

    if (!confirmar) {
      return;
    }

    const usuarioSalvo = localStorage.getItem("usuario");

    if (!usuarioSalvo) {
      setMensagem("Você precisa fazer login.");
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    try {
      const resposta = await fetch(
        `http://localhost:3001/api/animais/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario_id: usuario.id,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem || "Erro ao excluir animal."
        );
        return;
      }

      setAnimais((animaisAtuais) =>
        animaisAtuais.filter(
          (animal) => animal.id !== id
        )
      );

      setMensagem("");
    } catch (erro) {
      console.error("Erro ao excluir animal:", erro);

      setMensagem(
        "Não foi possível excluir o animal."
      );
    }
  }

  if (carregando) {
    return (
      <PaginaInterna
        titulo="Meus animais"
        descricao="Consulte os animais cadastrados por você."
      >
        <p className="mensagem-meus-animais">
          Carregando animais...
        </p>
      </PaginaInterna>
    );
  }

  if (mensagem && animais.length === 0) {
    return (
      <PaginaInterna
        titulo="Meus animais"
        descricao={mensagem}
      >
        <Link
          to="/cadastrar-animal"
          className="botao-voltar-animal"
        >
          Cadastrar um animal
        </Link>
      </PaginaInterna>
    );
  }

  return (
    <PaginaInterna
      titulo="Meus animais"
      descricao="Consulte e gerencie os animais cadastrados por você."
    >
      <div className="topo-meus-animais">
        <Link
          to="/cadastrar-animal"
          className="botao-cadastrar-animal"
        >
          Cadastrar novo animal
        </Link>
      </div>

      {mensagem && (
        <p className="mensagem-meus-animais erro">
          {mensagem}
        </p>
      )}

      {animais.length === 0 ? (
        <div className="sem-animais">
          <p>
            Você ainda não cadastrou nenhum animal.
          </p>

          <Link
            to="/cadastrar-animal"
            className="botao-cadastrar-animal"
          >
            Cadastrar primeiro animal
          </Link>
        </div>
      ) : (
        <div className="meus-animais-grid">
          {animais.map((animal) => (
            <div
              className="meu-animal-card"
              key={animal.id}
            >
              {animal.imagem ? (
                <img
                  src={animal.imagem}
                  alt={`Foto de ${animal.nome}`}
                  className="meu-animal-imagem"
                />
              ) : (
                <div className="meu-animal-sem-imagem">
                  🐾
                </div>
              )}

              <div className="meu-animal-conteudo">
                <div className="meu-animal-cabecalho">
                  <h2>{animal.nome}</h2>

                  <span
                    className={classeStatus(animal.status)}
                  >
                    {mostrarStatus(animal.status)}
                  </span>
                </div>

                <p>
                  <strong>Tipo:</strong> {animal.tipo}
                </p>

                <p>
                  <strong>Raça:</strong> {animal.raca}
                </p>

                <p>
                  <strong>Idade:</strong>{" "}
                  {animal.idade || "Não informada"}
                </p>

                <p>
                  <strong>Sexo:</strong>{" "}
                  {animal.sexo || "Não informado"}
                </p>

                <p>
                  <strong>Cidade:</strong> {animal.cidade}
                </p>

                <p className="meu-animal-descricao">
                  {animal.descricao}
                </p>

                <Link
                  to={`/animais/${animal.id}`}
                  className="botao-ver-animal"
                >
                  Ver anúncio
                </Link>

                <Link
                  to={`/editar-animal/${animal.id}`}
                  className="botao-editar-animal"
                >
                  Editar
                </Link>

                <button
                  type="button"
                  className="botao-excluir-animal"
                  onClick={() => excluirAnimal(animal.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PaginaInterna>
  );
}

export default MeusAnimais;