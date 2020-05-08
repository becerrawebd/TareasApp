import React, { useState, useEffect, Fragment } from "react";

const Temporizador = ({ espera, handleEspera }) => {
  const [segundos, setsegundos] = useState(espera);

  useEffect(() => {
    setsegundos(espera);
  }, [espera]);

  useEffect(() => {
    console.log("useEffect");
    if (segundos !== 0) {
      let temporizadorID = setTimeout(() => {
        setsegundos(segundos - 1);
      }, 1000);
      return () => {
        clearTimeout(temporizadorID);
      };
    } else {
      handleEspera();
    }
  }, [segundos]);

  return <Fragment>{espera}</Fragment>;
};

export default Temporizador;
