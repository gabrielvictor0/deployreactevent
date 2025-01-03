import React, { useContext } from "react";
import "./Nav.css";

import logoMobile from "../../assets/images/logo-white.svg";
import logoDesktop from "../../assets/images/logo-pink.svg";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/AuthContext";

const Nav = ({ exibeNavbar, setExibeNavbar }) => {
  const { userData } = useContext(UserContext);

  return (
    <nav className={`navbar ${exibeNavbar ? "exibeNavbar" : ""}`}>
      <span
        className="navbar__close"
        onClick={() => {
          setExibeNavbar(false);
        }}
      >
        x
      </span>

      <Link to="/" className="eventlogo">
        <img
          className="eventlogo__logo-image"
          src={window.innerWidth >= 992 ? logoDesktop : logoMobile}
          alt="Event Plus Logo"
        />
      </Link>

      <div className="navbar__items-box">
        <Link to="/" className="navbar__item" onClick={() => { setExibeNavbar(false); }}>
          Home
        </Link>

        {userData.nome && userData.role === "Administrador" ?
          (
            <>
              <Link className="navbar__item" to="/tipo-eventos" onClick={() => { setExibeNavbar(false); }}>
                Tipos Evento
              </Link>

              <Link className="navbar__item" to="/eventos" onClick={() => { setExibeNavbar(false); }}>
                Eventos
              </Link>
            </>
          )
          : userData.nome && userData.role === "Comum" ?
            (
              <Link className="navbar__item" to="/eventos-aluno" onClick={() => { setExibeNavbar(false);}}>
                Eventos
              </Link>
            )
            : null
        }

      </div>
    </nav>
  );
};

export default Nav;
