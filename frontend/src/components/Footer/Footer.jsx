import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <img
              src="/logo_petmatch.png"
              alt="Logo Pet Match"
              className="footer-logo-imagem"
            />

            <h2>Pet Match</h2>
          </div>

          <p>
            Somos uma plataforma que une pessoas apaixonadas por
            animais, oferecendo um espaço seguro e prático para
            adoção e doação de pets. Nosso objetivo é garantir que
            cada bichinho encontre um lar cheio de amor e cuidado.
            Junte-se a nós nessa missão de transformar vidas!
          </p>
        </div>

        <div className="footer-column">
          <h3>Navegação</h3>

          <Link to="/">Início</Link>

          <Link to="/animais">
            Quero adotar
          </Link>

          <Link to="/cadastrar-animal">
            Cadastrar um pet
          </Link>
        </div>

        <div className="footer-column">
          <h3>Informações</h3>

          <Link to="/ongs">
            ONGs
          </Link>

          <Link to="/login">
            Entrar
          </Link>

          <Link to="/cadastro">
            Cadastre-se
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Pet Match.</p>
      </div>
    </footer>
  );
}

export default Footer;