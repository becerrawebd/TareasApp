import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles, CircularProgress } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { validarDatosDeRegistro } from "../util/validators";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  progress: {
    position: "absolute",
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: 10,
  },
}));

const Signup = (props) => {
  const classes = useStyles();

  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    usuario: "",
    numeroTelefono: "",
    email: "",
    pais: "",
    password: "",
    confirmaPassword: "",
    errores: {},
    cargando: false,
  });

  const handleChange = (evt) => {
    setFormulario({
      ...formulario,
      [evt.target.name]: evt.target.value,
      errores: {
        [evt.target.name]: "",
      },
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const usuario = {
      nombre: formulario.nombre,
      apellido: formulario.apellido,
      usuario: formulario.usuario,
      numeroTelefono: formulario.numeroTelefono,
      email: formulario.email,
      pais: formulario.pais,
      password: formulario.password,
      confirmaPassword: formulario.confirmaPassword,
    };
    const { datosValidos, errores } = validarDatosDeRegistro(usuario);
    if (!datosValidos) {
      setFormulario({
        ...formulario,
        errores,
      });
    } else {
      setFormulario({
        ...formulario,
        cargando: true,
      });
      const datosUsuario = {
        nombre: formulario.nombre,
        apellido: formulario.apellido,
        usuario: formulario.usuario,
        numeroTelefono: formulario.numeroTelefono,
        email: formulario.email,
        pais: formulario.pais,
        password: formulario.password,
        confirmaPassword: formulario.confirmaPassword,
      };
      axios
        .post("/registrarse", datosUsuario)
        .then((respuesta) => {
          localStorage.setItem("AuthToken", `Bearer ${respuesta.data.token}`);
          setFormulario({
            ...formulario,
            errores: {},
            cargando: false,
          });
          props.history.push("/");
        })
        .catch((error) => {
          console.log(error.response.data);
          setFormulario({
            ...formulario,
            cargando: false,
            errores: error.response.data,
          });
        });
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registrarse
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="nombre"
                label="Nombre"
                name="nombre"
                autoComplete="nombre"
                autoFocus
                helperText={formulario.errores.nombre}
                error={formulario.errores.nombre ? true : false}
                onChange={handleChange}
              ></TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="apellido"
                label="Apellido"
                name="apellido"
                autoComplete="apellido"
                helperText={formulario.errores.apellido}
                error={formulario.errores.apellido ? true : false}
                onChange={handleChange}
              ></TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="usuario"
                label="Usuario"
                name="usuario"
                autoComplete="usuario"
                helperText={formulario.errores.usuario}
                error={formulario.errores.usuario ? true : false}
                onChange={handleChange}
              ></TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="numeroTelefono"
                label="Telefono"
                name="numeroTelefono"
                autoComplete="numeroTelefono"
                helperText={formulario.errores.numeroTelefono}
                error={formulario.errores.numeroTelefono ? true : false}
                onChange={handleChange}
              ></TextField>
            </Grid>
          </Grid>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            helperText={formulario.errores.email}
            error={formulario.errores.email ? true : false}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="pais"
            label="País"
            name="pais"
            autoComplete="pais"
            helperText={formulario.errores.pais}
            error={formulario.errores.pais ? true : false}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="password"
            id="password"
            label="Contraseña"
            name="password"
            autoComplete="current-password"
            helperText={formulario.errores.password}
            error={formulario.errores.password ? true : false}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="password"
            id="confirmaPassword"
            label="Confirma Contraseña"
            name="confirmaPassword"
            autoComplete="current-password"
            helperText={formulario.errores.confirmaPassword}
            error={formulario.errores.confirmaPassword ? true : false}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
            disabled={
              formulario.cargando ||
              !formulario.email ||
              !formulario.password ||
              !formulario.nombre ||
              !formulario.apellido ||
              !formulario.usuario ||
              !formulario.numeroTelefono ||
              !formulario.pais ||
              !formulario.confirmaPassword
            }
          >
            Registrarse{" "}
            {formulario.cargando && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="login" variant="body2">
                {"Ya tienes una cuenta? Inicia sesión"}
              </Link>
            </Grid>
          </Grid>
          {formulario.errores.general && (
            <Typography variant="body2" className={classes.customError}>
              {formulario.errores.general}
            </Typography>
          )}
        </form>
      </div>
    </Container>
  );
};

export default Signup;
