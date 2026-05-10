import axios from "axios"
import { useEffect } from "react"
import { serverURL } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setPostData } from "../redux/postSlice"


const getAllPosts = ()=>{
    const dispatch = useDispatch();
    const {postData} = useSelector(state=>state.post)
    const {userData} = useSelector(state=>state.user)
    useEffect(()=>{
        const fetchAllPostsData = async ()=>{
            try {
                const result = await axios.get(`${serverURL}/api/post/getAllPosts`,{withCredentials:true});
                dispatch(setPostData(result.data))
            } catch (error) {
                console.log(error)
            }
        }

        fetchAllPostsData();
    },[dispatch])

}

export default getAllPosts;