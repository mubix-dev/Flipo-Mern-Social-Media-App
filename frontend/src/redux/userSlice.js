import {createSlice} from "@reduxjs/toolkit"

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        suggestedUsers:null,
        profileData:null,
        following:[]
    },
    reducers:{
        setUserData : (state,action)=>{
            state.userData = action.payload;
            state.following = action.payload?.following || [];
        },
        setSuggestedUsersData : (state,action)=>{
            state.suggestedUsers = action.payload;
        },
        setProfileData : (state,action)=>{
            state.profileData = action.payload;
        },
        setFollowing: (state,action)=>{
            const targetedUserId = action.payload;
            state.following.push(targetedUserId)
        },
        toggleFollowing:(state,action)=>{
            const targetedUserId = action.payload;
            if(state.following.includes(targetedUserId)){
                state.following = state.following.filter(id=>id!=targetedUserId);
            }else{
                state.following.push(targetedUserId)
            }
        }
    }
})

export const {setUserData,setSuggestedUsersData,setProfileData,setFollowing,toggleFollowing} = userSlice.actions;
export default userSlice.reducer;