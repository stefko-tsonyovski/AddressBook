import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  selectAllAddresses,
  selectAddressesStatus,
  selectAddressesError,
  fetchAddresses,
} from "../../features/addresses/addressesSlice";

import { useAtom } from "jotai";
import { currentUserAtom } from "../../atoms";
import { searchValueAtom } from "../../atoms";

import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";

import AddIcon from "@mui/icons-material/Add";

const AddressesList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fabStyle = {
    position: "absolute",
    bottom: 16,
    right: 16,
  };

  const [user] = useAtom(currentUserAtom);
  const [searchValue] = useAtom(searchValueAtom);

  const addresses = useSelector(selectAllAddresses);
  const status = useSelector(selectAddressesStatus);
  const error = useSelector(selectAddressesError);

  let content;
  if (!user) {
    navigate("/login");
  } else if (status === "loading") {
    content = <p>"Loading..."</p>;
  } else if (status === "succeeded") {
    content = addresses
      ? addresses
          .filter(
            (a) =>
              a.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              a.phone.toLowerCase().includes(searchValue.toLowerCase()) ||
              a.address.toLowerCase().includes(searchValue.toLowerCase())
          )
          .map((address) => (
            <div key={address.id}>
              <ListItem
                onClick={() => navigate(`/address/${address.id}`)}
                sx={{ backgroundColor: "white" }}
              >
                <Grid container>
                  <Grid item xs={3} display="flex" alignItems="center">
                    {address.imageUrl ? (
                      <img
                        style={{ borderRadius: "50%" }}
                        width={45}
                        height={45}
                        src={address.imageUrl}
                        alt={address.name}
                      />
                    ) : (
                      <div
                        style={{
                          inlineSize: "45px",
                          blockSize: "45px",
                          borderRadius: "50%",
                          backgroundColor: "skyblue",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "20px",
                            position: "absolute",
                            insetBlockEnd: "15px",
                            insetInlineStart: "32px",
                          }}
                        >
                          {address.name[0]}
                        </p>
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={9}>
                    <Typography
                      paragraph
                      variant="body1"
                      component="div"
                      sx={{ flexGrow: 1, fontSize: "15px" }}
                    >
                      {address.name}
                    </Typography>
                    <Typography
                      paragraph
                      variant="body1"
                      component="div"
                      sx={{
                        flexGrow: 1,
                        fontSize: "12px",
                        color: "grey",
                        marginBlockStart: "-10px",
                      }}
                    >
                      {address.phone}
                    </Typography>
                    <Typography
                      paragraph
                      variant="body1"
                      component="div"
                      sx={{
                        flexGrow: 1,
                        fontSize: "12px",
                        color: "grey",
                        marginBlockStart: "-15px",
                      }}
                    >
                      {address.address}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider />
            </div>
          ))
      : [];
  } else if (status === "failed") {
    content = <p>{error}</p>;
  }

  useEffect(() => {
    dispatch(fetchAddresses(user?.uid));
  }, [dispatch, user?.uid]);

  return (
    <>
      {user ? (
        <div>
          <List>{content}</List>
          <Fab
            sx={{ ...fabStyle }}
            onClick={() => navigate("/add")}
            color="primary"
            aria-label="add"
          >
            <AddIcon />
          </Fab>
        </div>
      ) : (
        <Navigate to="login" replace />
      )}
    </>
  );
};

export default AddressesList;
