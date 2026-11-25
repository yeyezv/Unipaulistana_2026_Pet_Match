import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");

    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
  }, []);

  function sair() {
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/");
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img
            src="/logo_petmatch.png"
            alt="Logo Pet Match"
            className="logo-imagem"
          />

          <span>Pet Match</span>
        </Link>

        <nav className="menu">
          <Link to="/">Início</Link>

          <Link to="/animais">
            Quero adotar
          </Link>

          <Link to="/cadastrar-animal">
            Quero cadastrar um pet
          </Link>

          <Link to="/ongs">
            ONGs
          </Link>
        </nav>

        <div className="header-buttons">
          {usuario ? (
            <>
              <span className="nome-usuario">
                Olá, {usuario.nome}
              </span>

              {usuario.tipo_perfil === "adotante" && (
                <Link
                  to="/meus-pedidos"
                  className="link-meus-pedidos"
                >
                  Meus pedidos
                </Link>
              )}

              {usuario.tipo_perfil === "doador" && (
                <>
                  <Link
                    to="/meus-animais"
                    className="link-meus-animais"
                  >
                    Meus animais
                  </Link>

                  <Link
                    to="/pedidos-recebidos"
                    className="link-pedidos-recebidos"
                  >
                    Pedidos recebidos
                  </Link>
                </>
              )}

              <button
                type="button"
                className="botao-sair"
                onClick={sair}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="botao-entrar"
              >
                Entrar
              </Link>

              <Link
                to="/cadastro"
                className="botao-cadastro"
              >
                Cadastre-se
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;