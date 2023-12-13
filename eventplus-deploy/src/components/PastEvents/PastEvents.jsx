import React from "react";
import "./PastEvents";
import { Tooltip } from "react-tooltip";
import { dateFormatDbToView } from "../../Utils/stringFunctions";
import EventosAnterioresAlunoPage from "../../pages/EventosAnterioresAlunoPage/EventosAnterioresAlunoPage";
import { Link, Route } from "react-router-dom";

const PastEvents = ({ title, description, eventDate, idEvent, buttonLink, buttonText }) => {
  return (
    <article className="event-card">
      <h2 className="event-card__title">{title}</h2>

      <p
        className="event-card__description"
        data-tooltip-id={idEvent}
        data-tooltip-content={description}
        data-tooltip-place="top"
      >
        <Tooltip id={idEvent} className='tooltip'/>
        {description.substr(0,15)} ...
      </p>

        <p className="event-card__description">
        {dateFormatDbToView(eventDate)} 
        </p>

        <Link to={buttonLink} className="event-card__connect-link">{buttonText}</Link>
    </article>
  );
};

export default PastEvents;
