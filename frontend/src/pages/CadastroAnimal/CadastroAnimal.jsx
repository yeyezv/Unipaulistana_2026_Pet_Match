import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginaInterna from "../../components/PaginaInterna/PaginaInterna";
import "./CadastroAnimal.css";

function CadastroAnimal() {
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

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

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
      setMensagem("Você precisa fazer login antes de cadastrar um animal.");
      setTipoMensagem("erro");
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    if (usuario.tipo_perfil !== "doador") {
      setMensagem(
        "Somente usuários do tipo doador podem cadastrar animais."
      );
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
      setMensagem("Preencha todos os campos obrigatórios.");
      setTipoMensagem("erro");
      return;
    }

    try {
      const resposta = await fetch(
        "http://localhost:3001/api/animais",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario_id: usuario.id,
            nome: formulario.nome,
            tipo: formulario.tipo,
            raca: formulario.raca,
            idade: formulario.idade,
            sexo: formulario.sexo || "nao_informado",
            cidade: formulario.cidade,
            descricao: formulario.descricao,
            imagem: formulario.imagem,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem || "Erro ao cadastrar animal."
        );
        setTipoMensagem("erro");
        return;
      }

      setMensagem("Animal cadastrado com sucesso!");
      setTipoMensagem("sucesso");

      setFormulario({
        nome: "",
        tipo: "",
        raca: "",
        idade: "",
        sexo: "",
        cidade: "",
        descricao: "",
        imagem: "",
      });

      setTimeout(() => {
        navigate("/meus-animais");
      }, 1200);
    } catch (erro) {
      console.error("Erro ao cadastrar animal:", erro);

      setMensagem(
        "Não foi possível conectar ao servidor."
      );
      setTipoMensagem("erro");
    }
  }

  return (
    <PaginaInterna
      titulo="Cadastrar um animal"
      descricao="Divulgue um animal que precisa encontrar um novo lar."
    >
      <form
        className="animal-formulario"
        onSubmit={handleSubmit}
      >
        <div className="campo-animal">
          <label htmlFor="nome">Nome do animal *</label>

          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Digite o nome do animal"
            value={formulario.nome}
            onChange={handleChange}
          />
        </div>

        <div className="linha-campos">
          <div className="campo-animal">
            <label htmlFor="tipo">Tipo de animal *</label>

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
          </div>

          <div className="campo-animal">
            <label htmlFor="raca">Raça *</label>

            <input
              id="raca"
              name="raca"
              type="text"
              placeholder="Ex.: SRD"
              value={formulario.raca}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="linha-campos">
          <div className="campo-animal">
            <label htmlFor="idade">Idade</label>

            <input
              id="idade"
              name="idade"
              type="text"
              placeholder="Ex.: 2 anos"
              value={formulario.idade}
              onChange={handleChange}
            />
          </div>

          <div className="campo-animal">
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
          </div>
        </div>

        <div className="campo-animal">
          <label htmlFor="cidade">Cidade *</label>

          <input
            id="cidade"
            name="cidade"
            type="text"
            placeholder="Digite a cidade"
            value={formulario.cidade}
            onChange={handleChange}
          />
        </div>

        <div className="campo-animal">
          <label htmlFor="imagem">
            Link da imagem
          </label>

          <input
            id="imagem"
            name="imagem"
            type="text"
            placeholder="Cole o link da imagem, se desejar"
            value={formulario.imagem}
            onChange={handleChange}
          />
        </div>

        <div className="campo-animal">
          <label htmlFor="descricao">
            Descrição *
          </label>

          <textarea
            id="descricao"
            name="descricao"
            rows="5"
            placeholder="Descreva o animal"
            value={formulario.descricao}
            onChange={handleChange}
          ></textarea>
        </div>

        {mensagem && (
          <p
            className={`mensagem-animal ${tipoMensagem}`}
          >
            {mensagem}
          </p>
        )}

        <button
          type="submit"
          className="botao-animal"
        >
          Cadastrar animal
        </button>
      </form>
    </PaginaInterna>
  );
}

export default CadastroAnimal;