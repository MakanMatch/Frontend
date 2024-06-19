import { createSlice } from "@reduxjs/toolkit";


export const foodListingSlice = createSlice({
    name: "FoodListing",
    initialState: { value: {name: "", host: "", favourite: false, price: 0, rating: 0} },
    reducers: {
        add: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { login } = foodListingSlice.actions

export default foodListingSlice.reducer