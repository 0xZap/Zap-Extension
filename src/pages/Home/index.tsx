import React, {
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useState,
} from 'react';
import Icon from '../../components/Icon';
import classNames from 'classnames';
import { useNavigate } from 'react-router';
import { useRequests } from '../../reducers/requests';
import { PluginList } from '../../components/PluginList';
import PluginUploadInfo from '../../components/PluginInfo';
import { ErrorModal } from '../../components/ErrorModal';

export default function Home(): ReactElement {
  const requests = useRequests();
  const navigate = useNavigate();
  const [error, showError] = useState('');

  return (
    <div className="flex flex-col overflow-y-auto">
      {error && <ErrorModal onClose={() => showError('')} message={error} />}
      <div className="flex flex-col flex-nowrap justify-center">
        <div className="bg-gray-700 flex flex-col w-full justify-center items-center py-4">
          <div className="text-center mb-12">
            <div className="text-gray-400">Main · USDC</div>
            <div className="text-3xl text-white font-bold">$500</div>
            <div className="mt-4">
              <button className="bg-gray-400 text-white py-1 px-6 text-sm rounded-full hover:bg-gray-300 transition-all duration-700 ease-in-out cursor-pointer">
                Accounts
              </button>
            </div>
          </div>
          <div className="w-full px-4 flex space-x-6 mb-6">
            <button className="w-[20%] flex flex-col items-center cursor-pointer">
              <div className="flex flex-col rounded-full items-center justify-center bg-gray-400 text-white p-2 w-8 h-8 mb-2 hover:bg-gray-300 transition-all duration-700 ease-in-out cursor-pointer">
                +
              </div>
              <span className="text-gray-400">Add Money</span>
            </button>
            <button className="w-[20%] flex flex-col items-center cursor-pointer">
              <div className="flex flex-col rounded-full items-center justify-center bg-gray-400 text-white p-2 w-8 h-8 mb-2 hover:bg-gray-300 transition-all duration-700 ease-in-out cursor-pointer">
                ⮂
              </div>
              <span className="text-gray-400">Exchange</span>
            </button>
            <button className="w-[20%] flex flex-col items-center cursor-pointer">
              <div className="flex flex-col rounded-full items-center justify-center bg-gray-400 text-white p-2 w-8 h-8 mb-2 hover:bg-gray-300 transition-all duration-700 ease-in-out cursor-pointer">
                ←
              </div>
              <span className="text-gray-400">Send</span>
            </button>
            <button className="w-[20%] flex flex-col items-center cursor-pointer">
              <div className="flex flex-col rounded-full items-center justify-center bg-gray-400 text-white p-2 w-8 h-8 mb-2 hover:bg-gray-300 transition-all duration-700 ease-in-out cursor-pointer">
                ←
              </div>
              <span className="text-gray-400">Receive</span>
            </button>
          </div>
          <div className="w-full px-4 flex flex-col justify-center items-center">
            <button
              onClick={() => navigate('/home')}
              className="bg-blue-600 text-white py-1 text-md font-bold hover:bg-blue-400 rounded-full w-full transition-all duration-700 ease-in-out cursor-pointer"
            >
              Data Proofs
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col flex-nowrap justify-center p-4">
          {/* <NavButton fa="fa-solid fa-table" onClick={() => navigate('/requests')}>
          <span>Requests</span>
          <span>{`(${requests.length})`}</span>
        </NavButton>
        <NavButton fa="fa-solid fa-hammer" onClick={() => navigate('/custom')}>
          Custom
        </NavButton>
        <NavButton
          fa="fa-solid fa-certificate"
          onClick={() => navigate('/verify')}
        >
          Verify
        </NavButton>
        <NavButton fa="fa-solid fa-list" onClick={() => navigate('/history')}>
          History
        </NavButton> */}
          <NavButton fa="fa-solid fa-check" onClick={() => navigate('/onramp')}>
            OnRamp Proof
          </NavButton>
        </div>
        <div className="flex flex-col py-2 mx-4">
          <p className="text-sm">Version 0.0.10</p>
        </div>
        {/* <NavButton className="relative" fa="fa-solid fa-plus">
          <PluginUploadInfo />
          Add a plugin
        </NavButton>
        <NavButton fa="fa-solid fa-gear" onClick={() => navigate('/options')}>
          Options
        </NavButton> */}
      </div>
      {/* <PluginList className="mx-4" /> */}
    </div>
  );
}

function NavButton(props: {
  fa: string;
  children?: ReactNode;
  onClick?: MouseEventHandler;
  className?: string;
  disabled?: boolean;
}): ReactElement {
  return (
    <button
      className={classNames(
        'flex flex-row flex-nowrap items-center justify-center',
        'text-white rounded px-2 py-1 gap-1',
        {
          'bg-primary/[.8] hover:bg-primary/[.7] active:bg-primary':
            !props.disabled,
          'bg-primary/[.5]': props.disabled,
        },
        props.className,
      )}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <Icon className="flex-grow-0 flex-shrink-0" fa={props.fa} size={1} />
      <span className="flex-grow flex-shrink w-0 font-bold">
        {props.children}
      </span>
    </button>
  );
}
