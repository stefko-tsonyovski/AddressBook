import React from "react";

import { ListItem } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectAddressById } from "../../features/addresses/addressesSlice";

const AddressCard = ({ addressId }) => {
  const navigate = useNavigate();
  const address = useSelector((state) => selectAddressById(state, addressId));

  return (
    <div>
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
  );
};

export default AddressCard;
