import { createSlice } from "@reduxjs/toolkit"

const initial = {sender:"", receiver: "", foodRating:0, hygieneRating:0, comments:"", images:[], dateCreated:""} //Initial state that will be used by the reducer

export const reviewsSlice = createSlice({
    name: "reviews",
    initialState: { value: initial },
    reducers: {
        submitReviews: (state, action) => {
            state.value = action.payload
        },
    }
})

export const { submitReviews } = reviewsSlice.actions

export default reviewsSlice.reducer