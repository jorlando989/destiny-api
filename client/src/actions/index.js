import axios from 'axios';
import { FETCH_USER, FETCH_VENDORS, FETCH_CHARACTERS, FETCH_SELECTED_CHAR, SELECT_CHAR, FETCH_WEEKLY_ACTIVITIES } from './types';

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

export const selectChar = (selectedChar) => async dispatch => {
    if(selectedChar) {
        const res = await axios.post('/api/select_char', {selectedChar});
        dispatch({type: SELECT_CHAR, payload: res.data});
    } else {
        const res = await axios.get('/api/selected_char');
        dispatch({type: FETCH_SELECTED_CHAR, payload: res.data});
    }
};

export const fetchWeeklyActivities = () => async dispatch => {
    const res = await axios.get('/api/weekly');
    dispatch({ type: FETCH_WEEKLY_ACTIVITIES, payload: res.data });
};