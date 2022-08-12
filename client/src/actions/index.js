import axios from 'axios';
import { FETCH_USER, FETCH_VENDORS, FETCH_CHARACTERS } from './types';

export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user');
    dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchVendors = () => async dispatch => {
    const res = await axios.get('/api/vendors');
    dispatch({ type: FETCH_VENDORS, payload: res.data });
};

export const fetchCharacters = () => async dispatch => {
    const res = await axios.get('/api/characters');
    dispatch({ type: FETCH_CHARACTERS, payload: res.data });
};