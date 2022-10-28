import React from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
  selectAddressById,
  deleteAddress,
} from "../../features/addresses/addressesSlice";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";

const SingleAddressPage = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addressId } = useParams();

  const address = useSelector((state) => selectAddressById(state, addressId));

  const handleDelete = () => {
    dispatch(deleteAddress(address));
    handleClose();
    navigate("/");
  };

  if (!address) {
    return (
      <section>
        <h2>Address not found!</h2>
      </section>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => navigate("/")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {address.name.length > 10
              ? address.name.substring(0, 10) + "..."
              : address.name}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={() => navigate(`/address/edit/${addressId}`)}
          >
            <EditIcon color="warning" />
          </IconButton>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="error"
            onClick={handleClickOpen}
          >
            <DeleteIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Paper sx={{ inlineSize: "100%", marginBlockStart: "20px" }}>
        <Typography
          paragraph
          variant="body1"
          component="div"
          sx={{
            flexGrow: 1,
            fontSize: "15px",
            color: "skyblue",
            textAlign: "center",
          }}
        >
          Phone
        </Typography>

        <Grid container>
          <Grid item xs={2} display="flex" justifyContent="center">
            <LocalPhoneIcon color="success" />
          </Grid>
          <Grid item xs={10}>
            <Typography
              paragraph
              variant="body1"
              component="div"
              sx={{ flexGrow: 1, fontSize: "15px" }}
            >
              {address.phone}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ inlineSize: "100%", marginBlockStart: "20px" }}>
        <Typography
          paragraph
          variant="body1"
          component="div"
          sx={{
            flexGrow: 1,
            fontSize: "15px",
            color: "skyblue",
            textAlign: "center",
          }}
        >
          Email
        </Typography>

        <Grid container>
          <Grid item xs={2} display="flex" justifyContent="center">
            <EmailIcon color="success" />
          </Grid>
          <Grid item xs={10}>
            <Typography
              paragraph
              variant="body1"
              component="div"
              sx={{ flexGrow: 1, fontSize: "15px" }}
            >
              {address.email}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ inlineSize: "100%", marginBlockStart: "20px" }}>
        <Typography
          paragraph
          variant="body1"
          component="div"
          sx={{
            flexGrow: 1,
            fontSize: "15px",
            color: "skyblue",
            textAlign: "center",
          }}
        >
          Notes
        </Typography>

        <Grid container>
          <Grid item xs={2} display="flex" justifyContent="center">
            <SpeakerNotesIcon color="success" />
          </Grid>
          <Grid item xs={10}>
            <Typography
              paragraph
              variant="body1"
              component="div"
              sx={{ flexGrow: 1, fontSize: "15px" }}
            >
              {address.notes}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ inlineSize: "100%", marginBlockStart: "20px" }}>
        <Typography
          paragraph
          variant="body1"
          component="div"
          sx={{
            flexGrow: 1,
            fontSize: "15px",
            color: "skyblue",
            textAlign: "center",
          }}
        >
          Address
        </Typography>

        <Grid container>
          <Grid item xs={2} display="flex" justifyContent="center">
            <LocationOnIcon color="success" />
          </Grid>
          <Grid item xs={10}>
            <Typography
              paragraph
              variant="body1"
              component="div"
              sx={{ flexGrow: 1, fontSize: "15px" }}
            >
              {address.address}
            </Typography>
            <Button sx={{ my: 2 }} variant="contained" color="primary">
              <a
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none", color: "white" }}
                href={`https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`}
              >
                VIEW ON GOOGLE MAPS
              </a>
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This operation cannot be undone. Are you sure you want to delete
            this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={handleClose}>
            CANCEL
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
            autoFocus
          >
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SingleAddressPage;
