import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { db } from "../../utils/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

const initialState = {
  addresses: [],
  status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchAddresses = createAsyncThunk(
  "addresses/fetchAddresses",
  async (userId) => {
    const q = query(collection(db, "addresses"), where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    let result = [];

    querySnapshot.forEach((doc) => result.push(doc.data()));

    return result;
  }
);

export const addNewAddress = createAsyncThunk(
  "addresses/addNewAddress",
  async (initialAddress) => {
    await addDoc(collection(db, "addresses"), initialAddress);

    const q = query(
      collection(db, "addresses"),
      where("userId", "==", initialAddress.userId)
    );

    const querySnapshot = await getDocs(q);
    let result = [];

    querySnapshot.forEach((doc) => result.push(doc.data()));

    return result;
  }
);

export const updateAddress = createAsyncThunk(
  "addresses/updateAddress",
  async (initialAddress) => {
    const { id, userId } = initialAddress;

    const qUpdate = query(collection(db, "addresses"), where("id", "==", id));

    const querySnapshotUpdate = await getDocs(qUpdate);

    querySnapshotUpdate.forEach(
      async (doc) => await setDoc(doc.ref, initialAddress)
    );

    const q = query(collection(db, "addresses"), where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    let result = [];

    querySnapshot.forEach((doc) => result.push(doc.data()));

    return {
      addresses: result.filter((a) => a.id !== id),
      updatedAddress: initialAddress,
    };
  }
);

export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",
  async (initialAddress) => {
    const { id, userId } = initialAddress;

    const qDelete = query(collection(db, "addresses"), where("id", "==", id));

    const querySnapshotDelete = await getDocs(qDelete);

    querySnapshotDelete.forEach(async (doc) => await deleteDoc(doc.ref));

    const q = query(collection(db, "addresses"), where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    let result = [];

    querySnapshot.forEach((doc) => result.push(doc.data()));

    return { addresses: result, deletedAddress: initialAddress };
  }
);

const addressesSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAddresses.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Transform firebase response

        let loadedAddresses = [...state.addresses];

        action.payload.forEach((address) => {
          if (!loadedAddresses.find((a) => a.id === address.id)) {
            loadedAddresses.push(address);
          }
        });

        // Add any fetched posts to the array
        state.addresses = loadedAddresses;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        let loadedAddresses = [...state.addresses];

        action.payload.forEach((address) => {
          if (!loadedAddresses.find((a) => a.id === address.id)) {
            loadedAddresses.push(address);
          }
        });

        // Add any fetched posts to the array
        state.addresses = loadedAddresses;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        let loadedAddresses = [...state.addresses];

        action.payload.addresses.forEach((address) => {
          if (!loadedAddresses.find((a) => a.id === address.id)) {
            loadedAddresses.push(address);
          }
        });

        loadedAddresses = loadedAddresses.filter(
          (a) => a.id !== action.payload.updatedAddress.id
        );

        loadedAddresses.push(action.payload.updatedAddress);

        // Add any fetched posts to the array
        state.addresses = loadedAddresses;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        let loadedAddresses = [...state.addresses];

        action.payload.addresses.forEach((address) => {
          if (!loadedAddresses.find((a) => a.id === address.id)) {
            loadedAddresses.push(address);
          }
        });

        loadedAddresses = loadedAddresses.filter(
          (a) => a.id !== action.payload.deletedAddress.id
        );

        // Add any fetched posts to the array
        state.addresses = loadedAddresses;
      });
  },
});

export const selectAllAddresses = (state) => state.addresses.addresses;
export const selectAddressesStatus = (state) => state.addresses.status;
export const selectAddressesError = (state) => state.addresses.error;

export const selectAddressById = (state, addressId) =>
  state.addresses.addresses.find((address) => address.id === addressId);

export default addressesSlice.reducer;
