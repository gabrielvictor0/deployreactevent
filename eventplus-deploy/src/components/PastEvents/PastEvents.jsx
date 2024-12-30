import React from "react";
import "./PastEvents.css";
import { Tooltip } from "react-tooltip";
import { dateFormatDbToView } from "../../Utils/stringFunctions";
import EventosAnterioresAlunoPage from "../../pages/EventosAnterioresAlunoPage/EventosAnterioresAlunoPage";
import { Link, Route } from "react-router-dom";

const PastEvents = ({ title, description, eventDate, idEvent, buttonLink, buttonText }) => {
  return (
    <article className="event-card">
      <h2
        className="event-card__title"
        data-tooltip-id={idEvent}
        data-tooltip-content={title}
        data-tooltip-place="top"
      >
        {
          title.length > 15 ?
            (
              <>
                <Tooltip id={idEvent} className='tooltip' />
                {title.substr(0, 15)} ...
              </>
            )
            :
            (
              <>
                {title}
              </>
            )
        }


      </h2>

      <p
        className="event-card__description"
        data-tooltip-id={idEvent}
        data-tooltip-content={description}
        data-tooltip-place="top"
      >
        {
          description.length > 15 ?
            (
              <>
                <Tooltip id={idEvent} className='tooltip' />
                {description.substr(0, 15)} ...
              </>
            )
            :
            (
              <>
                {description}
              </>
            )

        }

      </p>

      <p className="event-card__description-past">
        {dateFormatDbToView(eventDate)}
      </p>

      
    </article>
  );
};

export default PastEvents;
