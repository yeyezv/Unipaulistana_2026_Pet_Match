import { useState } from "react";
import { Link } from "react-router-dom";
import "./Cadastro.css";

function CadastroAdotante() {
  const [formulario, setFormulario] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
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

    if (
      !formulario.nome ||
      !formulario.email ||
      !formulario.telefone ||
      !formulario.senha ||
      !formulario.confirmarSenha
    ) {
      setMensagem("Preencha todos os campos.");
      setTipoMensagem("erro");
      return;
    }

    if (formulario.senha !== formulario.confirmarSenha) {
      setMensagem("As senhas não são iguais.");
      setTipoMensagem("erro");
      return;
    }

    try {
      const resposta = await fetch(
        "http://localhost:3001/api/usuarios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: formulario.nome,
            email: formulario.email,
            telefone: formulario.telefone,
            senha: formulario.senha,
            tipo_perfil: "adotante",
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.mensagem || "Erro ao cadastrar usuário.");
        setTipoMensagem("erro");
        return;
      }

      setMensagem("Cadastro realizado com sucesso!");
      setTipoMensagem("sucesso");

      setFormulario({
        nome: "",
        email: "",
        telefone: "",
        senha: "",
        confirmarSenha: "",
      });
    } catch (erro) {
      console.error(erro);

      setMensagem(
        "Não foi possível conectar ao servidor."
      );
      setTipoMensagem("erro");
    }
  }

  return (
    <section className="cadastro-pagina">
      <div className="cadastro-container">
        <div className="cadastro-texto">
          <h1>Cadastro de adotante</h1>

          <p>
            Crie sua conta para encontrar animais disponíveis e enviar
            pedidos de adoção.
          </p>
        </div>

        <form
          className="cadastro-formulario"
          onSubmit={handleSubmit}
        >
          <div className="campo">
            <label htmlFor="nome">Nome completo</label>

            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Digite seu nome"
              value={formulario.nome}
              onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={formulario.email}
              onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label htmlFor="telefone">Telefone</label>

            <input
              id="telefone"
              name="telefone"
              type="tel"
              placeholder="Digite seu telefone"
              value={formulario.telefone}
              onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha</label>

            <input
              id="senha"
              name="senha"
              type="password"
              placeholder="Digite sua senha"
              value={formulario.senha}
              onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label htmlFor="confirmarSenha">
              Confirmar senha
            </label>

            <input
              id="confirmarSenha"
              name="confirmarSenha"
              type="password"
              placeholder="Digite a senha novamente"
              value={formulario.confirmarSenha}
              onChange={handleChange}
            />
          </div>

          {mensagem && (
            <p className={`mensagem-formulario ${tipoMensagem}`}>
              {mensagem}
            </p>
          )}

          <button
            type="submit"
            className="botao-formulario"
          >
            Criar conta
          </button>

          <p className="link-login">
            Já possui uma conta?{" "}
            <Link to="/login">Entrar</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default CadastroAdotante;