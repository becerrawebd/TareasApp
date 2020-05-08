import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { authMiddleware } from "../../util/auth";
import axios from "axios";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  cargando: {
    position: "absolute",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullDialog = ({
  open,
  history,
  accionEditar,
  titulo,
  descripcion,
  tareaId,
  handleClose,
}) => {
  const classes = useStyles();

  const [state, setState] = useState({
    titulo: "",
    descripcion: "",
    errores: {},
    cargando: false,
  });

  // handlers
  useEffect(() => {
    setState({
      titulo: titulo,
      descripcion: descripcion,
      errores: {},
    });
  }, [open]);

  const validarFormulario = () => {
    let errores = {};
    if (state.titulo.trim() === "") {
      errores.titulo = "El titulo no puede estar vacio";
    }
    if (state.descripcion.trim() === "") {
      errores.descripcion = "La descripcion no puede estar vacia";
    }
    setState({
      ...state,
      errores,
    });
    return Object.keys(errores).length === 0 ? true : false;
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setState({
      ...state,
      cargando: true,
    });
    const valido = validarFormulario();
    if (!valido) return;
    if (authMiddleware(history)) {
      const token = localStorage.getItem("AuthToken");
      axios.defaults.headers.commom = {
        Authorization: `${token}`,
      };
      let config = {};
      if (accionEditar) {
        config = {
          url: `/tarea/${tareaId}`,
          method: "put",
          data: state,
        };
      } else {
        config = {
          url: `/tarea`,
          method: "post",
          data: state,
        };
      }
      axios(config)
        .then((respuesta) => {
          setState({
            ...state,
            cargando: false,
          });
          handleClose(true);
        })
        .catch((error) => {
          if (error.response.status === 403) history.push("/login");
          setState({
            ...state,
            errores: error.response.data,
            cargando: false,
          });
        });
    }
  };

  const handleChange = (evt) => {
    setState({
      ...state,
      [evt.target.name]: evt.target.value,
      errores: {
        [evt.target.name]: "",
      },
    });
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <form onSubmit={handleSubmit} noValidate>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {accionEditar ? "Editar Tarea" : "Nueva Tarea"}
              </Typography>
              <Button
                type="submit"
                disabled={state.cargando}
                autoFocus
                color="inherit"
              >
                {accionEditar ? "Guardar" : "Agregar"}{" "}
                {state.cargando && (
                  <CircularProgress
                    size={30}
                    className={classes.cargando}
                  ></CircularProgress>
                )}
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            <ListItem>
              <TextField
                autoFocus
                variant="outlined"
                margin="dense"
                id="titulo"
                name="titulo"
                label="Titulo"
                type="text"
                fullWidth
                helperText={state.errores.titulo}
                error={state.errores.titulo ? true : false}
                defaultValue={state.titulo}
                onChange={handleChange}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <TextField
                margin="dense"
                id="descripcion"
                name="descripcion"
                label="Descripcion"
                variant="outlined"
                type="text"
                multiline
                rows={25}
                rowsMax={25}
                fullWidth
                helperText={state.errores.descripcion}
                error={state.errores.descripcion ? true : false}
                defaultValue={state.descripcion}
                onChange={handleChange}
              />
            </ListItem>
          </List>
        </form>
      </Dialog>
    </div>
  );
};

export default withRouter(FullDialog);
