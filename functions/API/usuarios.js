const { admin, db } = require("../utils/admin");
const config = require("../utils/config");
const {
  validarDatosInicioSesion,
  validarDatosDeRegistro,
  esFormatoValidoFotoPerfil,
} = require("../utils/validadores");

const firebase = require("firebase");

firebase.initializeApp(config);

// crear usuario, validando que los datos sean validos y que no exista un mismo usuario
exports.crearUsuario = (request, response) => {
  const nuevoUsuario = {
    nombre: request.body.nombre,
    apellido: request.body.apellido,
    email: request.body.email,
    numeroTelefono: request.body.numeroTelefono,
    pais: request.body.pais,
    usuario: request.body.usuario,
    password: request.body.password,
    confirmaPassword: request.body.confirmaPassword,
    imagen: "",
    imagenPerfilUrl: "",
  };
  const { datosValidos, errores } = validarDatosDeRegistro(nuevoUsuario);
  if (!datosValidos) {
    return response.status(400).json(errores);
  }
  let token, usuarioId;
  db.doc(`/usuarios/${nuevoUsuario.usuario}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return response
          .status(400)
          .json({ usuario: "El nombre de usuario ya se encuentra en uso" });
      }
      return firebase
        .auth()
        .createUserWithEmailAndPassword(
          nuevoUsuario.email,
          nuevoUsuario.password
        );
    })
    .then((data) => {
      usuarioId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const credencialesUsuario = {
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        email: nuevoUsuario.email,
        numeroTelefono: nuevoUsuario.numeroTelefono,
        pais: nuevoUsuario.pais,
        usuario: nuevoUsuario.usuario,
        creadoEn: new Date().toISOString(),
        imagen: nuevoUsuario.imagen,
        imagenPerfilUrl: nuevoUsuario.imagenPerfilUrl,
        usuarioId,
      };
      return db
        .doc(`/usuarios/${nuevoUsuario.usuario}`)
        .set(credencialesUsuario);
    })
    .then(() => {
      return response.status(201).json({ token });
    })
    .catch((error) => {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        return response.status(400).json({ email: "El email ya esta en uso" });
      }
      if (error.code === "auth/invalid-email") {
        return response.status(400).json({ email: "El email es invalido" });
      }
      if (error.code === "auth/operation-not-allowed") {
        return response
          .status(400)
          .json({ email: "Este email se encuentra deshabilitado" });
      }
      if (error.code === "auth/weak-password") {
        return response
          .status(400)
          .json({ password: "La contraseña es muy débil" });
      }
      return response
        .status(500)
        .json({ error: "Algo salio mal. Intente nuevamente" });
    });
};

// iniciario de sesion con email y password, devuelve un JWT que debe alamcenarse en localStorage
exports.iniciarSesion = (request, response) => {
  const usuario = {
    email: request.body.email,
    password: request.body.password,
  };
  let { datosValidos, errores } = validarDatosInicioSesion(usuario);
  if (!datosValidos) {
    return response.status(400).json(errores);
  }
  firebase
    .auth()
    .signInWithEmailAndPassword(usuario.email, usuario.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return response.status(200).json({ token });
    })
    .catch((error) => {
      if (error.code === "auth/invalid-email")
        return response.status(403).json({ email: "Email invalido" });
      if (error.code === "auth/wrong-password")
        return response.status(403).json({ password: "Contraseña invalida" });
      if (error.code === "auth/user-disabled")
        return response.status(403).json({ email: "Usuario deshabilitado" });
      if (error.code === "auth/user-not-found")
        return response
          .status(403)
          .json({ email: "Usuario inexistente. Registrese" });
      if (error.code === "auth/too-many-requests") {
        return response.status(500).json({
          general:
            "Excedio el limite de solicitudes. Intente nuevamente en algunos segundos",
        });
      }
      return response.status(500).json({
        general:
          "Lo sentimos, hubo un error. Intente nuevamente en algunos segundos",
      });
    });
};

// Subir foto de perfil del usuario usando Storage de firebase

eliminarImagenActual = (imagen) => {
  if (imagen === "") return;
  else
    admin
      .storage()
      .bucket()
      .file(imagen)
      .delete()
      .then(() => {
        return;
      })
      .catch((error) => {
        return;
      });
};

exports.subirFotoDePerfil = (request, response) => {
  const formatosValidos = ["image/png", "image/jpeg"];
  // utilizo busboy para validar el metafile del archivo enviado en el request y armar el stream de transmision
  const BusBoy = require("busboy");
  const busboy = new BusBoy({
    headers: request.headers,
  });
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  let imagen;
  let imagenParaSubir = {};

  // valido el file a subir, y armo el stream de carga
  busboy.on("file", (fieldname, file, filename, enconding, mimetype) => {
    if (!esFormatoValidoFotoPerfil(formatosValidos, mimetype)) {
      return response.status(400).json({
        error: "La imagen de perfil no tiene un formato valido",
        formatos_validos: formatosValidos,
      });
    }
    eliminarImagenActual(`${request.usuario.imagen}`);
    const formatoImagen = mimetype.slice(6); // extesion imagen a subir
    imagen = `${request.usuario.usuario}.${formatoImagen}`;
    const pathImagen = path.join(os.tmpdir(), imagen);
    imagenParaSubir = { pathImagen, mimetype };
    file.pipe(fs.createWriteStream(pathImagen));
  });
  // elimino la imagen actual del usuario
  // subo la imagen al storage de firebase
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imagenParaSubir.pathImagen, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imagenParaSubir.mimetype,
          },
        },
      })
      .then(() => {
        const imagenPerfilUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imagen}?alt=media`;
        return db.doc(`/usuarios/${request.usuario.usuario}`).update({
          imagenPerfilUrl,
          imagen,
        });
      })
      .then(() => {
        return response.json({
          mensaje: "Imagen de perfil actualizada exitosamente",
        });
      })
      .catch((error) => {
        console.error(error);
        return response.status(500).json({ error: error.code });
      });
  });
  busboy.end(request.rawBody);
};

// Obtener los detalles del usuario
exports.obtenerDetallesUsuario = (request, response) => {
  let detalles = {};
  db.doc(`/usuarios/${request.usuario.usuario}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        detalles.credencialesUsuario = doc.data();
        return response.status(200).json(detalles);
      }
      return response.status(404).json({ error: "Recurso no encontrado" });
    })
    .catch((error) => {
      console.log(error);
      return response
        .status(500)
        .json({ error: "Error al obtener los detalles del usuario" });
    });
};

// Actualizar los detalles del usuario
exports.actualizarDetallesUsuario = (request, response) => {
  let document = db.collection("usuarios").doc(request.usuario.usuario);
  document
    .update(request.body)
    .then(() => {
      return response
        .status(200)
        .json({ mensaje: "Detalles actualizados exitosamente" });
    })
    .catch((error) => {
      console.error(error);
      return response
        .status(500)
        .json({ error: "No se puede actualizar los detalles" });
    });
};
