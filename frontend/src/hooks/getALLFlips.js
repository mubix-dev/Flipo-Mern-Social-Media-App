import axios from "axios";
import { useEffect } from "react";
import { serverURL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setFlipData } from "../redux/flipSlice";

const getAllFlips = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    const fetchAllFlipsData = async () => {
      try {
        const result = await axios.get(`${serverURL}/api/flip/getAllFlips`, {
          withCredentials: true,
        });
        dispatch(setFlipData(result.data));
      } catch (error) {
        console.log("Error loading flips feed:", error);
      }
    };

    fetchAllFlipsData();
  }, [dispatch, userData]);
};

export default getAllFlips;