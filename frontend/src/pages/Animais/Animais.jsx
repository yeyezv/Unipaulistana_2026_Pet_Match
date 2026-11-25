import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PaginaInterna from "../../components/PaginaInterna/PaginaInterna";
import "./Animais.css";

function Animais() {
  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  const [filtros, setFiltros] = useState({
    tipo: "",
    raca: "",
    cidade: "",
  });

  async function buscarAnimais() {
    try {
      setCarregando(true);
      setMensagem("");

      const parametros = new URLSearchParams();

      if (filtros.tipo) {
        parametros.append("tipo", filtros.tipo);
      }

      if (filtros.raca) {
        parametros.append("raca", filtros.raca);
      }

      if (filtros.cidade) {
        parametros.append("cidade", filtros.cidade);
      }

      const url = parametros.toString()
        ? `http://localhost:3001/api/animais?${parametros}`
        : "http://localhost:3001/api/animais";

      const resposta = await fetch(url);
      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem || "Erro ao buscar animais."
        );
        setAnimais([]);
        return;
      }

      setAnimais(dados);
    } catch (erro) {
      console.error("Erro ao buscar animais:", erro);
      setMensagem("Não foi possível conectar ao servidor.");
      setAnimais([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarAnimais();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFiltros({
      ...filtros,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    buscarAnimais();
  }

  function limparFiltros() {
    setFiltros({
      tipo: "",
      raca: "",
      cidade: "",
    });

    setTimeout(() => {
      buscarAnimais();
    }, 0);
  }

  return (
    <PaginaInterna
      titulo="Encontre seu novo amigo"
      descricao="Pesquise pelos animais disponíveis para adoção."
    >
      <form
        className="filtros-formulario"
        onSubmit={handleSubmit}
      >
        <div className="campo-filtro">
          <label htmlFor="tipo">Tipo de animal</label>

          <select
            id="tipo"
            name="tipo"
            value={filtros.tipo}
            onChange={handleChange}
          >
            <option value="">Todos</option>
            <option value="cachorro">Cachorro</option>
            <option value="gato">Gato</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div className="campo-filtro">
          <label htmlFor="raca">Raça</label>

          <input
            id="raca"
            name="raca"
            type="text"
            placeholder="Digite a raça"
            value={filtros.raca}
            onChange={handleChange}
          />
        </div>

        <div className="campo-filtro">
          <label htmlFor="cidade">Cidade</label>

          <input
            id="cidade"
            name="cidade"
            type="text"
            placeholder="Digite a cidade"
            value={filtros.cidade}
            onChange={handleChange}
          />
        </div>

        <div className="botoes-filtro">
          <button
            type="submit"
            className="botao-buscar"
          >
            Buscar
          </button>

          <button
            type="button"
            className="botao-limpar"
            onClick={limparFiltros}
          >
            Limpar
          </button>
        </div>
      </form>

      {carregando && (
        <p className="mensagem-lista">
          Carregando animais...
        </p>
      )}

      {!carregando && mensagem && (
        <p className="mensagem-lista erro">
          {mensagem}
        </p>
      )}

      {!carregando && !mensagem && animais.length === 0 && (
        <p className="mensagem-lista">
          Nenhum animal encontrado.
        </p>
      )}

      {!carregando && animais.length > 0 && (
        <div className="animais-grid">
          {animais.map((animal) => (
            <div className="animal-card" key={animal.id}>
              {animal.imagem ? (
                <img
                  src={animal.imagem}
                  alt={`Foto de ${animal.nome}`}
                  className="animal-imagem"
                />
              ) : (
                <div className="animal-sem-imagem">
                  🐾
                </div>
              )}

              <div className="animal-conteudo">
                <h2>{animal.nome}</h2>

                <p>
                  <strong>Tipo:</strong> {animal.tipo}
                </p>

                <p>
                  <strong>Raça:</strong> {animal.raca}
                </p>

                {animal.idade && (
                  <p>
                    <strong>Idade:</strong> {animal.idade}
                  </p>
                )}

                <p>
                  <strong>Cidade:</strong> {animal.cidade}
                </p>

                <p className="animal-descricao">
                  {animal.descricao}
                </p>

                <Link
                  to={`/animais/${animal.id}`}
                  className="botao-detalhes"
                >
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </PaginaInterna>
  );
}

export default Animais;