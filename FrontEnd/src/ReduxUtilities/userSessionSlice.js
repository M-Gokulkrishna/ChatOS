import { createSlice } from '@reduxjs/toolkit';
// 
const userSessionReducer = createSlice({
    name: "userSessionState",
    initialState: {
        userSessionStatus: "",
        userSessionData: {
            userID: "",
            isProfileUpdated: false
        }
    },
    reducers: {
        setUserSessionStatus: (state, action) => {
            state.userSessionStatus = action.payload;
        },
        setUserSessionState: (state, action) => {
            state.userSessionData = action.payload;
        }
    }
});
// 
export const { setUserSessionState, setUserSessionStatus } = userSessionReducer.actions;
export default userSessionReducer.reducer;