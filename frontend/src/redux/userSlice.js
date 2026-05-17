import {createSlice} from "@reduxjs/toolkit"

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        suggestedUsers:null,
        profileData:null,
        following:[],
        followingList:null,
        searchData:null,
        notificationsData:[]

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
        setFollowingList: (state,action)=>{
            state.followingList = action.payload;
        },
        setSearchData: (state,action)=>{
            state.searchData = action.payload;
        },
        setNotificationsData: (state,action)=>{
            state.notificationsData = action.payload;
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

export const {setUserData,setSuggestedUsersData,setProfileData,setFollowing,toggleFollowing,setFollowingList,setSearchData,setNotificationsData} = userSlice.actions;
export default userSlice.reducer;