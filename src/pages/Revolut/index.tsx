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
import { useDispatch } from 'react-redux';

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

      const transactionData = {
        tlsn_id: response.data.id,
        currency: response.data.currency,
        amount: response.data.amount,
        recipient: response.data.recipient,
        transaction_proof: response.data.transaction_proof,
      };

      chrome.runtime.sendMessage({
        action: 'request_extension_data',
        data: transactionData,
      });

      // set delay 4s
      await new Promise((resolve) => setTimeout(resolve, 5000));

      setState(1);
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setLoading(false);
      navigate('/success');
    }
  }, [req]);

  function divideAndFormat(numberStr: string): string {
    // Convert the string to a BigInt
    const number = BigInt(numberStr);

    // Perform the division
    const divisor = BigInt(10 ** 18);
    const result = number / divisor;

    // Get the remainder for the decimal part
    const remainder = number % divisor;
    const decimalPart = Number(remainder) / Number(divisor);

    // Format the result with 2 decimal places
    const formattedResult = `${result}.${Math.floor(decimalPart * 100)
      .toString()
      .padStart(2, '0')}`;

    return formattedResult;
  }

  // async function sendVerification() {
  //   if (!txProof) return;

  //   try {
  //     const transactionData = {
  //       tlsn_id: txId,
  //       currency: txCurrency,
  //       amount: txAmount,
  //       recipient: txRecipient,
  //       transaction_proof: txProof,
  //     };

  //     chrome.runtime.sendMessage({
  //       action: 'request_extension_data',
  //       data: transactionData,
  //     });

  //     // const response = await axios.post(
  //     //   'http://127.0.0.1:4000/tlsn/',
  //     //   transactionData,
  //     // );

  //     // console.log('Response: ', response);

  //     setState(2);
  //   } catch (error) {
  //     console.error('Error: ', error);
  //   } finally {
  //     alert('Verification Completed');
  //     navigate('/');
  //   }
  // }

  return (
    <div className="flex flex-col flex-nowrap flex-grow bg-three-radial">
      <div className="flex flex-row text-white flex-nowrap bg-black/30 backdrop-blur-md py-2 px-4 gap-2">
        <p>Revolut On Ramp / Off Ramp </p>
      </div>
      <div className="flex flex-col gap-4 flex-nowrap overflow-y-auto p-4">
        <p className="mb-2 text-white">
          <span className="font-bold">First Step: </span> Open your Revolut
          Account in browser
        </p>
        <div
          onClick={() =>
            chrome.tabs.update({ url: 'https://app.revolut.com/start' })
          }
          className="font-bold text-md flex flex-row font-bold bg-black/30 backdrop-blur-md justify-center items-center w-full py-1 flex-nowrap shadow-xl rounded-md p-2 text-white hover:text-[#000732] hover:bg-white cursor-pointer transition-all duration-500 ease-in-out"
        >
          <p>Go to Revolut</p>
        </div>
        {/* <div className="flex flex-col gap-2 flex-nowrap">
          <p className="text-white truncate">
            <span className="font-bold">Current URL: </span>
            {displayUrl}
          </p>
        </div> */}
        <p className="mt-4 mb-2 text-white">
          <span className="font-bold">Second Step: </span> Go to any transaction
          and open it, then you can click the button below to create a
          transaction proof usign TLSN
        </p>
        <button
          disabled={filteredRequests.length === 0 || loading}
          onClick={notarizeTransferRevolut}
          className="font-bold text-md flex flex-row font-bold bg-[#00ff95] backdrop-blur-md justify-center items-center w-full py-1 flex-nowrap shadow-xl rounded-md p-2 text-[#000732] hover:text-[#000732] hover:bg-white cursor-pointer transition-all duration-500 ease-in-out disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-300 disabled:border-transparent"
        >
          {loading ? 'Loading Proof...' : 'Create Transaction Proof'}
        </button>
        <div className="mt-4 flex flex-col gap-3 flex-nowrap p-3 border-[1px] border-[#00ff95] rounded-md">
          <p className="text-white truncate">
            <span className="font-bold">Transaction ID: </span>
            {txId}
          </p>
          <p className="text-white truncate">
            <span className="font-bold">Currency: </span>
            {txCurrency}
          </p>
          <p className="text-white truncate">
            <span className="font-bold">Amount: </span> ${' '}
            {divideAndFormat(txAmount ?? '0')}
          </p>
          <p className="text-white truncate">
            <span className="font-bold">Recipient: </span> @{txRecipient}
          </p>
          <p className="text-white truncate">
            <span className="font-bold">Proof: </span>
            {txProof}
          </p>
        </div>
        {/* <button
          disabled={state !== 1}
          onClick={sendVerification}
          className="flex flex-row justify-center items-center w-full py-1 flex-nowrap shadow-lg rounded-md p-2 text-white hover:text-black hover:bg-gray-200 cursor-pointer transition-all duration-500 ease-in-out disabled:text-gray-200 disabled:cursor-not-allowed"
        >
          Complete Verification
        </button> */}
      </div>
    </div>
  );
}
