import { Link } from "react-router-dom";
import PaginaInterna from "../../components/PaginaInterna/PaginaInterna";
import "./Ongs.css";

function ONGs() {
  const ongs = [
    {
      nome: "Asas e Patas",
      imagem: "/images/ongs/ong-asas-patas.png",
      descricao:
        "Projeto dedicado ao resgate, cuidado e encaminhamento de animais para adoção responsável.",
      localizacao: "São Paulo - SP",
      site: "#",
    },
    {
      nome: "Coração Peludo",
      imagem: "/images/ongs/ong-coracao-peludo.png",
      descricao:
        "Organização que oferece proteção e cuidados para cães e gatos em situação de abandono.",
      localizacao: "São Paulo - SP",
      site: "#",
    },
    {
      nome: "Guardiões do Litoral",
      imagem: "/images/ongs/ong-guardioes-litoral.png",
      descricao:
        "Grupo que atua no resgate e na proteção de animais em cidades do litoral.",
      localizacao: "Litoral de São Paulo",
      site: "#",
    },
    {
      nome: "Miaualimentos",
      imagem: "/images/ongs/ong-miaualimentos.png",
      descricao:
        "Projeto que ajuda na arrecadação e distribuição de alimentos para animais resgatados.",
      localizacao: "São Paulo - SP",
      site: "#",
    },
    {
      nome: "Pata Amiga",
      imagem: "/images/ongs/ong-pata-amiga.png",
      descricao:
        "Instituição que busca encontrar novos lares para animais que precisam de uma família.",
      localizacao: "São Paulo - SP",
      site: "#",
    },
    {
      nome: "Peludos em Ação",
      imagem: "/images/ongs/ong-peludos-acao.png",
      descricao:
        "Projeto voltado à conscientização, adoção responsável e bem-estar dos animais.",
      localizacao: "Atuação regional",
      site: "#",
    },
  ];

  return (
    <PaginaInterna
      titulo="ONGs e instituições"
      descricao="Conheça projetos que trabalham pela proteção e pelo bem-estar dos animais."
    >
     

      <div className="ongs-grid">
        {ongs.map((ong) => (
          <article className="ong-card" key={ong.nome}>
            <div className="ong-imagem-container">
              <img
                src={ong.imagem}
                alt={`Arte da ONG ${ong.nome}`}
                className="ong-imagem"
              />
            </div>

            <div className="ong-conteudo">
              <h2>{ong.nome}</h2>

              <p className="ong-localizacao">
                <strong>Localização:</strong>{" "}
                {ong.localizacao}
              </p>

              <p className="ong-descricao">
                {ong.descricao}
              </p>

              {ong.site !== "#" ? (
                <a
                  href={ong.site}
                  target="_blank"
                  rel="noreferrer"
                  className="botao-site-ong"
                >
                  Conhecer instituição
                </a>
              ) : (
                <span className="botao-site-ong botao-indisponivel">
                  Informações em breve
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="aviso-ongs">
        <h2>Importante</h2>

        <p>
          As instituições apresentadas nesta página possuem
          caráter informativo. Para obter informações atualizadas,
          entre em contato diretamente com cada projeto por seus
          canais oficiais.
        </p>

        <Link to="/" className="botao-voltar-ongs">
          Voltar para a página inicial
        </Link>
      </div>
    </PaginaInterna>
  );
}

export default ONGs;