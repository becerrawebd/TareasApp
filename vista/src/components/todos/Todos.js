import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { authMiddleware } from "../../util/auth";
import axios from "axios";
import DetailsTodoDialog from "./DetailsTodoDialog";
import Todo from "./Todo";
import ButtonAddTodo from "./ButtonAddTodo";
import FullDialog from "./FullDialog";
import DeleteTodoDialog from "./DeleteTodoDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 270,
  },
  pos: {
    marginBottom: 12,
  },
  cargandoUI: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
    left: "50%",
    top: "35%",
  },
  addButton: {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    zIndex: "1000",
  },
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const Todos = (props) => {
  const classes = useStyles();

  // states
  const [state, setState] = useState({
    tareas: [],
    titulo: "",
    descripcion: "",
    tareaId: "",
    errores: [],
    cargandoUI: true,
    accionEditar: false,
    fullDialog: false,
    editarTarea: false,
    eliminarTarea: false,
    update: false,
  });

  const handleDetailsView = (tarea) => {
    setState({
      ...state,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      detallesTarea: true,
    });
  };

  const handleEditView = (tarea) => {
    setState({
      ...state,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      tareaId: tarea.tareaId,
      accionEditar: true,
      fullDialog: true,
    });
  };

  const handleAddView = () => {
    setState({
      ...state,
      titulo: "",
      descripcion: "",
      accionEditar: false,
      fullDialog: true,
    });
  };

  const handleDeleteView = (tarea) => {
    setState({
      ...state,
      titulo: tarea.titulo,
      tareaId: tarea.tareaId,
      eliminarTarea: true,
    });
  };

  const handleCloseDetails = () => {
    setState({
      ...state,
      detallesTarea: false,
    });
  };

  const handleCloseFullDialog = (update = false) => {
    setState({
      ...state,
      fullDialog: false,
      update: update,
      cargandoUI: update,
    });
  };

  const handleCloseDelete = (update = false) => {
    setState({
      ...state,
      eliminarTarea: false,
      update: update,
      cargandoUI: update,
    });
  };

  //effects
  useEffect(() => {
    authMiddleware(props.history);
    const token = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${token}` };
    axios
      .get("/tareas")
      .then((respuesta) => {
        setState({
          ...state,
          tareas: respuesta.data,
          cargandoUI: false,
          update: false,
        });
      })
      .catch((error) => console.log(error));
  }, [state.update]);

  if (state.cargandoUI) {
    return (
      <main>
        {state.cargandoUI && (
          <CircularProgress size={150} className={classes.cargandoUI} />
        )}
      </main>
    );
  } else {
    return (
      <main>
        <Grid container spacing={2}>
          {state.tareas.map((tarea) => (
            <Todo
              key={tarea.tareaId}
              tarea={tarea}
              classes={classes}
              handleDetailsView={handleDetailsView}
              handleEditView={handleEditView}
              handleDeleteView={handleDeleteView}
            />
          ))}
        </Grid>
        <ButtonAddTodo handleAddView={handleAddView} />
        <DetailsTodoDialog
          open={state.detallesTarea}
          titulo={state.titulo}
          descripcion={state.descripcion}
          handleClose={handleCloseDetails}
        />
        <FullDialog
          open={state.fullDialog}
          accionEditar={state.accionEditar}
          titulo={state.titulo}
          descripcion={state.descripcion}
          tareaId={state.tareaId}
          handleClose={handleCloseFullDialog}
        />
        <DeleteTodoDialog
          open={state.eliminarTarea}
          titulo={state.titulo}
          tareaId={state.tareaId}
          handleClose={handleCloseDelete}
        />
      </main>
    );
  }
};

export default Todos;
