import React, { useState, useEffect } from "react";
import { authMiddleware } from "../../util/auth";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {
  makeStyles,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Grid,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Input from "@material-ui/core/Input";
import SaveIcon from "@material-ui/icons/Save";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(3, 0, 2),
  },
  h2: {
    marginBottom: "1rem",
  },
  toolbar: theme.mixins.toolbar,
  cargandoUI: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
    left: "50%",
    top: "35%",
  },
  cargandoButton: {
    position: "absolute",
  },
}));

const Account = (props) => {
  const classes = useStyles();

  const [state, setState] = useState({
    nombreYApellido: "",
    nombre: "",
    apellido: "",
    email: "",
    numeroTelefono: "",
    usuario: "",
    pais: "",
    buttonUploadDisabled: true,
    imagen: "",
    cargandoUI: true,
    buttonSaveDisabled: true,
    cargandoImagen: false,
    cargandoDetails: false,
    erroresForm: {},
    errores: {},
  });

  useEffect(() => {
    if (authMiddleware(props.history)) {
      const token = localStorage.getItem("AuthToken");
      axios.defaults.headers.common = { Authorization: `${token}` };
      const config = {
        url: "/usuario",
        method: "get",
      };
      axios(config)
        .then((respuesta) => {
          setState({
            ...state,
            nombreYApellido: `${respuesta.data.credencialesUsuario.nombre} ${respuesta.data.credencialesUsuario.apellido}`,
            nombre: respuesta.data.credencialesUsuario.nombre,
            apellido: respuesta.data.credencialesUsuario.apellido,
            email: respuesta.data.credencialesUsuario.email,
            numeroTelefono: respuesta.data.credencialesUsuario.numeroTelefono,
            usuario: respuesta.data.credencialesUsuario.usuario,
            pais: respuesta.data.credencialesUsuario.pais,
            cargandoUI: false,
          });
          console.log(respuesta.data.credencialesUsuario);
        })
        .catch((error) => {
          const {
            response: { status, data },
          } = error;
          console.log(`El error fue ${error}`);
          if (status === 403 || status === 404) props.history.push("/login");
          setState({
            ...state,
            cargandoUI: false,
            errores: {
              ...[state.errores],
              server: data.error,
            },
          });
        });
    }
  }, []);

  // handlers

  const handleSelectPhoto = (evt) => {
    console.log(evt.target.files[0]);
    setState({
      ...state,
      buttonUploadDisabled: false,
      [evt.target.name]: evt.target.files[0],
    });
  };

  const handleUploadPhoto = (evt) => {
    evt.preventDefault();
    setState({
      ...state,
      cargandoImagen: true,
      buttonUploadDisabled: true,
    });
    if (authMiddleware(props.history)) {
      const token = localStorage.getItem("AuthToken");
      let formData = new FormData();
      formData.append("imagen", state.imagen);
      const config = {
        url: "usuario/imagen",
        method: "post",
        headers: {
          "content-type": "multipart/form-data",
        },
        data: formData,
      };
      axios.defaults.headers.common = {
        Authorization: `${token}`,
      };
      axios(config)
        .then((respuesta) => {
          console.log(respuesta.data);
          window.location.reload();
          //props.handleChangePhoto();
        })
        .catch((error) => {
          const {
            response: { status, data },
          } = error;
          if (status === 403) props.history.push("/login");
          if (status === 400) {
            const { error, formatos_validos } = data;
            const validos = formatos_validos.map((f) => f.split("/")[1]);
            setState({
              ...state,
              errores: {
                ...state.errores,
                errorFoto: `${error}, formatos validos: ${validos}`,
              },
              cargandoImagen: false,
              buttonUploadDisabled: true,
            });
          }
        });
    }
  };

  const handleChange = (evt) => {
    setState({
      ...state,
      buttonSaveDisabled: false,
      [evt.target.name]: evt.target.value,
      erroresForm: {
        ...state.erroresForm,
        [evt.target.name]: "",
      },
    });
  };

  const validarFormulario = () => {
    let erroresForm = {};
    if (state.nombre.trim() === "") {
      erroresForm.nombre = "El nombre no puede estar vacio";
    }
    if (state.apellido.trim() === "") {
      erroresForm.apellido = "El apellido no puede estar vacio";
    }
    if (state.numeroTelefono.trim() === "") {
      erroresForm.numeroTelefono = "El numero de telefono no puede estar vacio";
    } else if (isNaN(state.numeroTelefono.trim())) {
      erroresForm.numeroTelefono = "Debe ser un numero";
    }
    if (state.pais.trim() === "") {
      erroresForm.pais = "El pais no puede estar vacio";
    }
    setState({
      ...state,
      erroresForm,
    });
    return Object.keys(erroresForm).length === 0 ? true : false;
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setState({
      ...state,
      buttonSaveDisabled: true,
      cargandoDetails: true,
    });
    setTimeout(() => {
      const valido = validarFormulario();
      if (!valido) return;
      if (authMiddleware(props.history)) {
        const token = localStorage.getItem("AuthToken");
        axios.defaults.headers.common = { Authorization: `${token}` };
        const userDetails = {
          nombre: state.nombre,
          apellido: state.apellido,
          numeroTelefono: state.numeroTelefono,
          pais: state.pais,
        };
        const config = {
          url: "/usuario",
          method: "post",
          data: userDetails,
        };
        axios(config)
          .then((respuesta) => {
            console.log(respuesta);
            window.location.reload();
          })
          .catch((error) => {
            const {
              response: { status, data },
            } = error;
            console.log(data);
            if (status === 403) props.history.push("/login");
            setState({
              ...state,
              errores: {
                ...state.errores,
                saveDetails: data.error,
              },
            });
          });
      }
    }, 1000);
  };

  if (state.cargandoUI) {
    return (
      <main>
        <div className={classes.toolbar} />
        {state.cargandoUI && (
          <CircularProgress
            size={150}
            className={classes.cargandoUI}
          ></CircularProgress>
        )}
      </main>
    );
  } else {
    return (
      <main>
        <Card>
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h4" component="h4" className={classes.h2}>
                  {state.errores.server
                    ? `Lo sentimos, hubo un error`
                    : state.nombreYApellido}
                </Typography>
              </Grid>
            </Grid>

            <CardActions>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleUploadPhoto}
                    disabled={state.buttonUploadDisabled}
                  >
                    Upload Photo
                    {state.cargandoImagen && (
                      <CircularProgress
                        size={30}
                        className={classes.cargandoButton}
                      />
                    )}
                  </Button>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Input
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="file"
                    name="imagen"
                    onChange={handleSelectPhoto}
                    disableUnderline
                  ></Input>
                </Grid>
              </Grid>
            </CardActions>

            {state.errores.errorFoto && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">
                  {state.errores.errorFoto}
                </Typography>
              </Grid>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <form noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    error={state.erroresForm.nombre ? true : false}
                    helperText={state.erroresForm.nombre}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    color="primary"
                    name="nombre"
                    defaultValue={state.nombre}
                    label="Nombre"
                    onChange={handleChange}
                    disabled={state.error ? true : false}
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    error={state.erroresForm.apellido ? true : false}
                    helperText={state.erroresForm.apellido}
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    name="apellido"
                    defaultValue={state.apellido}
                    label="Apellido"
                    onChange={handleChange}
                    disabled={state.error ? true : false}
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    defaultValue={state.email}
                    label="Correo electrónico"
                    disabled
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    error={state.erroresForm.numeroTelefono ? true : false}
                    helperText={state.erroresForm.numeroTelefono}
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    name="numeroTelefono"
                    defaultValue={state.numeroTelefono}
                    label="Telefono"
                    onChange={handleChange}
                    disabled={state.error ? true : false}
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    defaultValue={state.usuario}
                    label="Nombre de usuario"
                    disabled
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    error={state.erroresForm.pais ? true : false}
                    helperText={state.erroresForm.pais}
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    name="pais"
                    defaultValue={state.pais}
                    label="Pais"
                    onChange={handleChange}
                    disabled={state.error ? true : false}
                  ></TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.button}
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    disabled={state.buttonSaveDisabled}
                  >
                    Guardar Detalles
                    {state.cargandoDetails && (
                      <CircularProgress
                        size={30}
                        className={classes.cargandoButton}
                      />
                    )}
                  </Button>
                </Grid>
                {state.errores.server && (
                  <Grid item xs={12} md={8}>
                    <Typography align="center" color="error" variant="h6">
                      Detalle del error: {state.errores.server}
                    </Typography>
                  </Grid>
                )}
                {state.errores.saveDetails && (
                  <Grid item xs={12}>
                    <Typography color="error" variant="body2">
                      {state.errores.saveDetails}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }
};

export default withRouter(Account);
