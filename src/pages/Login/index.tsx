import React, { ReactElement, useState } from 'react';
import Icon from '../../components/Icon';
import { useNavigate } from 'react-router';
import { useRequests } from '../../reducers/requests';
import logo from '../../assets/img/icon-128-white.png';

export default function Login(): ReactElement {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-full gap-4 p-6 overflow-y-auto bg-three-radial">
      <div className="flex-1 w-full flex flex-col justify-center items-center space-y-8">
        <img className="w-64 h-auto" src={logo} alt="logo" />
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-white text-xl font-bold">Welcome to Z2Z</h1>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center py-12">
        <button
          onClick={() => navigate('/revolut')}
          className="text-md bg-[#00ff95] text-[#000732] border-[2px] border-transparent py-1 text-md font-bold hover:bg-white hover:text-secondary hover:border-secondary rounded-full w-full transition-all duration-700 ease-in-out cursor-pointer"
        >
          Prove your Transaction
        </button>
      </div>
    </div>
  );
}
