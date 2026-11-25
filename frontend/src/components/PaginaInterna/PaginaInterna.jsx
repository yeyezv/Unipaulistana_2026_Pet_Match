import "./PaginaInterna.css";

function PaginaInterna({ titulo, descricao, children }) {
  return (
    <section className="pagina-interna">
      <div className="pagina-container">
        <h1>{titulo}</h1>

        {descricao && <p className="pagina-descricao">{descricao}</p>}

        {children}
      </div>
    </section>
  );
}

export default PaginaInterna;