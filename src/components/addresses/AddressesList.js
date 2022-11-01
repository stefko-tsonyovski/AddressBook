import React from "react";

import AddressCard from "./AddressCard";

import { useSelector } from "react-redux";
import {
  selectAddressesStatus,
  selectAddressesError,
  selectAddressIdsByUserAndSearchValue,
} from "../../features/addresses/addressesSlice";

import { useAtom } from "jotai";
import { currentUserAtom } from "../../atoms";
import { searchValueAtom } from "../../atoms";

import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import List from "@mui/material/List";
import Fab from "@mui/material/Fab";

import AddIcon from "@mui/icons-material/Add";

const AddressesList = () => {
  const navigate = useNavigate();

  const fabStyle = {
    position: "absolute",
    bottom: 16,
    right: 16,
  };

  const [user] = useAtom(currentUserAtom);
  const [searchValue] = useAtom(searchValueAtom);

  const addressIds = useSelector((state) =>
    selectAddressIdsByUserAndSearchValue(state, user?.id, searchValue)
  );
  const status = useSelector(selectAddressesStatus);
  const error = useSelector(selectAddressesError);

  let content;
  if (!user) {
    navigate("/login");
  } else if (status === "loading") {
    content = <p>"Loading..."</p>;
  } else if (status === "succeeded") {
    content = addressIds
      ? addressIds
          // .filter(
          //   (a) =>
          //     a.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          //     a.phone.toLowerCase().includes(searchValue.toLowerCase()) ||
          //     a.address.toLowerCase().includes(searchValue.toLowerCase())
          // )
          .map((addressId) => (
            <AddressCard key={addressId} addressId={addressId} />
          ))
      : [];
  } else if (status === "failed") {
    content = <p>{error}</p>;
  }

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
