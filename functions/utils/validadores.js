const esVacio = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

const esEmail = (email) => {
  const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

exports.validarDatosInicioSesion = (usuario) => {
  let errores = {};
  if (esVacio(usuario.email)) errores.email = "El email es requerido";
  else if (!esEmail(usuario.email))
    errores.email = "El mail debe tener un formato valido";
  if (esVacio(usuario.password)) errores.password = "El password es requerido";
  return {
    datosValidos: Object.keys(errores).length === 0 ? true : false,
    errores,
  };
};

exports.validarDatosDeRegistro = (usuario) => {
  let errores = {};
  if (esVacio(usuario.email)) {
    errores.email = "El email es requerido";
  } else if (!esEmail(usuario.email)) {
    errores.email = "El mail debe tener un formato valido";
  }
  if (esVacio(usuario.nombre)) errores.nombre = "El nombre es requerido";
  if (esVacio(usuario.apellido)) errores.apellido = "El apellido es requerido";
  if (esVacio(usuario.numeroTelefono)) {
    errores.numeroTelefono = "El numero de telefono es requerido";
  } else if (isNaN(usuario.numeroTelefono)) {
    errores.numeroTelefono = "Debe ser un numero";
  }
  if (esVacio(usuario.pais)) errores.pais = "El pais es requerido";
  if (esVacio(usuario.usuario)) errores.usuario = "El usuario es requerido";
  if (esVacio(usuario.password)) errores.password = "El password es requerido";
  if (esVacio(usuario.confirmaPassword))
    errores.confirmaPassword = "El password de confirmacion es requerido";
  if (usuario.password !== usuario.confirmaPassword)
    errores.confirmaPassword = "Los contraseñas deben concidir";
  return {
    datosValidos: Object.keys(errores).length === 0 ? true : false,
    errores,
  };
};

exports.esFormatoValidoFotoPerfil = (formatosValidos, formatoEvaluar) => {
  return formatosValidos.some((formato) => formato === formatoEvaluar);
};
