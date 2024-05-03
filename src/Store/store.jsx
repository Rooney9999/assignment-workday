import { configureStore } from "@reduxjs/toolkit";

import CandidateSlice from "./CandidateSlice";

const store = configureStore({
    reducer : {
        candidates: CandidateSlice
    }
})

export default store;