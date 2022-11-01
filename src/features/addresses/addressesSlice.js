import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";

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

const addressesAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.name.localeCompare(a.name),
});

const initialState = addressesAdapter.getInitialState({
  status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
});

export const fetchAddresses = createAsyncThunk(
  "addresses/fetchAddresses",
  async () => {
    const q = query(collection(db, "addresses"));

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

    return initialAddress;
  }
);

export const updateAddress = createAsyncThunk(
  "addresses/updateAddress",
  async (initialAddress) => {
    const { id } = initialAddress;

    const qUpdate = query(collection(db, "addresses"), where("id", "==", id));

    const querySnapshotUpdate = await getDocs(qUpdate);

    querySnapshotUpdate.forEach(
      async (doc) => await setDoc(doc.ref, initialAddress)
    );

    return initialAddress;
  }
);

export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",
  async (initialAddress) => {
    const { id } = initialAddress;

    const qDelete = query(collection(db, "addresses"), where("id", "==", id));

    const querySnapshotDelete = await getDocs(qDelete);

    querySnapshotDelete.forEach(async (doc) => await deleteDoc(doc.ref));

    return initialAddress;
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
        addressesAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        addressesAdapter.addOne(state, action.payload);
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        addressesAdapter.upsertOne(state, action.payload);
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }

        const { id } = action.payload;
        addressesAdapter.removeOne(state, id);
      });
  },
});

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllAddresses,
  selectById: selectAddressById,
  selectIds: selectAddressIds,
  // Pass in a selector that returns the addresses slice of state
} = addressesAdapter.getSelectors((state) => state.addresses);

export const selectAddressIdsByUserAndSearchValue = createSelector(
  [selectAllAddresses, (state, userId) => userId],
  (addresses, userId) =>
    addresses
      .filter((address) => address.userId === userId)
      .map((address) => address.id)
);

export const selectAddressesStatus = (state) => state.addresses.status;
export const selectAddressesError = (state) => state.addresses.error;

export default addressesSlice.reducer;
