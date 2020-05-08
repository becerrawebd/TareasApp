const { admin, db } = require("./admin");

// Middleware para manejar las solicitudes a las rutas segun el token recibido.
module.exports = (request, response, next) => {
  // verifico si el request contiene el token requerido
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = request.headers.authorization.split("Bearer ")[1]; // me quedo solo con el token
  } else {
    console.error("Token no encontrado");
    return response.status(403).json({ error: "No autorizado" });
  }
  // devuelvo el usuario con ese token
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((tokenDecodificado) => {
      request.usuario = tokenDecodificado;
      return db
        .collection("usuarios")
        .where("usuarioId", "==", request.usuario.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      request.usuario.usuario = data.docs[0].data().usuario;
      request.usuario.imagen = data.docs[0].data().imagen;
      request.usuario.imagenPerfilUrl = data.docs[0].data().imagenPerfilUrl;
      return next();
    })
    .catch((error) => {
      console.error(error);
      return response.status(403).json({ error: "No autorizado" });
    });
};
