import React from "react";
import "./EventosAnterioresAlunoPage.css";
import MainContent from "../../components/MainContent/MainContent";
import Container from "../../components/Container/Container";
import Title from "../../components/Title/Title";


const EventosAnterioresAlunoPage = () => {
  return (
    <>
      <MainContent>
        <Container>
            <Title titleText={"Eventos Anteriores"} additionalClass="custom-title"/>

        </Container>
      </MainContent>
    </>
  );
};

export default EventosAnterioresAlunoPage;
