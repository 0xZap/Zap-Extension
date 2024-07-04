import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import {
  BackgroundActiontype,
  type RequestLog,
} from '../../entries/Background/rpc';
import { useNavigate } from 'react-router';
import {
  useActiveTabUrl,
  setActiveTab,
  useRequest,
  useRequests,
} from '../../reducers/requests';
import {
  RevolutAction,
  RevolutRequest,
} from '../../utils/types/revolutActions';
import axios from 'axios';
import { urlify } from '../../utils/misc';
import browser from 'webextension-polyfill';
import { useDispatch } from 'react-redux';
import { set } from '../../utils/storage';

export default function Revolut(): ReactElement {
  const dispatch = useDispatch();
  const activeTabUrl = useActiveTabUrl();
  const [loading, setLoading] = useState<boolean>(false);

  const action = RevolutAction.TRANSFER;
  const navigate = useNavigate();
  const requestsFromStorage = useRequests();
  const [displayUrl, setDisplayUrl] = useState<string | undefined>();
  const [state, setState] = useState<Number>(0);
  const [txId, setTxId] = useState<string | undefined>();
  const [txCurrency, setTxCurrency] = useState<string | undefined>();
  const [txAmount, setTxAmount] = useState<string | undefined>();
  const [txRecipient, setTxRecipient] = useState<string | undefined>();
  const [txProof, setTxProof] = useState<string | undefined>();
  const [requestId, setRequestId] = useState<string | undefined>();
  const [filteredRequests, setFilteredRequests] = useState<RequestLog[]>([]);
  const req = useRequest(requestId);

  useEffect(() => {
    if (requestsFromStorage) {
      const filteredRequests = requestsFromStorage.filter((request) => {
        switch (action) {
          case RevolutAction.TRANSFER:
            return request.requestType === RevolutRequest.TRANSFER_DETAILS;
          default:
            return false;
        }
      });

      setFilteredRequests(filteredRequests);

      if (filteredRequests.length > 0) {
        setRequestId(filteredRequests[filteredRequests.length - 1].requestId);
      } else {
        setRequestId(undefined);
      }
    } else {
      setFilteredRequests([]);
    }
  }, [requestsFromStorage, action]);

  useEffect(() => {
    if (req) {
      setDisplayUrl(req.url);
    }
  }, [req]);

  const notarizeTransferRevolut = useCallback(async () => {
    setLoading(true);
    if (!filteredRequests || filteredRequests.length === 0) return;

    if (!req) return;

    console.log('Request: ', req);

    const hostname = urlify(req.url)?.hostname;
    const headers: { [k: string]: string } = req.requestHeaders.reduce(
      (acc: any, h) => {
        acc[h.name] = h.value;
        return acc;
      },
      { Host: hostname },
    );

    //TODO: for some reason, these needs to be override to work
    headers['Accept-Encoding'] = 'identity';
    headers['Connection'] = 'close';

    const data = {
      url: req.url,
      method: req.method,
      headers: headers,
      body: req.requestBody,
    };

    console.log('Data: ', data);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/proof_of_transaction',
        data,
      );
      console.log('Response: ', response);
      setTxId(response.data.id);
      setTxCurrency(response.data.currency);
      setTxAmount(response.data.amount);
      setTxRecipient(response.data.recipient);
      setTxProof(response.data.transaction_proof);
      setState(1);
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setLoading(false);
    }
  }, [req]);

  async function sendVerification() {
    if (!txProof) return;

    console.log('Sending verification');

    alert('Verification sent!');

    navigate('/');
  }

  return (
    <div className="flex flex-col flex-nowrap flex-grow">
      <div className="flex flex-row flex-nowrap bg-gray-100 py-4 px-4 gap-2">
        <p>Revolut On Ramp</p>
      </div>
      <div className="flex flex-col gap-4 flex-nowrap overflow-y-auto p-4">
        <p className="mb-2 text-gray-700">
          <span className="font-bold">First Step: </span> Open your Revolut
          Account in browser
        </p>
        <div
          onClick={() =>
            chrome.tabs.update({ url: 'https://app.revolut.com/start' })
          }
          className="flex flex-row justify-center items-center w-full py-1 flex-nowrap shadow-lg rounded-md p-2 text-gray-700 hover:text-black hover:bg-gray-200 cursor-pointer transition-all duration-500 ease-in-out"
        >
          <p>Go to Revolut</p>
        </div>
        <div className="flex flex-col gap-2 flex-nowrap">
          <p className="text-gray-700 truncate">
            <span className="font-bold">Current URL: </span>
            {displayUrl}
          </p>
        </div>
        <p className="mb-2 text-gray-700">
          <span className="font-bold">Second Step: </span> Go to any transaction
          and open it, then you can click the button below to create a
          transaction proof
        </p>
        <button
          disabled={filteredRequests.length === 0 || loading}
          onClick={notarizeTransferRevolut}
          className="flex flex-row justify-center items-center w-full py-1 flex-nowrap shadow-lg rounded-md p-2 text-gray-700 hover:text-black hover:bg-gray-200 cursor-pointer transition-all duration-500 ease-in-out disabled:text-gray-200 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading Proof...' : 'Create Transaction Proof'}
        </button>
        <div className="flex flex-col gap-2 flex-nowrap">
          <p className="text-gray-700 truncate">
            <span className="font-bold">Transaction ID: </span>
            {txId}
          </p>
          <p className="text-gray-700 truncate">
            <span className="font-bold">Currency: </span>
            {txCurrency}
          </p>
          <p className="text-gray-700 truncate">
            <span className="font-bold">Amount: </span>
            {txAmount}
          </p>
          <p className="text-gray-700 truncate">
            <span className="font-bold">Recipient: </span>
            {txRecipient}
          </p>
          <p className="text-gray-700 truncate">
            <span className="font-bold">Proof: </span>
            {txProof}
          </p>
        </div>
        <p className="mb-2 text-gray-700">
          <span className="font-bold">Third Step: </span> Now you can send us
          the proof and complete the verification
        </p>
        <button
          disabled={state !== 1}
          onClick={sendVerification}
          className="flex flex-row justify-center items-center w-full py-1 flex-nowrap shadow-lg rounded-md p-2 text-gray-700 hover:text-black hover:bg-gray-200 cursor-pointer transition-all duration-500 ease-in-out disabled:text-gray-200 disabled:cursor-not-allowed"
        >
          Complete Verification
        </button>
      </div>
    </div>
  );
}
