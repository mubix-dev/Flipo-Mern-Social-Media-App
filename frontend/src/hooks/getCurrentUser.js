import axios from "axios"
import { useEffect } from "react"
import { serverURL } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "../redux/userSlice"


const getCurrentUser = ()=>{
    const dispatch = useDispatch();
    const {userData} = useSelector(state=>state.user)
    useEffect(()=>{
        const fetchCurrUserData = async ()=>{
            try {
                const result = await axios.get(`${serverURL}/api/user/current`,{withCredentials:true});
                dispatch(setUserData(result.data))
            } catch (error) {
                console.log(error)
            }
        }

        fetchCurrUserData();
    },[dispatch])

}

export default getCurrentUser;