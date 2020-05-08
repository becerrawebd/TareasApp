import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { Typography } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DetailsTodoDialog({
  open,
  titulo,
  descripcion,
  handleClose,
}) {
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
        <DialogTitle id="alert-dialog-slide-title">{titulo}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-slide-description">
            {descripcion}
          </Typography>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => handleClose()} color="primary">
            <CloseIcon></CloseIcon>
          </IconButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
