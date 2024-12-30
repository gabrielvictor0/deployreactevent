import React, { useContext, useState } from "react";
import "./Header.css";

import Container from "../Container/Container";
import Nav from "../Nav/Nav";
import PerfilUsuario from "../PerfilUsuario/PerfilUsuario";

import menubar from "../../assets/images/menubar.png";

import logoMobile from "../../assets/images/logo-white.svg";
import logoDesktop from "../../assets/images/logo-pink.svg";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/AuthContext";

const Header = () => {

  const { userData } = useContext(UserContext)

  const [exibeNavbar, setExibeNavbar] = useState(false);//exibe/esconde menu

  return (
    <header className="headerpage">
      <Container>
        <div className="header-flex">
          <img
            src={menubar}
            alt="Imagem menu de barras. Serve para exibir ou esconder o menu no smartphone."
            onClick={() => { setExibeNavbar(true) }}
            className="headerpage__menubar"
          />

          <Link to="/" className="eventlogo">
            <img
              className="eventlogo__logo-image"
              src={window.innerWidth >= 992 ? logoDesktop : logoMobile}
              alt="Event Plus Logo"
            />
          </Link>

          <div className="navbar__items-box-header">
            <Link to="/" className="navbar__item-header" onClick={() => { setExibeNavbar(false); }}>
              Home
            </Link>

            {userData.nome && userData.role === "Administrador" ?
              (
                <>
                  <Link className="navbar__item-header" to="/tipo-eventos" onClick={() => { setExibeNavbar(false); }}>
                    Tipos Evento
                  </Link>

                  <Link className="navbar__item-header" to="/eventos" onClick={() => { setExibeNavbar(false); }}>
                    Eventos
                  </Link>
                </>
              )
              : userData.nome && userData.role === "Comum" ?
                (
                  <Link className="navbar__item-header" to="/eventos-aluno">
                    Eventos
                  </Link>
                )
                : null
            }
          </div>


          <Nav
            exibeNavbar={exibeNavbar}
            setExibeNavbar={setExibeNavbar}
          />

          <PerfilUsuario />
        </div>
      </Container>
    </header>
  );
};

export default Header;
