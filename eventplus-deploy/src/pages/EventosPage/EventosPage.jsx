import React, { useEffect, useState } from "react";
import Container from "../../components/Container/Container";
import Title from "../../components/Title/Title";
import MainContent from "../../components/MainContent/MainContent";
import ImageIllustrator from "../../components/ImageIllustrator/ImageIllustrator";
import {
  Input,
  Button,
  Select,
} from "../../components/FormComponents/FormComponents";
import Table from "./TableEv/TableEv";
import api, {
  eventsResource,
  eventsTypeResource,
  institutionResource,
} from "../../Services/Service";
import Spinner from "../../components/Spinner/Spinner";
import Notification from "../../components/Notification/Notification";
import { truncateDateFromDb } from "../../Utils/stringFunctions";
import eventoImage from "../../assets/images/tipo-evento.svg";
import "./EventosPage.css";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

export default function EventosPaage(props) {
  //dados do form
  const [nomeEvento, setNomeEvento] = useState("");
  const [descricaoEvento, setDescricaoEvento] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [dataEvento, setDFataEvento] = useState("");
  const [eventos, setEventos] = useState([]);
  const [tiposEvento, setTiposEvento] = useState([]);
  const [instituicao, setInstituicao] = useState();
  const [frmEditData, setFrmEditData] = useState({});

  const [showSpinner, setShowSpinner] = useState(false);

  const [frmEdit, setFrmEdit] = useState(false);
  const [notifyUser, setNotifyUser] = useState({});

  const [showModal, setShowModal] = useState(false)
  const [idToBeDeleted, setIdToBeDeleted] = useState(null)

  useEffect(() => {
    async function loadEventsType() {
      setShowSpinner(true);

      try {
        const promise = await api.get(eventsResource);
        const promiseTipoEventos = await api.get(eventsTypeResource);
        const promiseInstituicao = await api.get(institutionResource);

        setEventos(promise.data);

        const tpEventosModificado = [];

        promiseTipoEventos.data.forEach((event) => {
          tpEventosModificado.push({ value: event.idTipoEvento, text: event.titulo });
        });

        setTiposEvento(tpEventosModificado);
        setInstituicao(promiseInstituicao.data[0].idInstituicao);
        console.log(promiseTipoEventos.data);

      } catch (error) { }
      setShowSpinner(false);
    }

    loadEventsType();
  }, [frmEdit]);

  // UPDATE
  function editActionAbort() {
    setFrmEdit(false);
    setFrmEditData({});
  }

  async function showUpdateForm(evento) {
    setFrmEditData(evento);
    setFrmEdit(true);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setShowSpinner(true);

    try {
      const promise = await api.put(
        `${eventsResource}/${frmEditData.idEvento}`,
        {
          nomeEvento: frmEditData.nomeEvento,
          dataEvento: frmEditData.dataEvento,
          descricao: frmEditData.descricao,
          idInstituicao: frmEditData.idInstituicao,
          idTipoEvento: frmEditData.idTipoEvento,
        }
      );

      if (promise.status === 204) {
        setNotifyUser({
          titleNote: "Sucesso",
          textNote: `Atualizado com sucesso! (${frmEditData.nomeEvento})`,
          imgIcon: "success",
          imgAlt:
            "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
          showMessage: true,
        });

        const buscaEventos = await api.get(eventsResource);
        setEventos(buscaEventos.data);
      } else {
        setNotifyUser({
          titleNote: "Erro",
          textNote: `Problemas ao atualizar, contate o admnistrador do sistema)`,
          imgIcon: "danger",
          imgAlt:
            "Imagem de ilustração de atenção. Mulher ao lado do símbolo de exclamação",
          showMessage: true,
        });
      }
    } catch (error) {
      setNotifyUser({
        titleNote: "Erro",
        textNote: `Problemas ao atualizar os dados na tela ou no banco`,
        imgIcon: "danger",
        imgAlt:
          "Imagem de ilustração de atenção. Mulher ao lado do símbolo de exclamação",
        showMessage: true,
      });

      throw new Error(
        "O servidor bitolou, verifique se o Evento foi atualizado corretamente"
      );
    }

    setShowSpinner(false);
    setFrmEditData({});
    setFrmEdit(false);
    return;
  }

  // DELETE
  async function handleDelete(idElemento) {
    setShowSpinner(true);
    try {
      const promise = await api.delete(`${eventsResource}/${idElemento}`);

      if (promise.status === 204) {
        setNotifyUser({
          titleNote: "Sucesso!",
          textNote: "Evento excluído com sucesso!",
          imgIcon: "success",
          imgAlt:
            "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
          showMessage: true,
        });

        const buscaEventos = await api.get(eventsResource);

        setEventos(buscaEventos.data);
      } else {
        setNotifyUser({
          titleNote: "Erro",
          textNote: `O servidor bitolou, verifique se o Evento foi apagado corretamente`,
          imgIcon: "danger",
          imgAlt:
            "Imagem de ilustração de atenção. Mulher ao lado do símbolo de exclamação",
          showMessage: true,
        });
        throw new Error(
          "O servidor bitolou, verifique se o Evento foi apagado corretamente"
        );
      }
    } catch (error) {
      setNotifyUser({
        titleNote: "Erro",
        textNote: `Problemas ao apagar`,
        imgIcon: "danger",
        imgAlt:
          "Imagem de ilustração de atenção. Mulher ao lado do símbolo de exclamação",
        showMessage: true,
      });
      throw new Error(`Problemas ao apagar: ${error}`);
    }
    setShowSpinner(false);
  }

  //SUBMIT FORM - Cadastrar evento
  async function handleSubmit(e) {
    e.preventDefault();
    setShowSpinner(true);
    // Validação dos campos
    if (
      nomeEvento.trim().length === 0 ||
      descricaoEvento.trim().length === 0 ||
      tipoEvento.trim().length === 0 ||
      dataEvento.trim().length === 0
    ) {
      setNotifyUser({
        titleNote: "Atenção",
        textNote: "Preencha os campos corretamente",
        imgIcon: "warning",
        imgAlt:
          "Imagem de ilustração de atenção. Mulher ao lado do símbolo de exclamação",
        showMessage: true,
      });
      setShowSpinner(false);
      return;
    }

    // console.log("teste");
    try {
      // const promise = await api.post(`/Eventos`, {
      await api.post(eventsResource, {
        nomeEvento,
        dataEvento,
        descricao: descricaoEvento,
        idInstituicao: instituicao, //por enquanto chumbado
        idTipoEvento: tipoEvento,
      });
      // setFrmEditData({});//limpa os dados do formulário
      const newListEvents = await api.get(eventsResource);
      setEventos(newListEvents.data);
      setNotifyUser({
        titleNote: "Sucesso",
        textNote: `Evento ( ${nomeEvento} ) cadastrado com sucesso!`,
        imgIcon: "success",
        imgAlt:
          "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
        showMessage: true,
      });
      setNomeEvento("");
      setDescricaoEvento("");
      setTipoEvento("");
      setDFataEvento("");
    } catch (error) {
      setNotifyUser({
        titleNote: "Erro",
        textNote: `Deu ruim ao cadastrar!!: ${error}`,
        imgIcon: "danger",
        imgAlt:
          "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
        showMessage: true,
      });
    }

    setShowSpinner(false);
  }

  /**
   * Esta função faz um DE/PARA no array de tipos de eventos vindo do banco de dados.
   * idInstituicao vira value
   * titulo vira o texto
   *
   * @param {[{}]} arrEvents
   * @returns array
   */

  function fromToEventType(arrEvents) {
    // console.log(arrEvents);
    if (arrEvents.length === 0) return [];

    const arrAux = [];

    arrEvents.forEach((event) => {
      arrAux.push({ value: event.idTipoEvento, text: event.titulo });
    });

    return arrAux;
  }

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize)
  }, [])

  return (
    <>
      
      <MainContent>
        <section className="cadastro-evento-section">
          <Container>
            <div className="cadastro-evento__box">
              <Title titleText={"Eventos"} />

              <ImageIllustrator
                imageName="evento"
                imageRender={eventoImage}
                altText="Imagem de Ilustrativa para o cadastro de tipos de eventos - duas pessoas construindo uma parte de um todo!"
              />

              <form
                className="ftipo-evento"
                onSubmit={frmEdit ? handleUpdate : handleSubmit}
              >
                {/* cadastrar ou atualizar */}
                {!frmEdit ? (
                  <>
                    {/* cadastrar */}
                    {/* 
                      sugestão: trocar por um único formulário 
                      utilizando apenas frmEditData e formatação condicional para os botões
                      ainda utilizando frmEdit
                    */}
                    <Input
                      type="text"
                      required={true}
                      id="nome"
                      name="nome"
                      placeholder="Nome"
                      value={nomeEvento}
                      manipulationFunction={(e) =>
                        setNomeEvento(e.target.value)
                      }
                    />

                    <Input
                      type="text"
                      required={true}
                      id="descricao"
                      name="descricao"
                      placeholder="Descrição"
                      value={descricaoEvento}
                      manipulationFunction={(e) =>
                        setDescricaoEvento(e.target.value)
                      }
                    />

                    <Select
                      id="tipo-evento"
                      name="tipo-evento"
                      required={true}
                      options={tiposEvento} // aqui o array dos tipos
                      manipulationFunction={(e) =>
                        setTipoEvento(e.target.value)
                      } // aqui só a variável state
                      defaultValue={tipoEvento}
                    />

                    <Input
                      type="date"
                      required={true}
                      id="dataEvento"
                      name="dataEvento"
                      placeholder="Data do Evento"
                      value={dataEvento}
                      manipulationFunction={(e) =>
                        setDFataEvento(e.target.value)
                      }
                    />

                    <Button
                      name="cadastrar"
                      id="cadastrar"
                      textButton="Cadastrar"
                      additionalClass="btn-cadastrar"
                    />
                  </>
                ) : (
                  <>
                    {/* editar */}
                    <Input
                      type="text"
                      required={true}
                      id="nome"
                      name="nome"
                      placeholder="Nome Evento"
                      value={frmEditData.nomeEvento}
                      manipulationFunction={(e) => {
                        setFrmEditData({
                          ...frmEditData,
                          nomeEvento: e.target.value,
                        });
                      }}
                    />
                    <Input
                      type="text"
                      required={true}
                      id="descricao"
                      name="descricao"
                      placeholder="Descrição"
                      value={frmEditData.descricao}
                      manipulationFunction={(e) => {
                        setFrmEditData({
                          ...frmEditData,
                          descricao: e.target.value,
                        });
                      }}
                    />

                    <Select
                      id="tipo-evento"
                      name="tipo-evento"
                      required={true}
                      options={tiposEvento}
                      defaultValue={frmEditData.idTipoEvento}
                      manipulationFunction={(e) => {
                        setFrmEditData({
                          ...frmEditData,
                          idTipoEvento: e.target.value,
                        });
                      }}
                    />

                    <Input
                      type="date"
                      required={true}
                      id="dataEvento"
                      name="dataEvento"
                      placeholder="Data do Evento"
                      value={truncateDateFromDb(frmEditData.dataEvento)}
                      // value="2023-01-05"
                      manipulationFunction={(e) => {
                        setFrmEditData({
                          ...frmEditData,
                          dataEvento: e.target.value,
                        });
                      }}
                    />

                    {/* botões de ação */}
                    <div className="buttons-editbox">
                      <Button
                        name="atualizar"
                        id="atualizar"
                        textButton="Atualizar"
                        additionalClass="button-component--middle"
                      />
                      <Button
                        name="cancelar"
                        id="cancelar"
                        textButton="Cancelar"
                        type="reset"
                        manipulationFunction={() => {
                          editActionAbort();
                        }}
                        additionalClass="button-component--middle"
                      />
                    </div>
                  </>
                )}
              </form>
            </div>
          </Container>
        </section>

        {/* Listagem de tipo de eventos */}
        <section className="lista-eventos-section">
          <Container>
            <Title titleText={"Lista de Eventos"} color="white" />
            <Table
              dados={eventos}
              fnDelete={handleDelete}
              fnUpdate={showUpdateForm}
              setShowModal={setShowModal}
              setIdToBeDeleted={setIdToBeDeleted}
            />
          </Container>
        </section>
      </MainContent>

      {/* SPINNER -Feito com position */}
      {showSpinner ? <Spinner /> : null}

      {/* CARD NOTIFICATION */}
      {<Notification {...notifyUser} setNotifyUser={setNotifyUser} />}

      {
        showModal ?
          (
            <ConfirmationModal
              txt={"Deseja confirmar a exclusão do evento?"}
              page={"adm-event"}
              setShowModal={setShowModal}
              idToBeDeleted={idToBeDeleted}
              fnDelete={handleDelete}
            />
          ) :
          null
      }
    </>
  );
}
