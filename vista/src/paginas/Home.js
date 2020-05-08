import React, { useState, useEffect, Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import NotesIcon from "@material-ui/icons/Notes";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { authMiddleware } from "../util/auth";
import Todos from "../components/todos/Todos";
import Account from "../components/account/Account";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import RoomIcon from "@material-ui/icons/Room";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    [theme.breakpoints.up("md")]: {
      width: "100%",
      zIndex: theme.zIndex.drawer + 1,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  avatar: {
    height: "7rem",
    width: "7rem",
    flexShrink: 0,
    flexGrow: 0,
    marginTop: 20,
  },
  cargandoUI: {
    position: "fixed",
    top: "35%",
    zIndex: "1000",
    left: "30%",
    [theme.breakpoints.up("md")]: {
      left: "50%",
    },
  },
  itemDrawer: {
    padding: "1rem 2rem",
  },
}));

const Home = (props) => {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // states
  const [state, setState] = useState({
    nombre: "",
    apellido: "",
    imagenPerfil: "",
    cargandoUI: true,
    cargandoImagen: false,
    updatePhoto: false,
  });

  const [render, setRender] = useState(false);

  // handlers
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logoutHandler = () => {
    localStorage.removeItem("AuthToken");
    props.history.push("/login");
  };

  const loadTodoComponent = () => {
    setMobileOpen(false);
    setRender(false);
  };

  const loadAccountComponent = () => {
    setMobileOpen(false);
    setRender(true);
  };

  const handleChangePhoto = (render) => {
    setState({
      ...state,
      updatePhoto: true,
    });
  };

  useEffect(() => {
    console.log("useEffect");
    authMiddleware(props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get("/usuario")
      .then((respuesta) => {
        setState({
          nombre: respuesta.data.credencialesUsuario.nombre,
          apellido: respuesta.data.credencialesUsuario.apellido,
          email: respuesta.data.credencialesUsuario.email,
          numeroTelefono: respuesta.data.credencialesUsuario.numeroTelefono,
          pais: respuesta.data.credencialesUsuario.pais,
          usuario: respuesta.data.credencialesUsuario.usuario,
          uiLoading: false,
          imagenPerfil: respuesta.data.credencialesUsuario.imagenPerfilUrl,
          updatePhoto: false,
        });
      })
      .catch((error) => {
        if (error.response.status === 403) {
          props.history.push("/login");
        }
        setState({ error: "Error al recuperar la informacion" });
      });
  }, [state.updatePhoto]);

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <center>
        <Avatar className={classes.avatar} src={state.imagenPerfil}></Avatar>

        <ListItemText
          primary={`${state.nombre} ${state.apellido}`}
          secondary={
            <Fragment>
              <Typography>
                <RoomIcon />
                {state.pais}
              </Typography>
            </Fragment>
          }
        />
      </center>

      <List>
        <Divider />
        <ListItem
          className={classes.itemDrawer}
          button
          key="Tareas"
          onClick={loadTodoComponent}
        >
          <ListItemAvatar>
            <NotesIcon color="primary" />
          </ListItemAvatar>
          <ListItemText primary="Tareas" />
        </ListItem>
        <Divider />
        <ListItem
          className={classes.itemDrawer}
          button
          key="Cuenta"
          onClick={loadAccountComponent}
        >
          <ListItemAvatar>
            <AccountBoxIcon color="primary" />
          </ListItemAvatar>
          <ListItemText primary="Cuenta" />
        </ListItem>
        <Divider />
        <ListItem
          className={classes.itemDrawer}
          button
          key="Salir"
          onClick={logoutHandler}
        >
          <ListItemAvatar>
            <ExitToAppIcon color="primary" />
          </ListItemAvatar>
          <ListItemText primary="Salir" />
        </ListItem>
        <Divider />
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  if (state.cargandoUI === true) {
    return (
      <div className={classes.root}>
        <CircularProgress size={150} className={classes.cargandoUI} />
      </div>
    );
  } else {
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.nombreApp} noWrap>
              TareasApp
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div>
            {render ? (
              <Account handleChangePhoto={handleChangePhoto} />
            ) : (
              <Todos />
            )}
          </div>
        </main>
      </div>
    );
  }
};

export default Home;
