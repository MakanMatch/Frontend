import { createSlice } from '@reduxjs/toolkit';

export const universalSlice = createSlice({
    name: 'universal',
    initialState: {
        systemVersion: '1.0',
        systemName: 'MakanMatch Frontend'
    },
    reducers: {
        changeSystemVersion: (state, action) => {
            state.systemVersion = action.payload;
        },
        changeSystemName: (state, action) => {
            state.systemName = action.payload;
        }
    }
})

export const { changeSystemVersion, changeSystemName } = universalSlice.actions;
export default universalSlice.reducer;