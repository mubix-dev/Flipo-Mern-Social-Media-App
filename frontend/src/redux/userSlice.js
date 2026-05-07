import {createSlice} from "@reduxjs/toolkit"

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        suggestedUsers:null,
    },
    reducers:{
        setUserData : (state,action)=>{
            state.userData = action.payload;
        },
        setSuggestedUsersData : (state,action)=>{
            state.suggestedUsers = action.payload;
        },
    }
})

export const {setUserData,setSuggestedUsersData} = userSlice.actions;
export default userSlice.reducer;