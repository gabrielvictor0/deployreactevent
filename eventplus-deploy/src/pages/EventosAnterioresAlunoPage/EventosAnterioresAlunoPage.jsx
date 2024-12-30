import React, { useEffect, useState } from "react";
import "./EventosAnterioresAlunoPage.css";
import MainContent from "../../components/MainContent/MainContent";
import Container from "../../components/Container/Container";
import Title from "../../components/Title/Title";
import { useParams } from "react-router-dom";
import api, {
  commentaryListOnly,
  eventsResource,
  eventsTypeResource,
} from "../../Services/Service";

const EventosAnterioresAlunoPage = (e) => {
  //obtendo o idEvento da rota
  const { idEvento } = useParams();

  //states para guardar as informacoes do evento
  const [evento, setEvento] = useState({});
  const [tipoEvento, setTipoEvento] = useState({});
  const [comentarioEvento, setComentarioEvento] = useState([]);
  //chamando as funcoes no useEffect para obter os dados na renderizacao da pagina

  useEffect(() => {
    getEventById();
    getEventType();
    getCommentaryByIdEvent();
  }, []);

  //trazendo as propriedades do evento pelo idEvento obtido pela rota com useParams
  async function getEventById() {
    try {
      const promise = await api.get(`${eventsResource}/${idEvento}`);
      setEvento(promise.data);
      console.log(promise.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getCommentaryByIdEvent() {

    try {
      const promise = await api.get(`${commentaryListOnly}?id=${idEvento}`);
      setComentarioEvento(promise.data);
      console.log(promise.data);
    } catch (error) {

    }


  }

  async function getEventType() {

    try {
      const promiseType = await api.get(
        `${eventsTypeResource}/${evento.idTipoEvento}`
      );
      console.log("aquiiiiiiiiiiiiiii");
      console.log(promiseType.data);
      setTipoEvento(promiseType.data);

    } catch (error) {

    }
  }

  return (
    <>
      <MainContent>
        <Container>
          <Title
            titleText={"Eventos Anteriores"}
            additionalClass="custom-title"
            color=""
          />
          <div>
            <p>{evento.nomeEvento}</p>
            <p>{tipoEvento.titulo}</p>
            <p>{comentarioEvento.descricao}</p>
          </div>
        </Container>
      </MainContent>
    </>
  );
};

export default EventosAnterioresAlunoPage;
