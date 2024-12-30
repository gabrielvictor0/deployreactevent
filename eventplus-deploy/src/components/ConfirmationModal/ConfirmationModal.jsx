import { useContext, useState } from 'react';
import Button from '../Button/Button';
import './ConfirmationModal.css'
import api, { presencesEventResource } from '../../Services/Service';
import { UserContext } from '../../context/AuthContext';
import Notification from '../Notification/Notification';

const ConfirmationModal = ({ setShowModal, idEvent, setNotifyUser, setConfirm, txt, onClick, page, idToBeDeleted, fnDelete }) => {

    const { userData } = useContext(UserContext)

    async function Conectar(idEvent) {
        try {

            const response = await api.post(presencesEventResource, {
                situacao: true,
                idUsuario: userData.userId,
                idEvento: idEvent

            })

            if (response.status == 201) {
                setNotifyUser({
                    titleNote: "Sucesso",
                    textNote: `Presença confirmada com sucesso!`,
                    imgIcon: "success",
                    imgAlt:
                        "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
                    showMessage: true,
                });
            }

            setConfirm({presence: true, id: idEvent})

        } catch (error) {

        }

    }

    return (
        <div className='modal'>
            <div className='container-modal'>
                <p style={{textAlign: 'center'}}>{txt}</p>

                <div className='container-button'>
                    <button onClick={() => { setShowModal(false); }} className='button-cancel-modal'>Cancelar</button>

                    {
                        page === "home"
                            ?
                            (<button onClick={() => { setShowModal(false); setConfirm(true); Conectar(idEvent) }} className='button-modal'>
                                Confirmar
                            </button>)
                            : null
                    }

                    {
                        page === "adm-event"
                            ?
                            (<button onClick={() => { setShowModal(false); fnDelete(idToBeDeleted) }} className='button-modal'>
                                Confirmar
                            </button>)
                            : null
                    }

                    {
                        page === "adm-type-event"
                            ? (<button onClick={() => { setShowModal(false); fnDelete(idToBeDeleted) }} className='button-modal'>
                                Confirmar
                            </button>)
                            : null
                    }

                </div>

            </div>
        </div>
    )
}

export default ConfirmationModal;