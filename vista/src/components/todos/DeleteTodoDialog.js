import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { authMiddleware } from "../../util/auth";
import axios from "axios";
import { withRouter } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteTodoDialog = ({ open, titulo, tareaId, handleClose, history }) => {
  const handleSubmit = () => {
    if (authMiddleware(history)) {
      const token = localStorage.getItem("AuthToken");
      const config = {
        url: `/tarea/${tareaId}`,
        method: "delete",
      };
      axios(config)
        .then((respuesta) => {
          handleClose(true);
        })
        .catch((error) => history.push("/login"));
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <ArrowBackIcon style={{ fontSize: 30 }} />
          </IconButton>
          {"   "}
          {"Estas seguro?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            color="secondary"
            align="center"
          >
            ¡La tarea {`"${titulo}"`} no se podra recuperar!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained" color="secondary">
            Si, eliminar!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withRouter(DeleteTodoDialog);
