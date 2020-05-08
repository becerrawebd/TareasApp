const functions = require("firebase-functions");
const express = require("express");
const auth = require("./utils/auth");

const {
  obtenerTareas,
  obtenerUnaTarea,
  crearTarea,
  eliminarTarea,
  editarTarea,
} = require("./API/tareas");

const {
  iniciarSesion,
  crearUsuario,
  subirFotoDePerfil,
  obtenerDetallesUsuario,
  actualizarDetallesUsuario,
} = require("./API/usuarios");

const app = express();

//tareas
app.get("/tareas", auth, obtenerTareas);
app.get("/tarea/:tareaId", auth, obtenerUnaTarea);
app.post("/tarea", auth, crearTarea);
app.delete("/tarea/:tareaId", auth, eliminarTarea);
app.put("/tarea/:tareaId", auth, editarTarea);

//usuarios
app.post("/login", iniciarSesion);
app.post("/registrarse", crearUsuario);
app.post("/usuario/imagen", auth, subirFotoDePerfil);
app.get("/usuario", auth, obtenerDetallesUsuario);
app.post("/usuario", auth, actualizarDetallesUsuario);

exports.api = functions.https.onRequest(app);
