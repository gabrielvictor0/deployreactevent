import React, { useContext, useEffect, useState } from "react";
import MainContent from "../../components/MainContent/MainContent";
import Title from "../../components/Title/Title";
import Table from "./TableEvA/TableEvA";
import Container from "../../components/Container/Container";
import { Select } from "../../components/FormComponents/FormComponents";
import Spinner from "../../components/Spinner/Spinner";
import Modal from "../../components/Modal/Modal";
import api, {
  eventsResource,
  myEventsResource,
  presencesEventResource,
  commentaryEventResource,
  commentaryEventResourceIA,
} from "../../Services/Service";

import "./EventosAlunoPage.css";
import { UserContext } from "../../context/AuthContext";
import Notification from "../../components/Notification/Notification";

const EventosAlunoPage = () => {
  

  const [eventos, setEventos] = useState([]);
  
  const quaisEventos = [
    { value: 1, text: "Todos os eventos" },
    { value: 2, text: "Meus eventos" },
  ];

  const [tipoEvento, setTipoEvento] = useState("1"); //código do tipo do Evento escolhido
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // recupera os dados globais do usuário
  const { userData } = useContext(UserContext);
  const [comentario, setComentario] = useState("");
  const [idEvento, setIdEvento] = useState("");
  const [idComentario, setIdComentario] = useState(null);

  const [notifyUser, setNotifyUser] = useState({})

  useEffect(() => {
    loadEventsType();
  }, [tipoEvento, userData.userId]); //

  async function loadEventsType() {
    setShowSpinner(true);

    if (tipoEvento === "1") {

      try {
        const todosEventos = await api.get(eventsResource);
        const meusEventos = await api.get(
          `${myEventsResource}/${userData.userId}`
        );

        const eventosMarcados = verificaPresenca(
          todosEventos.data,
          meusEventos.data
        );

        setEventos(eventosMarcados);
      } catch (error) {

        console.log("Erro na API");
        console.log(error);
      }
    } else if (tipoEvento === "2") {

      try {
        const retornoEventos = await api.get(
          `${myEventsResource}/${userData.userId}`
        );

        const arrEventos = [];

        retornoEventos.data.forEach((e) => {
          arrEventos.push({
            ...e.evento,
            situacao: e.situacao,
            idPresencaEvento: e.idPresencaEvento,
          });
        });

        setEventos(arrEventos);
      } catch (error) {

        console.log("Erro na API");
        console.log(error);
      }
    } else {
      setEventos([]);
    }
    setShowSpinner(false);
  }
  const verificaPresenca = (arrAllEvents, eventsUser) => {
    for (let x = 0; x < arrAllEvents.length; x++) {

      for (let i = 0; i < eventsUser.length; i++) {

        if (arrAllEvents[x].idEvento === eventsUser[i].evento.idEvento) {
          arrAllEvents[x].situacao = true;
          arrAllEvents[x].idPresencaEvento = eventsUser[i].idPresencaEvento;
          break;
        }
      }
    }
    return arrAllEvents;
  };


  function myEvents(tpEvent) {
    setTipoEvento(tpEvent);
  }

  const showHideModal = (idEvent) => {
    setShowModal(showModal ? false : true);
    setIdEvento(idEvent);
  };

  const loadMyCommentary = async (idUsuario, idEvento) => {
    try {
      const promise = await api.get(
        `${commentaryEventResource}?idUsuario=${idUsuario}&idEvento=${idEvento}`
      );

      const myComm = await promise.data.filter(
        (comm) => comm.idEvento === idEvento && comm.idUsuario === idUsuario
      );

      setComentario(myComm.length > 0 ? myComm[0].descricao : "");
      setIdComentario(myComm.length > 0 ? myComm[0].idComentarioEvento : null);
    } catch (error) {
      console.log("Erro ao carregar o evento");
      console.log(error);
    }
  };

  const postMyCommentary = async (descricao, idUsuario, idEvento) => {
    try {
      const promise = await api.post(commentaryEventResourceIA, {
        descricao: descricao,
        idUsuario: idUsuario,
        idEvento: idEvento,
      });

      if (promise.status === 200) {
        alert("Comentário cadastrado com sucesso");
      }
    } catch (error) {
      console.log("Erro ao cadastrar o evento");
      console.log(error);
    }
  };

  const commentaryRemove = async (idComentario) => {
    try {
      const promise = await api.delete(
        `${commentaryEventResource}/${idComentario}`
      );
      if (promise.status === 200) {
        alert("Evento excluído com sucesso!");
      }
    } catch (error) {
      console.log("Erro ao excluir ");
      console.log(error);
    }
  };

  async function handleConnect(eventId, whatTheFunction, presencaId = null) {
    if (whatTheFunction === "connect") {
      try {

        const promise = await api.post(presencesEventResource, {
          situacao: true,
          idUsuario: userData.userId,
          idEvento: eventId,
        });

        if (promise.status === 201) {
          loadEventsType();

          setNotifyUser({
            titleNote: "Sucesso!",
            textNote: `Presença confirmada com sucesso!`,
            imgIcon: "success",
            imgAlt:
            "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
            showMessage: true,
          });
        }
      } catch (error) { }
      return;
    }

    try {
      const unconnected = await api.delete(
        `${presencesEventResource}/${presencaId}`
      );
      if (unconnected.status === 204) {
        loadEventsType();
        setNotifyUser({
          titleNote: "Sucesso!",
          textNote: `Presença cancelada com sucesso!`,
          imgIcon: "success",
          imgAlt:
          "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
          showMessage: true,
        });

      }
    } catch (error) {
      console.log("Erro ao desconecar o usuário do evento");
      console.log(error);
    }
  }

  return (
    <>
      <MainContent>
        <Container>
          <Title titleText={"Eventos"} additionalClass="custom-title" />

          <Select
            id="id-tipo-evento"
            name="tipo-evento"
            required={true}
            options={quaisEventos} // aqui o array dos tipos
            manipulationFunction={(e) => myEvents(e.target.value)} // aqui só a variável state
            defaultValue={tipoEvento}
            additionalClass="select-tp-evento"
          />
          <Table
            dados={eventos}
            fnConnect={handleConnect}
            fnShowModal={showHideModal}
            setNotifyUser={setNotifyUser}
          />
        </Container>
      </MainContent>

      {<Notification {...notifyUser} setNotifyUser={setNotifyUser} />}

      {showSpinner ? <Spinner /> : null}

      {showModal ?
        (<Modal
          showHideModal={showHideModal}
          fnGet={loadMyCommentary}
          fnPost={postMyCommentary}
          fnDelete={commentaryRemove}
          comentaryText={comentario}
          userId={userData.userId}
          idEvento={idEvento}
          idComentario={idComentario}
        />)
        : null
      }
    </>
  );
};

export default EventosAlunoPage;
