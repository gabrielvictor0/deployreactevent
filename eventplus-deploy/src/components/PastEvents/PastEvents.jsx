import React from "react";
import "./PastEvents";
import { Tooltip } from "react-tooltip";

const PastEvents = ({ title, description, eventDate, idEvent }) => {
  return (
    <article className="event-card">
      <h2 className="event-card__titlte">{title}</h2>

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

        <a className="event-card__connect-link">
            Visualizar
        </a>
    </article>
  );
};

export default PastEvents;
