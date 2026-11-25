import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PaginaInterna from "../../components/PaginaInterna/PaginaInterna";
import "./DetalhesAnimal.css";

function DetalhesAnimal() {
  const { id } = useParams();

  const [animal, setAnimal] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [mensagemPedido, setMensagemPedido] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [textoPedido, setTextoPedido] = useState("");

  useEffect(() => {
    async function buscarAnimal() {
      try {
        const resposta = await fetch(
          `http://localhost:3001/api/pedidos/animal/${id}`
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          setMensagem(
            dados.mensagem || "Animal não encontrado."
          );
          return;
        }

        setAnimal(dados);
      } catch (erro) {
        console.error("Erro ao buscar animal:", erro);
        setMensagem("Não foi possível conectar ao servidor.");
      } finally {
        setCarregando(false);
      }
    }

    buscarAnimal();
  }, [id]);

  async function enviarPedido(event) {
    event.preventDefault();

    setMensagemPedido("");
    setTipoMensagem("");

    const usuarioSalvo = localStorage.getItem("usuario");

    if (!usuarioSalvo) {
      setMensagemPedido(
        "Você precisa fazer login como adotante para enviar um pedido."
      );
      setTipoMensagem("erro");
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    if (usuario.tipo_perfil !== "adotante") {
      setMensagemPedido(
        "Somente usuários adotantes podem enviar pedidos."
      );
      setTipoMensagem("erro");
      return;
    }

    try {
      const resposta = await fetch(
        "http://localhost:3001/api/pedidos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            animal_id: animal.id,
            adotante_id: usuario.id,
            mensagem: textoPedido,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagemPedido(
          dados.mensagem || "Erro ao enviar pedido."
        );
        setTipoMensagem("erro");
        return;
      }

      setMensagemPedido(
        "Pedido de adoção enviado com sucesso!"
      );
      setTipoMensagem("sucesso");
      setTextoPedido("");
    } catch (erro) {
      console.error("Erro ao enviar pedido:", erro);

      setMensagemPedido(
        "Não foi possível conectar ao servidor."
      );
      setTipoMensagem("erro");
    }
  }

  if (carregando) {
    return (
      <PaginaInterna
        titulo="Detalhes do animal"
        descricao="Carregando informações..."
      >
        <p>Carregando...</p>
      </PaginaInterna>
    );
  }

  if (mensagem || !animal) {
    return (
      <PaginaInterna
        titulo="Animal não encontrado"
        descricao={mensagem}
      >
        <Link to="/animais" className="voltar-animais">
          Voltar para animais
        </Link>
      </PaginaInterna>
    );
  }

  return (
    <PaginaInterna
      titulo={animal.nome}
      descricao="Confira as informações do animal."
    >
      <div className="detalhes-animal">
        <div className="detalhes-imagem-area">
          {animal.imagem ? (
            <img
              src={animal.imagem}
              alt={`Foto de ${animal.nome}`}
              className="detalhes-imagem"
            />
          ) : (
            <div className="detalhes-sem-imagem">
              🐾
            </div>
          )}
        </div>

        <div className="detalhes-conteudo">
          <h2>{animal.nome}</h2>

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

          <p>
            <strong>Responsável:</strong>{" "}
            {animal.responsavel}
          </p>

          <p className="descricao-animal">
            {animal.descricao}
          </p>
        </div>
      </div>

      <div className="pedido-area">
        <h2>Tenho interesse em adotar</h2>

        <p>
          Envie uma mensagem ao responsável demonstrando seu
          interesse neste animal.
        </p>

        <form
          className="pedido-formulario"
          onSubmit={enviarPedido}
        >
          <label htmlFor="mensagem">
            Mensagem
          </label>

          <textarea
            id="mensagem"
            rows="5"
            placeholder="Escreva uma mensagem para o responsável"
            value={textoPedido}
            onChange={(event) =>
              setTextoPedido(event.target.value)
            }
          ></textarea>

          {mensagemPedido && (
            <p
              className={`mensagem-pedido ${tipoMensagem}`}
            >
              {mensagemPedido}
            </p>
          )}

          <button
            type="submit"
            className="botao-pedido"
          >
            Enviar pedido de adoção
          </button>
        </form>
      </div>
    </PaginaInterna>
  );
}

export default DetalhesAnimal;