import React from "react";
import "./TableEv.css";
import editPen from "../../../assets/images/edit-pen.svg";
import trashDelete from "../../../assets/images/trash-delete.svg";
import { dateFormateDbToView } from "../../../Utils/stringFunctions";

import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

const Table = ({ dados, fnDelete = null, fnUpdate = null, setShowModal, setIdToBeDeleted }) => {

  return (
    <table className="table-data">
      <thead className="table-data__head">
        <tr className="table-data__head-row">
          <th
            className="table-data__head-title table-data__head-title--big"
            data-tooltip-id="description-tooltip"
            data-tooltip-content={"Evento"}
            data-tooltip-place="top"
          >
            {/* {
              window.innerWidth < 992 ?
                'Ev...'
                : 'Evento'
            } */}
            Evento
          </th>
          <th
            className="table-data__head-title table-data__head-title--big"
            data-tooltip-id="description-tooltip"
            data-tooltip-content={"Descrição"}
            data-tooltip-place="top"
          >

            {
              window.innerWidth < 992 ?
                'Des..'
                : 'Descrição'
            }
            {/* Descrição */}
          </th>
          <th
            className="table-data__head-title table-data__head-title--big"
            data-tooltip-id="description-tooltip"
            data-tooltip-content={"Tipo Evento"}
            data-tooltip-place="top"
          >
            {
              window.innerWidth < 992
                ? 'Ti...'
                : 'Tipo Evento'
            }

            {/* Tipo Evento */}
          </th>
          <th
            className="table-data__head-title table-data__head-title--big"
            data-tooltip-id="description-tooltip"
            data-tooltip-content={"Data"}
            data-tooltip-place="top"
          >
            Data
          </th>
          <th
            className="table-data__head-title table-data__head-title--little"
            data-tooltip-id="description-tooltip"
            data-tooltip-content={"Editar"}
            data-tooltip-place="top"
          >
            {
              window.innerWidth < 992
                ? 'E...'
                : 'Editar'
            }
            {/* Editar */}
          </th>
          <th
            className="table-data__head-title table-data__head-title--little"
            data-tooltip-id="description-tooltip"
            data-tooltip-content={"Deletar"}
            data-tooltip-place="top"
          >
            {
              window.innerWidth < 992
                ? 'D...'
                : 'Deletar'
            }
            {/* Deletar */}
          </th>
        </tr>
      </thead>
      <tbody>
        {dados.map((tp) => {
          return (
            <tr className="table-data__head-row" key={tp.idEvento}>

              <td
                className="table-data__data table-data__data--big table-data__data--handover"
                data-tooltip-id="description-tooltip"
                data-tooltip-content={tp.noveEvento}
                data-tooltip-place="top"
              >
                {
                  window.innerWidth < 992 ?
                    <>
                      {
                        tp.nomeEvento.length > 5 ?
                          (
                            <>
                              {tp.nomeEvento.substr(0, 3)} ...
                            </>
                          ) :
                          (
                            <>
                              {tp.nomeEvento}
                            </>
                          )
                      }
                    </> :
                    <>
                      {tp.nomeEvento}
                    </>
                }

                {/* {tp.nomeEvento} */}
                <Tooltip
                  id="description-tooltip"
                  className="custom-tootip"
                />
              </td>
              <td
                className="table-data__data table-data__data--big table-data__data--handover"
                data-tooltip-id="description-tooltip"
                data-tooltip-content={tp.descricao}
                data-tooltip-place="top"
              >
                {
                  window.innerWidth < 992 ?
                    <>
                      {
                        tp.descricao.length > 10 ?
                          (
                            <>
                              {tp.descricao.substr(0, 3)} ...
                            </>
                          ) :
                          (
                            <>
                              {tp.descricao}
                            </>
                          )
                      }
                    </>
                    : <>{tp.descricao}</>
                }
                {/* {tp.descricao} */}

                <Tooltip
                  id="description-tooltip"
                  className="custom-tootip"
                />
              </td>

              <td
                className="table-data__data table-data__data--big table-data__data--handover"
                data-tooltip-id="description-tooltip"
                data-tooltip-content={tp.tiposEvento.titulo}
                data-tooltip-place="top"
              >

                {
                  window.innerWidth < 992 ?
                    <>
                      {
                        tp.tiposEvento.titulo.length > 10 ?
                          (
                            <>
                              {tp.tiposEvento.titulo.substr(0, 3)} ...
                            </>
                          ) :
                          (
                            <>
                              {tp.tiposEvento.titulo}
                            </>
                          )
                      }
                    </> :
                    <>
                      {tp.tiposEvento.titulo}
                    </>
                }

                {/* {tp.tiposEvento.titulo} */}
              </td>

              <td
                className="table-data__data table-data__data--big"
                data-tooltip-id="description-tooltip"
                data-tooltip-content={dateFormateDbToView(tp.dataEvento)}
                data-tooltip-place="top"
              >


                {
                  window.innerWidth < 992 ?
                    <>
                      {
                        dateFormateDbToView(tp.dataEvento).length > 5 ?
                          (
                            <>
                              {dateFormateDbToView(tp.dataEvento).substring(0, 3)} ...
                            </>
                          ) :
                          (
                            <>
                              {dateFormateDbToView(tp.dataEvento)}
                            </>
                          )
                      }
                    </> :
                    <>
                      {dateFormateDbToView(tp.dataEvento)}
                    </>
                }

                {/* {dateFormateDbToView(tp.dataEvento)} */}
              </td>

              <td className="table-data__data table-data__data--little">
                <img
                  className="table-data__icon"
                  idevento={tp.idEvento}
                  src={editPen}
                  alt=""
                  onClick={(e) =>

                    fnUpdate({
                      idEvento: tp.idEvento,
                      nomeEvento: tp.nomeEvento,
                      dataEvento: tp.dataEvento,
                      descricao: tp.descricao,
                      idInstituicao: tp.idInstituicao,
                      idTipoEvento: tp.idTipoEvento
                    })
                  }
                />
              </td>

              <td className="table-data__data table-data__data--little">
                <img
                  className="table-data__icon"
                  idevento={tp.idEvento}
                  src={trashDelete}
                  alt=""
                  onClick={(e) => { setShowModal(true); setIdToBeDeleted(e.target.getAttribute("idevento")) }}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
