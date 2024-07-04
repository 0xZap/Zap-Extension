import React, { ReactElement, useState } from 'react';
import { useNavigate } from 'react-router';
import { useRequests } from '../../reducers/requests';
import revolutlogo from '../../assets/img/revolut-icon.png';

export default function Onramp(): ReactElement {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-nowrap flex-grow">
      <div className="flex flex-row flex-nowrap bg-gray-100 py-4 px-4 gap-2">
        <p>OnRamp Options</p>
      </div>
      <div className="flex flex-col gap-2 flex-nowrap overflow-y-auto p-4">
        {/* FAZER UM MAPPING AQUI COM TODAS AS OPTIONS DE ONRAMP */}
        <div
          onClick={() => navigate('/revolut')}
          className="flex flex-row w-full py-1 px-4 flex-nowrap border-transparent shadow-md border-[2px] rounded-md p-2 hover:bg-gray-100 hover:border-gray-400 cursor-pointer transition-all duration-500 ease-in-out"
        >
          <img src={revolutlogo} alt="Revolut" className="h-4 w-4 mr-4" />
          <p>Revolut</p>
        </div>
      </div>
    </div>
  );
}
