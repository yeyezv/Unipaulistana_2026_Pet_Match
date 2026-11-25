import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import CadastroAdotante from "./pages/Cadastro/CadastroAdotante";
import CadastroDoador from "./pages/Cadastro/CadastroDoador";
import Animais from "./pages/Animais/Animais";
import DetalhesAnimal from "./pages/DetalhesAnimal/DetalhesAnimal";
import CadastroAnimal from "./pages/CadastroAnimal/CadastroAnimal";
import MeusAnimais from "./pages/MeusAnimais/MeusAnimais";
import MeusPedidos from "./pages/MeusPedidos/MeusPedidos";
import Ongs from "./pages/Ongs/Ongs";
import EditarAnimal from "./pages/EditarAnimal/EditarAnimal";
import PedidosRecebidos from "./pages/PedidosRecebidos/PedidosRecebidos";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Header />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/cadastro" element={<Cadastro />} />
            <Route
              path="/cadastro/adotante"
              element={<CadastroAdotante />}
            />
            <Route
              path="/cadastro/doador"
              element={<CadastroDoador />}
            />

            <Route path="/animais" element={<Animais />} />
            <Route
              path="/animais/:id"
              element={<DetalhesAnimal />}
            />

            <Route
              path="/cadastrar-animal"
              element={<CadastroAnimal />}
            />

            <Route
              path="/meus-animais"
              element={<MeusAnimais />}
            />

            <Route
              path="/meus-pedidos"
              element={<MeusPedidos />}
            />

            <Route path="/ongs" element={<Ongs />} />

            <Route
              path="/editar-animal/:id"
              element={<EditarAnimal />}
            />

            <Route
              path="/pedidos-recebidos"
              element={<PedidosRecebidos />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;