import {configureStore} from "@reduxjs/toolkit"
import userSlice from "../redux/userSlice.js"
import postSlice from "../redux/postSlice.js"
import storySlice from "../redux/storySlice.js"
import flipSlice from "../redux/flipSlice.js"
import messageSlice from "../redux/messageSlice.js"
const store = configureStore({
    reducer:{
        user:userSlice,
        post:postSlice,
        story:storySlice,
        flip:flipSlice,
        message:messageSlice
    }
})


export default store;