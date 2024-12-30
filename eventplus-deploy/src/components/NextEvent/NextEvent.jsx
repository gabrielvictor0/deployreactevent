import React, { useEffect, useState } from "react";
import "./NextEvent.css";

import { Tooltip } from "react-tooltip";

// importar a função lá do arquivo stringFunction (destructuring)
import { dateFormatDbToView } from "../../Utils/stringFunctions";
import api, { myEventsResource, presencesEventGetById, presencesEventResource } from "../../Services/Service";
import { useContext } from "react";
import { UserContext } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const NextEvent = ({ title, description, eventDate, idEvent, setShowModal, setNotifyUser, setIdEventConf, confirm }) => {

  const { userData } = useContext(UserContext)

  const navigate = useNavigate()

  const [presenceEvent, setPresenceEvent] = useState(null)
  const [txt, setTxt] = useState('Conectar')

  const location = useLocation()

  async function GetPresence() {

    try {
      if (userData.userId != undefined) {
        const response = await api.get(`${myEventsResource}/${userData.userId}`)

        for (let presence of response.data) {
          if (presence.idEvento == idEvent) {
            setTxt('Conectado')
          }
        }
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    GetPresence()
  }, [])

  useEffect(() => {
    if (confirm.presence === true && confirm.id === idEvent) {
      setTxt('Conectado')
    }
  }, [confirm])

  useEffect(() => {
    console.log("dados usuario", userData);

  }, [userData])

  return (
    <article className="event-card">
      <h2
        className="event-card__title"
        data-tooltip-id={idEvent}
        data-tooltip-content={title}
        data-tooltip-place="top"
      >
        {
          title.length > 15 ?
            (
              <>
                <Tooltip id={idEvent} className='tooltip' />
                {title.substr(0, 15)}...
              </>
            )
            :
            (
              <>
                {title}
              </>

            )
        }

      </h2>

      <p
        className="event-card__description"
        data-tooltip-id={idEvent}
        data-tooltip-content={description}
        data-tooltip-place="top"
      >
        {
          description.length > 15 ?
            (
              <>
                <Tooltip id={idEvent} className='tooltip' />
                {description.substr(0, 15)} ...
              </>
            )
            :
            (
              <>
                {description}
              </>
            )

        }
      </p>

      {
        userData.role === "Administrador"
          ?
          <p className="event-card__description-adm">
            {dateFormatDbToView(eventDate)}
          </p>
          : <p className="event-card__description">
            {dateFormatDbToView(eventDate)}
          </p>
      }


      {
        userData.role == "Comum" || userData.role === undefined ?
          <>
            {
              Object.keys(userData).length !== 0 ?
                <>
                  {
                    txt === "Conectado"
                      ?
                      <a className="event-card__connect-link">
                        {txt}
                      </a>

                      : <a
                        onClick={() => {
                          setIdEventConf(idEvent);
                          setShowModal(presenceEvent ? false : true)
                        }}
                        className="event-card__connect-link"
                      >
                        {txt}
                      </a>
                  }
                </>
                :
                <>
                  <a
                    onClick={() => {
                      navigate('/login')
                    }}
                    className="event-card__connect-link"
                  >
                    Conectar
                  </a>
                </>
            }
          </>
          : null
      }

    </article>
  );
};

export default NextEvent;
