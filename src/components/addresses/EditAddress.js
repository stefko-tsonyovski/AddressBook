import React, { useState } from "react";

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";

import { useAtom } from "jotai";
import { currentUserAtom } from "../../atoms";

import { useDispatch, useSelector } from "react-redux";
import { selectAddressById } from "../../features/addresses/addressesSlice";
import { updateAddress } from "../../features/addresses/addressesSlice";

import { Navigate, useNavigate, useParams } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";

const EditAddress = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addressId } = useParams();

  const addressObj = useSelector((state) =>
    selectAddressById(state, addressId)
  );
  const [user] = useAtom(currentUserAtom);

  const [name, setName] = useState(addressObj.name);
  const [address, setAddress] = useState(addressObj.address);
  const [email, setEmail] = useState(addressObj.email);
  const [phone, setPhone] = useState(addressObj.phone);
  const [notes, setNotes] = useState(addressObj.notes);

  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const canSave = addRequestStatus === "idle";

  const handleSubmit = async () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        const initialAddress = {
          id: addressId,
          name,
          address,
          email,
          phone,
          notes,
          userId: user.uid,
        };
        dispatch(updateAddress(initialAddress));

        setName("");
        setAddress("");
        setEmail("");
        setPhone("");
        setNotes("");

        navigate(`/address/${addressId}`);
      } catch (err) {
        console.error("Failed to save the address", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  return (
    <>
      {user ? (
        <div style={{ backgroundColor: "white" }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => navigate(`/address/${addressId}`)}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Edit
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleSubmit}
              >
                <SaveIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <div
            style={{
              inlineSize: "100%",
              backgroundColor: "skyblue",
              marginBlockStart: "30px",
            }}
          >
            <Grid container spacing={1}>
              <Grid
                item
                xs={2}
                display="flex"
                alignItems="center"
                justifyContent="end"
              >
                <DriveFileRenameOutlineIcon />
              </Grid>
              <Grid item xs={10} display="flex" alignItems="center">
                <span>Name</span>
              </Grid>
            </Grid>
          </div>
          <Grid container>
            <Grid item xs={12} display="flex" justifyContent="center">
              <FormControl sx={{ py: 2 }} variant="standard">
                <Input
                  id="standard-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>

          <div
            style={{
              inlineSize: "100%",
              backgroundColor: "skyblue",
              marginBlockStart: "30px",
            }}
          >
            <Grid container spacing={1}>
              <Grid
                item
                xs={2}
                display="flex"
                alignItems="center"
                justifyContent="end"
              >
                <LocationOnIcon />
              </Grid>
              <Grid item xs={10} display="flex" alignItems="center">
                <span>Address</span>
              </Grid>
            </Grid>
          </div>
          <Grid container>
            <Grid item xs={12} display="flex" justifyContent="center">
              <FormControl sx={{ py: 2 }} variant="standard">
                <Input
                  id="standard-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>

          <div
            style={{
              inlineSize: "100%",
              backgroundColor: "skyblue",
              marginBlockStart: "30px",
            }}
          >
            <Grid container spacing={1}>
              <Grid
                item
                xs={2}
                display="flex"
                alignItems="center"
                justifyContent="end"
              >
                <LocalPhoneIcon />
              </Grid>
              <Grid item xs={10} display="flex" alignItems="center">
                <span>Phone</span>
              </Grid>
            </Grid>
          </div>
          <Grid container>
            <Grid item xs={12} display="flex" justifyContent="center">
              <FormControl sx={{ py: 2 }} variant="standard">
                <Input
                  id="standard-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>

          <div
            style={{
              inlineSize: "100%",
              backgroundColor: "skyblue",
              marginBlockStart: "30px",
            }}
          >
            <Grid container spacing={1}>
              <Grid
                item
                xs={2}
                display="flex"
                alignItems="center"
                justifyContent="end"
              >
                <EmailIcon />
              </Grid>
              <Grid item xs={10} display="flex" alignItems="center">
                <span>Email</span>
              </Grid>
            </Grid>
          </div>
          <Grid container>
            <Grid item xs={12} display="flex" justifyContent="center">
              <FormControl sx={{ py: 2 }} variant="standard">
                <Input
                  id="standard-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>

          <div
            style={{
              inlineSize: "100%",
              backgroundColor: "skyblue",
              marginBlockStart: "30px",
            }}
          >
            <Grid container spacing={1}>
              <Grid
                item
                xs={2}
                display="flex"
                alignItems="center"
                justifyContent="end"
              >
                <SpeakerNotesIcon />
              </Grid>
              <Grid item xs={10} display="flex" alignItems="center">
                <span>Notes</span>
              </Grid>
            </Grid>
          </div>
          <Grid container>
            <Grid item xs={12} display="flex" justifyContent="center">
              <FormControl sx={{ py: 2 }} variant="standard">
                <Input
                  id="standard-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </div>
      ) : (
        <Navigate to="login" replace />
      )}
    </>
  );
};

export default EditAddress;
