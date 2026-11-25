import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home">
      <section className="banner-home">
        <img
          src="/PET%20MATCH%20HOME.png"
          alt="Pet Match - Encontre um novo amigo"
          className="imagem-banner-home"
        />
      </section>

      <section className="hero">
        <div className="hero-text">
          <h1>Encontre um novo amigo</h1>

          <p>
            O Pet Match conecta pessoas interessadas em adotar
            animais a responsáveis que desejam encontrar um novo lar
            para seus pets.
          </p>

          <div className="hero-buttons">
            <Link
              to="/animais"
              className="hero-button"
            >
              Quero adotar
            </Link>

            <Link
              to="/cadastro"
              className="hero-button botao-secundario"
            >
              Quero cadastrar um pet
            </Link>
          </div>
        </div>
      </section>

      <section className="como-funciona">
        <h2>Como funciona?</h2>

        <div className="cards">
          <div className="card">
            <h3>Encontre um animal</h3>

            <p>
              Pesquise pelos animais disponíveis utilizando filtros.
            </p>
          </div>

          <div className="card">
            <h3>Envie um pedido</h3>

            <p>
              Demonstre seu interesse em adotar um animal.
            </p>
          </div>

          <div className="card">
            <h3>Acompanhe o processo</h3>

            <p>
              Consulte o status do seu pedido de adoção.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;