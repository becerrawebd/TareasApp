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
import { validarDatosInicioSesion } from "../util/validators";
import Temporizador from "../components/Temporizador";

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

const Login = (props) => {
  const classes = useStyles();

  const [formulario, setFormulario] = useState({
    email: "",
    password: "",
    errores: {},
    cargando: false,
    esperaTemporizador: 0,
  });

  // handlers
  const handleChange = (evt) => {
    setFormulario({
      ...formulario,
      [evt.target.name]: evt.target.value,
      errores: {
        [evt.target.name]: "",
      },
    });
  };

  const handleEsperaTemporizador = () => {
    setFormulario({
      ...formulario,
      esperaTemporizador: 0,
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const usuario = {
      email: formulario.email,
      password: formulario.password,
    };
    const { datosValidos, errores } = validarDatosInicioSesion(usuario);
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
        email: formulario.email,
        password: formulario.password,
      };
      axios
        .post("/login", datosUsuario)
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
          if (error.response.status === 500) {
            setFormulario({
              ...formulario,
              cargando: false,
              errores: error.response.data,
              esperaTemporizador: 50,
            });
          } else {
            setFormulario({
              ...formulario,
              cargando: false,
              errores: error.response.data,
            });
          }
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
          Iniciar Sesión
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            helperText={formulario.errores.email}
            error={formulario.errores.email ? true : false}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
            disabled={
              formulario.cargando ||
              formulario.esperaTemporizador !== 0 ||
              !formulario.email ||
              !formulario.password
            }
          >
            Ingresar
            {formulario.cargando && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Button>
          <Grid container>
            <Grid item>
              <Link href="signup" variant="body2">
                {"No tienes una cuenta? Registrate"}
              </Link>
            </Grid>
          </Grid>
          {formulario.errores.general && (
            <Typography variant="body2" className={classes.customError}>
              {formulario.errores.general}{" "}
              <Temporizador
                espera={formulario.esperaTemporizador}
                handleEspera={handleEsperaTemporizador}
              />
            </Typography>
          )}
        </form>
      </div>
    </Container>
  );
};

export default Login;
