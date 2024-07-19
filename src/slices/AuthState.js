import { createSlice } from '@reduxjs/toolkit';
import server from '../networking';

const initialState = {
    authToken: localStorage.getItem('jwt'),
    user: null,
    loaded: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeAuthToken: (state, action) => {
            state.authToken = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loaded = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        logout: (state) => {
            state.authToken = null;
            state.user = null;
            state.error = null;
        },
    },
});

export const { changeAuthToken, setUser, setLoading, setError, logout } = authSlice.actions;

export const fetchUser = () => async (dispatch) => {
    console.log('Fetching user...');
    dispatch(setLoading(false));
    try {
        const response = await server.get('/cdn/myAccount', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
        });
        dispatch(setUser(response.data));
        dispatch(setLoading(true));
    } catch (err) {
        console.log('Error fetching user:', err);
        dispatch(setError(err.response.data));
        dispatch(setLoading(true));
    }
};

export const reloadAuthToken = (authToken) => async (dispatch) => {
    if (localStorage.getItem('tokenRefreshed') == 'true') {
        console.log("Token refreshed.");
        dispatch(changeAuthToken(localStorage.getItem('jwt') || null));
        localStorage.removeItem('tokenRefreshed');
    } else if (authToken && (localStorage.getItem('jwt') == undefined || localStorage.getItem('jwt') == null)) {
        console.log("Token detected to be missing/expired; logging out from redux state.")
        dispatch(logout());
        return;
    }
}

export default authSlice.reducer;