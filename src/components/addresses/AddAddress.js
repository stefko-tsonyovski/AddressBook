import React, { useState } from "react";
import { uuidv4 } from "@firebase/util";

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";

import { useAtom } from "jotai";
import { currentUserAtom } from "../../atoms";

import { useDispatch } from "react-redux";
import { addNewAddress } from "../../features/addresses/addressesSlice";

import { Navigate, useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";

const AddAddress = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user] = useAtom(currentUserAtom);

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const canSave = addRequestStatus === "idle";

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Image must smaller than 10MB!");
    }
    return isJpgOrPng && isLt10M;
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  function handleLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
      setOpen(true);
    }
  }

  function showPosition(position) {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  }

  const handleSubmit = async () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        const initialAddress = {
          id: uuidv4(),
          name,
          imageUrl,
          address,
          email,
          phone,
          notes,
          latitude,
          longitude,
          userId: user.uid,
        };
        dispatch(addNewAddress(initialAddress));

        setName("");
        setAddress("");
        setEmail("");
        setPhone("");
        setNotes("");

        navigate("/");
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
                onClick={() => navigate("/")}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Add
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

          <Collapse in={open}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ my: 2 }}
            >
              Current Location saved successfully!
            </Alert>
          </Collapse>

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
                <ImageIcon />
              </Grid>
              <Grid item xs={10} display="flex" alignItems="center">
                <span>Image</span>
              </Grid>
            </Grid>
          </div>
          <Grid container>
            <Grid
              item
              xs={4}
              display="flex"
              sx={{ p: 2 }}
              justifyContent="center"
            >
              <Upload
                name="image"
                listType="picture-card"
                className="image-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={handleChange}
                style={{ marginBlockStart: "20px" }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Place"
                    style={{
                      width: "100%",
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
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

            <Grid item xs={12} display="flex" justifyContent="center">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLocation}
              >
                SAVE CURRENT LOCATION
              </Button>
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

export default AddAddress;
