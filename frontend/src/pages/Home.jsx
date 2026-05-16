import React from 'react';
import { useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import LeftHome from '../components/LeftHome';
import Feed from '../components/Feed';
import RightHome from '../components/RightHome';

function Home() {
  const { userData, suggestedUsers } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const { allStoriesData } = useSelector((state) => state.story);

  if (!userData || !suggestedUsers || !postData || !allStoriesData) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white">
        <ClipLoader color="#870ccf" size={50} />
      </div>
    );
  }

  return (
    <div className='w-full h-screen flex justify-center items-start overflow-hidden bg-black'>     
      <LeftHome />
      <Feed />
      <RightHome />
    </div>
  );
}

export default Home;