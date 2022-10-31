import "./App.css";

import Layout from "./components/Layout";
import AddressesList from "./components/addresses/AddressesList";
import Login from "./components/Login";
import Register from "./components/Register";
import AddAddress from "./components/addresses/AddAddress";
import SingleAddressPage from "./components/addresses/SingleAddressPage";
import EditAddress from "./components/addresses/EditAddress";

import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { signIn, signOutFunc, getCurrentUser } from "./utils/firebase";

function App() {
  // const logOut = async () => {
  //   await signOutFunc();
  //   setUser(getCurrentUser());
  //   console.log(getCurrentUser());
  // };

  return (
    // <div>
    //   {user ? (
    //     <button onClick={() => logOut()}>Sign out</button>
    //   ) : (
    //     <button onClick={() => logIn()}>Sign in</button>
    //   )}
    //   {user?.displayName}
    // </div>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AddressesList />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* <Route path="address">
          <Route index element={<AddPostForm />} />
          <Route path=":addressId" element={<SinglePostPage />} />
          <Route path="edit/:addressId" element={<EditPostForm />} />
        </Route> */}

        {/* Catch all - replace with 404 component if you want */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="add" element={<AddAddress />} />
      <Route path="/address/:addressId" element={<SingleAddressPage />} />
      <Route path="/address/edit/:addressId" element={<EditAddress />} />
    </Routes>
  );
}

export default App;
