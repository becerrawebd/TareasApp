import React, { useState, Fragment, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import LaunchIcon from "@material-ui/icons/Launch";

dayjs.extend(relativeTime);
dayjs.locale("es");

const Todo = ({
  tarea,
  classes,
  handleDetailsView,
  handleEditView,
  handleDeleteView,
}) => {
  const [state, setState] = useState({
    creadaEn: dayjs(tarea.creadaEn).fromNow(),
  });

  useEffect(() => {
    const timerID = setInterval(() => {
      setState({
        creadaEn: dayjs(tarea.creadaEn).fromNow(),
      });
    }, 60000);
    return () => {
      clearInterval(timerID);
    };
  }, [state.creadaEn]);

  return (
    <Fragment>
      <Grid item xs={12} sm={6}>
        <Card className={classes.root} variant="outlined">
          <CardContent>
            <Typography variant="h5" component="h2">
              {tarea.titulo.substring(0, 20)}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {state.creadaEn}
            </Typography>
            <Typography variant="body2" component="p">
              {`${tarea.descripcion.substring(0, 25)}...`}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => handleDetailsView(tarea)}
            >
              <LaunchIcon fontSize="large"></LaunchIcon>
            </Button>
            <Button
              size="small"
              color="primary"
              onClick={() => handleEditView(tarea)}
            >
              <EditIcon fontSize="large"></EditIcon>
            </Button>
            <Button
              size="small"
              color="secondary"
              onClick={() => handleDeleteView(tarea)}
            >
              <DeleteOutlineIcon fontSize="large"></DeleteOutlineIcon>
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Fragment>
  );
};

export default Todo;
