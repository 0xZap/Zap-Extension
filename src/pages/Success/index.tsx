import { Player } from '@lottiefiles/react-lottie-player';
import Animation from '../../assets/congrats_animation.json';
import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router';

export default function Success(): ReactElement {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-three-radial p-4">
      {/* <div className="w-[200px] h-auto">
        <Player src={Animation} className="player" loop autoplay />
      </div> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-circle-check-big"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
      </svg>
      <p className="mt-12 mb-12 text-white font-bold">
        Congratulations! You have successfully created a transaction proof.
      </p>
      <div
        onClick={() => navigate('/')}
        className="font-bold bg-[#00ff95] text-[#000732] flex flex-row justify-center items-center w-full py-1 flex-nowrap shadow-xl rounded-md p-2 hover:text-white hover:bg-[#000732] cursor-pointer transition-all duration-500 ease-in-out"
      >
        <p>Use Again</p>
      </div>
    </div>
  );
}
