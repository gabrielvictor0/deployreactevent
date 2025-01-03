import React, { useEffect, useState } from "react";
import "./TipoEventosPage.css";
import Title from "../../components/Title/Title";
import MainContent from "../../components/MainContent/MainContent";
import Container from "../../components/Container/Container";
import ImageIllustrator from "../../components/ImageIllustrator/ImageIllustrator";
import TableTp from "./TableTp/TableTp";
import tipoEventoImage from "../../assets/images/tipo-evento.svg";
import { Input, Button } from "../../components/FormComponents/FormComponents";
import api, { eventsTypeResource } from "../../Services/Service";
import Notification from "../../components/Notification/Notification";
import Spinner from "../../components/Spinner/Spinner";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const TipoEventosPage = () => {

  // states
  const [frmEdit, setFrmEdit] = useState(false); //está em modo edição?
  const [titulo, setTitulo] = useState("");
  const [idEvento, setIdEvento] = useState(null); //para editar, por causa do evento!
  const [tipoEventos, setTipoEventos] = useState([]); //array
  const [notifyUser, setNotifyUser] = useState(); //Componente Notification
  const [showSpinner, setShowSpinner] = useState(false); //Spinner Loading

  const [showModal, setShowModal] = useState(false)
  const [idToBeDeleted, setIdToBeDeleted] = useState(null)

  useEffect(() => {
    // define a chamada em nossa api
    async function loadEventsType() {
      setShowSpinner(true);

      try {
        const retorno = await api.get(eventsTypeResource);
        setTipoEventos(retorno.data);
        console.log(retorno.data);
      } catch (error) {
        console.log("Erro na api");
        console.log(error);
      }

      setShowSpinner(false);
    }

    loadEventsType();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setShowSpinner(true);

    if (titulo.trim().length < 3) {
      setNotifyUser({
        titleNote: "Aviso",
        textNote: `O título deve ter pelo menos 3 caracteres`,
        imgIcon: "warning",
        imgAlt:
          "Imagem de ilustração de aviso. Moça em frente a um símbolo de exclamação!",
        showMessage: true,
      });
      return;
    }

    try {
      const response = await api.post(eventsTypeResource, {
        titulo: titulo,
      });

      
      
      if(response.status === 201)
      {
        setTitulo("");

        setNotifyUser({
          titleNote: "Sucesso!",
          textNote: `Tipo de evento cadastrado com sucesso!`,
          imgIcon: "success",
          imgAlt:
            "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
          showMessage: true,
        });
      }
      
      const buscaEventos = await api.get(eventsTypeResource);
      setTipoEventos(buscaEventos.data); 

    } catch (error) {
      setNotifyUser({
        titleNote: "Erro",
        textNote: `Erro na operação. Verifique a conexão com a internet`,
        imgIcon: "danger",
        imgAlt:
          "Imagem de ilustração de erro. Rapaz segurando um balão com símbolo x.",
        showMessage: true,
      });
    }

    setShowSpinner(false);
  }

  async function showUpdateForm(idElement) {
    setFrmEdit(true);
    setIdEvento(idElement);
    setShowSpinner(true);
    try {
      const retorno = await api.get(`${eventsTypeResource}/${idElement}`);
      setTitulo(retorno.data.titulo);
      console.log(retorno.data);
    } catch (error) { }
    setShowSpinner(false);
  }
  
  function editActionAbort() {
    setFrmEdit(false);
    setTitulo(""); 
    setIdEvento(null);
  }

  async function handleUpdate(e) {
    e.preventDefault(); 
    setShowSpinner(true);

    try {
      const retorno = await api.put(eventsTypeResource + "/" + idEvento, {
        titulo: titulo
      }); 


      if (retorno.status === 204) {
        setNotifyUser({
          titleNote: "Sucesso",
          textNote: `Cadastro atualizado com sucesso!`,
          imgIcon: "success",
          imgAlt:
            "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
          showMessage: true,
        });

        const retorno = await api.get(eventsTypeResource);
        setTipoEventos(retorno.data);

        editActionAbort();
      }
    } catch (error) {
      setNotifyUser({
        titleNote: "Erro",
        textNote: `Erro na operação. Por favor verifique a conexão!`,
        imgIcon: "danger",
        imgAlt:
          "Imagem de ilustração de erro. Rapaz segurando um balão com símbolo x.",
        showMessage: true,
      });
    }

    setShowSpinner(false);
  }

  async function handleDelete(idElement) {
    setShowSpinner(true);
    try {
      const promise = await api.delete(`${eventsTypeResource}/${idElement}`);

      if (promise.status === 204) {
        setNotifyUser({
          titleNote: "Sucesso",
          textNote: `Cadastro excluído com sucesso!`,
          imgIcon: "success",
          imgAlt:
            "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
          showMessage: true,
        });

        const buscaEventos = await api.get(eventsTypeResource);
        setTipoEventos(buscaEventos.data);
      }
    } catch (error) {
      alert("Problemas ao apagar o elemento!");
    }
    setShowSpinner(false);
  }

  return (
    <>
      {<Notification {...notifyUser} setNotifyUser={setNotifyUser} />}

      {showSpinner ? <Spinner /> : null}

      <MainContent>
        <section className="cadastro-evento-section">
          <Container>
            <div className="cadastro-evento__box">
              <Title titleText={"Cadastro Tipo de Eventos"} />

              <ImageIllustrator imageRender={tipoEventoImage} />

              <form
                className="ftipo-evento"
                onSubmit={frmEdit ? handleUpdate : handleSubmit}
              >
                {/* cadastrar ou editar? */}
                {!frmEdit ? (
                  // Cadastrar
                  <>
                    <Input
                      id="Titulo"
                      placeholder="Título"
                      name={"titulo"}
                      type={"text"}
                      required={"required"}
                      value={titulo}
                      manipulationFunction={(e) => {
                        setTitulo(e.target.value);
                      }}
                    />
                    <Button
                      textButton="Cadastrar"
                      id="cadastrar"
                      name="cadastrar"
                      type="submit"
                    />
                  </>
                ) : (
                  // Editar
                  <>
                    <Input
                      id="Titulo"
                      placeholder="Título"
                      name={"titulo"}
                      type={"text"}
                      required={"required"}
                      value={titulo}
                      manipulationFunction={(e) => {
                        setTitulo(e.target.value);
                      }}
                    />
                    <div className="buttons-editbox">
                      <Button
                        textButton="Atualizar"
                        id="atualizar"
                        name="atualizar"
                        type="submit"
                        additionalClass="button-component--middle"
                      />
                      <Button
                        textButton="Cancelar"
                        id="cancelar"
                        name="cancelar"
                        type="button"
                        manipulationFunction={editActionAbort}
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
            <Title titleText={"Lista Tipo de Eventos"} color="white" />

            <TableTp
              dados={tipoEventos}
              fnUpdate={showUpdateForm}
              fnDelete={handleDelete}
              setIdToBeDeleted={setIdToBeDeleted}
              setShowModal={setShowModal}
            />
          </Container>
        </section>
      </MainContent>

      {
        showModal
          ?
          (<ConfirmationModal
            page={"adm-type-event"}
            txt={"Deseja confirmar a exclusão do tipo de evento? todos os eventos com este tipo também serão excluídos"}
            idToBeDeleted={idToBeDeleted}
            setShowModal={setShowModal}
            fnDelete={handleDelete}
          />)
          : null
      }
    </>
  );
};

export default TipoEventosPage;
