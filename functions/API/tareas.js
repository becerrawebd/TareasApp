const { admin, db } = require("../utils/admin");

// Obtener todas las tareas
exports.obtenerTareas = (request, response) => {
  db.collection("tareas")
    .where("usuario", "==", request.usuario.usuario)
    .orderBy("creadaEn", "desc")
    .get()
    .then((dataTareas) => {
      let tareas = [];
      dataTareas.forEach((tarea) => {
        tareas.push({
          tareaId: tarea.id,
          titulo: tarea.data().titulo,
          descripcion: tarea.data().descripcion,
          creadaEn: tarea.data().creadaEn,
        });
      });
      return response.status(200).json(tareas);
    })
    .catch((error) => {
      console.error(error);
      return response
        .status(500)
        .json({ error: "Hubo un error al obtener las tareas" });
    });
};

// Obtener una tarea por el Id
exports.obtenerUnaTarea = (request, response) => {
  db.collection("tareas")
    .doc(request.params.tareaId)
    .get()
    .then((tareaData) => {
      if (!tareaData.exists) {
        return response.status(404).json({ error: "Tarea no encontrada" });
      }
      if (
        !tareaData.data().usuario ||
        tareaData.data().usuario !== request.usuario.usuario
      ) {
        return response.status(401).json({ error: "No autorizado" });
      }
      let tarea = {
        tareaId: tareaData.id,
        titulo: tareaData.data().titulo,
        descripcion: tareaData.data().descripcion,
        creadaEn: tareaData.data().creadaEn,
      };
      return response.json(tarea);
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

// Crear una nueva tarea
exports.crearTarea = (request, response) => {
  if (!request.body.titulo || request.body.titulo.trim() === "") {
    return response
      .status(400)
      .json({ titulo: "El titulo no puede estar vacio" });
  }
  if (!request.body.descripcion || request.body.descripcion.trim() === "") {
    return response
      .status(400)
      .json({ descripcion: "La descripcion no puede estar vacia" });
  }
  let nuevaTarea = {
    usuario: request.usuario.usuario,
    titulo: request.body.titulo,
    descripcion: request.body.descripcion,
    creadaEn: new Date().toISOString(),
  };
  db.collection("tareas")
    .add(nuevaTarea)
    .then((tareaCreada) => {
      nuevaTarea.id = tareaCreada.id;
      return response.status(201).json(nuevaTarea);
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({
        error: "Hubo un problema el crear la tarea. Intente nuevamente",
      });
    });
};

// Eliminar una tarea por el Id
exports.eliminarTarea = (request, response) => {
  const documento = db.collection("tareas").doc(request.params.tareaId);
  documento
    .get()
    .then((tarea) => {
      if (!tarea.exists) {
        return response
          .status(404)
          .json({ error: "No se encuentra la tarea a eliminar" });
      }
      if (
        !tarea.data().usuario ||
        tarea.data().usuario !== request.usuario.usuario
      ) {
        return response.status(403).json({ error: "No autorizado" });
      }
      return documento.delete();
    })
    .then(() => {
      return response
        .status(200)
        .json({ mensaje: "Tarea eliminada exitosamente" });
    })
    .catch((error) => {
      console.error(error);
      return response
        .stus(500)
        .json({ error: "Error al intentar eliminar la tarea" });
    });
};

// Editar una tarea por el Id
exports.editarTarea = (request, response) => {
  if (request.body.tareaId || request.body.creadaEn) {
    return response.status(400).json({
      error: "El id y la fecha de creacion de la tarea no se pueden editar",
    });
  }
  if (request.body.titulo && request.body.titulo.trim() === "") {
    return response
      .status(400)
      .json({ titulo: "El titulo no puede estar vacio" });
  }
  if (request.body.descripcion && request.body.descripcion.trim() === "") {
    return response
      .status(400)
      .json({ descripcion: "La descripcion no puede estar vacia" });
  }

  let documento = db.collection("tareas").doc(request.params.tareaId);
  documento
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response
          .status(404)
          .json({ error: "No se encuentra la tarea para actualizar" });
      }
      if (
        !doc.data().usuario ||
        doc.data().usuario !== request.usuario.usuario
      ) {
        return response.status(403).json({ error: "No autorizado" });
      }
      let tareaActualizada = {
        titulo: doc.data().titulo,
        descripcion: doc.data().descripcion,
      };
      if (request.body.titulo) {
        tareaActualizada.titulo = request.body.titulo;
      }
      if (request.body.descripcion) {
        tareaActualizada.descripcion = request.body.descripcion;
      }
      return documento.update(tareaActualizada);
    })
    .then(() => {
      return response
        .status(200)
        .json({ mensaje: "Tarea actualizada exitosamente" });
    })
    .catch((error) => {
      console.error(error);
      return response
        .status(500)
        .json({ error: "Hubo un problema al editar la tarea" });
    });
};
