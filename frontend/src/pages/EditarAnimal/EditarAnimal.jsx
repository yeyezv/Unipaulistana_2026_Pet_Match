import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginaInterna from "../../components/PaginaInterna/PaginaInterna";
import "./EditarAnimal.css";

function EditarAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nome: "",
    tipo: "",
    raca: "",
    idade: "",
    sexo: "",
    cidade: "",
    descricao: "",
    imagem: "",
  });

  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  useEffect(() => {
    async function buscarAnimal() {
      try {
        const resposta = await fetch(
          `http://localhost:3001/api/animais/${id}`
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          setMensagem(
            dados.mensagem || "Erro ao buscar animal."
          );
          setTipoMensagem("erro");
          return;
        }

        setFormulario({
          nome: dados.nome || "",
          tipo: dados.tipo || "",
          raca: dados.raca || "",
          idade: dados.idade || "",
          sexo: dados.sexo || "",
          cidade: dados.cidade || "",
          descricao: dados.descricao || "",
          imagem: dados.imagem || "",
        });
      } catch (erro) {
        console.error(erro);
        setMensagem("Não foi possível conectar ao servidor.");
        setTipoMensagem("erro");
      } finally {
        setCarregando(false);
      }
    }

    buscarAnimal();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const usuarioSalvo = localStorage.getItem("usuario");

    if (!usuarioSalvo) {
      setMensagem("Você precisa fazer login.");
      setTipoMensagem("erro");
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    if (usuario.tipo_perfil !== "doador") {
      setMensagem("Apenas doadores podem editar animais.");
      setTipoMensagem("erro");
      return;
    }

    if (
      !formulario.nome ||
      !formulario.tipo ||
      !formulario.raca ||
      !formulario.cidade ||
      !formulario.descricao
    ) {
      setMensagem("Preencha os campos obrigatórios.");
      setTipoMensagem("erro");
      return;
    }

    try {
      const resposta = await fetch(
        `http://localhost:3001/api/animais/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario_id: usuario.id,
            ...formulario,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem || "Erro ao atualizar animal."
        );
        setTipoMensagem("erro");
        return;
      }

      setMensagem("Animal atualizado com sucesso!");
      setTipoMensagem("sucesso");

      setTimeout(() => {
        navigate("/meus-animais");
      }, 1000);
    } catch (erro) {
      console.error(erro);
      setMensagem("Não foi possível conectar ao servidor.");
      setTipoMensagem("erro");
    }
  }

  if (carregando) {
    return (
      <PaginaInterna
        titulo="Editar animal"
        descricao="Carregando informações..."
      >
        <p>Carregando...</p>
      </PaginaInterna>
    );
  }

  return (
    <PaginaInterna
      titulo="Editar animal"
      descricao="Atualize as informações do animal."
    >
      <form
        className="editar-animal-formulario"
        onSubmit={handleSubmit}
      >
        <label htmlFor="nome">Nome do animal *</label>
        <input
          id="nome"
          name="nome"
          value={formulario.nome}
          onChange={handleChange}
        />

        <label htmlFor="tipo">Tipo *</label>
        <select
          id="tipo"
          name="tipo"
          value={formulario.tipo}
          onChange={handleChange}
        >
          <option value="">Selecione</option>
          <option value="cachorro">Cachorro</option>
          <option value="gato">Gato</option>
          <option value="outro">Outro</option>
        </select>

        <label htmlFor="raca">Raça *</label>
        <input
          id="raca"
          name="raca"
          value={formulario.raca}
          onChange={handleChange}
        />

        <label htmlFor="idade">Idade</label>
        <input
          id="idade"
          name="idade"
          value={formulario.idade}
          onChange={handleChange}
        />

        <label htmlFor="sexo">Sexo</label>
        <select
          id="sexo"
          name="sexo"
          value={formulario.sexo}
          onChange={handleChange}
        >
          <option value="">Selecione</option>
          <option value="macho">Macho</option>
          <option value="femea">Fêmea</option>
          <option value="nao_informado">
            Não informado
          </option>
        </select>

        <label htmlFor="cidade">Cidade *</label>
        <input
          id="cidade"
          name="cidade"
          value={formulario.cidade}
          onChange={handleChange}
        />

        <label htmlFor="imagem">Link da imagem</label>
        <input
          id="imagem"
          name="imagem"
          value={formulario.imagem}
          onChange={handleChange}
        />

        <label htmlFor="descricao">Descrição *</label>
        <textarea
          id="descricao"
          name="descricao"
          rows="5"
          value={formulario.descricao}
          onChange={handleChange}
        ></textarea>

        {mensagem && (
          <p className={`mensagem-edicao ${tipoMensagem}`}>
            {mensagem}
          </p>
        )}

        <button type="submit">
          Salvar alterações
        </button>
      </form>
    </PaginaInterna>
  );
}

export default EditarAnimal;