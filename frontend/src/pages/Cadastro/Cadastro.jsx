import { Link } from "react-router-dom";
import PaginaInterna from "../../components/PaginaInterna/PaginaInterna";

function Cadastro() {
  return (
    <PaginaInterna
      titulo="Criar uma conta"
      descricao="Escolha como você deseja utilizar o Pet Match."
    >
      <div className="opcoes-cadastro">
        <div className="opcao-cadastro">
          <h2>Quero adotar</h2>
          <p>
            Crie uma conta para encontrar animais e enviar pedidos de adoção.
          </p>

          <Link to="/cadastro/adotante">
            Cadastro de adotante
          </Link>
        </div>

        <div className="opcao-cadastro">
          <h2>Quero cadastrar um pet</h2>
          <p>
            Crie uma conta para divulgar um animal que precisa de um novo lar.
          </p>

          <Link to="/cadastro/doador">
            Cadastro de doador
          </Link>
        </div>
      </div>
    </PaginaInterna>
  );
}

export default Cadastro;