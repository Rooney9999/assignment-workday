
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import StatusCode from '../utils/StatusCode';

const initialState = {
    data: [],
    status: StatusCode.IDLE,
};

export const getCandidateDetails = createAsyncThunk('candidates/getCandidateDetails', async ({ limit, offset }, { getState }) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Access-Control-Allow-Origin", "*");

        const body = JSON.stringify({
            limit,
            offset
        });

        const data = await fetch('https://api.weekday.technology/adhoc/getSampleJdJSON', {
            method: "POST",
            headers: myHeaders,
            body,
        });
        const result = await data.json();
        return result.jdList;
    } catch (error) {
        throw Error('Failed to fetch candidate details');
    }
});

const candidateSlice = createSlice({
    name: 'candidate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCandidateDetails.pending, (state, action) => {
                state.status = StatusCode.LOADING;
            })
            .addCase(getCandidateDetails.fulfilled, (state, action) => {
                state.data = state.data.concat(action.payload); 
                state.status = StatusCode.IDLE;
            })
            .addCase(getCandidateDetails.rejected, (state, action) => {
                state.status = StatusCode.ERROR;
            });
    },
});

export default candidateSlice.reducer;
