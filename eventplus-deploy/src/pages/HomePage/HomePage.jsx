import React, { useContext, useEffect, useState } from "react";
import "./HomePage.css";

import Banner from "../../components/Banner/Banner";
import MainContent from "../../components/MainContent/MainContent";
import VisionSection from "../../components/VisionSection/VisionSection";
import ContactSection from "../../components/ContactSection/ContactSection";
import Title from "../../components/Title/Title";
import NextEvent from "../../components/NextEvent/NextEvent";
import Container from "../../components/Container/Container";
import api, { pastEventsResource } from "../../Services/Service";
import Notification from "../../components/Notification/Notification";
import { nextEventResource } from "../../Services/Service";
import PastEvents from "../../components/PastEvents/PastEvents";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { UserContext } from "../../context/AuthContext";

const HomePage = () => {
  const [nextEvents, setNextEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  const [notifyUser, setNotifyUser] = useState();
  const [showModal, setShowModal] = useState(false);
  const [idEventConf, setIdEventConf] = useState(null)
  const [confirm, setConfirm] = useState(false)

  const { userData } = useContext(UserContext)

  useEffect(() => {
    async function getNextEvents() {
      try {
        const promise = await api.get(nextEventResource);
        const dados = await promise.data;
        setNextEvents(dados);

      } catch (error) {
        console.log("não trouxe os próximos eventos, verifique lá!");
        // setNotifyUser({
        //   titleNote: "Erro",
        //   textNote: `Não foi possível carregar os próximos eventos. Verifique a sua conexão com a internet`,
        //   imgIcon: "danger",
        //   imgAlt:
        //   "Imagem de ilustração de erro. Rapaz segurando um balão com símbolo x.",
        //   showMessage: true,
        // });
      }
    }

    async function getPastEvents() {
      try {
        const promise = await api.get(pastEventsResource);
        const dados = await promise.data;
        setPastEvents(dados);
      } catch (error) {
        console.log("Deu erro na api");
      }
    }

    getPastEvents();
    getNextEvents(); //chama a função

    console.log("effect userdata");

  }, [userData]);

  return (
    <MainContent>
      {<Notification {...notifyUser} setNotifyUser={setNotifyUser} />}
      <Banner />

      <section className="proximos-eventos">
        <Container>
          <Title titleText={"Próximos Eventos"} />



          <div className="events-box">
            {
              nextEvents.length > 0 ?
                (
                  nextEvents.map((e) => {
                    return (
                      <NextEvent
                        key={e.idEvento}
                        title={e.nomeEvento}
                        description={e.descricao}
                        eventDate={e.dataEvento}
                        idEvent={e.idEvento}
                        setShowModal={setShowModal}
                        setIdEventConf={setIdEventConf}
                        setNotifyUser={setNotifyUser}
                        confirm={confirm}
                      />
                    );
                  })
                )
                :
                (
                  <div style={{ width: '100vw', display: 'flex', justifyContent: 'center' }}>
                    <p>Nenhum evento próximo</p>
                  </div>
                )
            }
          </div>


        </Container>
      </section>




      <section className="proximos-eventos">
        <Container>
          <Title
            titleText={"Eventos Anteriores"}
            additionalClass="title-past-event"
          />
          <div className="events-box">
            {pastEvents.map((e) => {
              return (
                <PastEvents
                  key={e.idEvento}
                  title={e.nomeEvento}
                  description={e.descricao}
                  eventDate={e.dataEvento}
                  idEvent={e.idEvento}
                  buttonLink={`/detalhes-evento/${e.idEvento}`}
                />
              );
            })}
          </div>
        </Container>
      </section>

      <VisionSection />
      <ContactSection />

      {
        showModal ?
          (
            <ConfirmationModal
              setNotifyUser={setNotifyUser}
              setShowModal={setShowModal}
              idEvent={idEventConf}
              setConfirm={setConfirm}
              page={"home"}
              txt={"Deseja confirmar sua presença no evento?"}
            />
          )
          : null
      }
    </MainContent>
  );
};

export default HomePage;
