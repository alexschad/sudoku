import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const NewGameDialog = ({ onClose, open }) => {
  const handleClose = () => {
    onClose();
  };

  const selectGameClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Select difficulty</DialogTitle>
      <DialogActions>
      <Button onClick={() => selectGameClick( 'random' )}>Random</Button>
      <Button onClick={() => selectGameClick( 'easy' )}>Easy</Button>
      <Button onClick={() => selectGameClick( 'medium' )}>Medium</Button>
      <Button onClick={() => selectGameClick( 'hard' )}>Hard</Button>
      <Button onClick={() => selectGameClick( 'custom' )}>Custom Game</Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewGameDialog;