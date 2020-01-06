
import React from "react";

import {
    makeStyles,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,

} from '@material-ui/core/';

const useStyles = makeStyles(theme => ({
    title: {
        textAlign: 'center',
        fontSize: 30,
    },


}));

const MsgToShow = ({ title, body, visible, handleClose }) => {

    const classes = useStyles();

    function _handleClose() {
        handleClose();
    }

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={visible}
            onClose={_handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" className={classes.title}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {body}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={_handleClose} color="primary">
                    OK
          </Button>
            </DialogActions>
        </Dialog>
    );
}

export { MsgToShow };