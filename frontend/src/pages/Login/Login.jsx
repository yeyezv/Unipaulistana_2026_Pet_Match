import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    email: "",
    senha: "",
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

    if (!formulario.email || !formulario.senha) {
      setMensagem("Preencha o e-mail e a senha.");
      setTipoMensagem("erro");
      return;
    }

    try {
      const resposta = await fetch(
        "http://localhost:3001/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formulario),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem || "Erro ao realizar login."
        );
        setTipoMensagem("erro");
        return;
      }

      localStorage.setItem(
        "usuario",
        JSON.stringify(dados.usuario)
      );

      setMensagem("Login realizado com sucesso!");
      setTipoMensagem("sucesso");

      setTimeout(() => {
      window.location.href = "/";
      }, 1000);
    } catch (erro) {
      console.error("Erro no login:", erro);

      setMensagem(
        "Não foi possível conectar ao servidor."
      );
      setTipoMensagem("erro");
    }
  }

  return (
    <section className="login-pagina">
      <div className="login-container">
        <div className="login-texto">
          <h1>Entrar no Pet Match</h1>

          <p>
            Acesse sua conta para encontrar animais ou
            gerenciar seus anúncios.
          </p>
        </div>

        <form
          className="login-formulario"
          onSubmit={handleSubmit}
        >
          <div className="campo-login">
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

          <div className="campo-login">
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

          {mensagem && (
            <p
              className={`mensagem-login ${tipoMensagem}`}
            >
              {mensagem}
            </p>
          )}

          <button
            type="submit"
            className="botao-login"
          >
            Entrar
          </button>

          <p className="link-cadastro">
            Ainda não possui uma conta?
          </p>

          <div className="links-tipos-cadastro">
            <Link to="/cadastro/adotante">
              Cadastro de adotante
            </Link>

            <Link to="/cadastro/doador">
              Cadastro de doador
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;