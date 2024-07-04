import React, { ReactElement, useEffect, useState } from 'react';
import RequestTable from '../../components/RequestTable';
import { useRequests } from '../../reducers/requests';
import { useNavigate } from 'react-router';
import {
  RevolutAction,
  RevolutRequest,
} from '../../utils/types/revolutActions';
import { RequestLog } from '../../entries/Background/rpc';

export default function Requests(): ReactElement {
  // const requests = useRequests();

  // mudar depois

  const action = RevolutAction.REGISTRATION;

  const navigate = useNavigate();
  const [error, showError] = useState('');

  const requestsFromStorage = useRequests();

  const [filteredRequests, setFilteredRequests] = useState<RequestLog[]>([]);

  useEffect(() => {
    if (requestsFromStorage) {
      const filteredRequests = requestsFromStorage.filter((request) => {
        switch (action) {
          case RevolutAction.REGISTRATION:
            // const jsonRegistrationBody = JSON.parse(request.responseBody as string);

            const isRequestTypeProfile =
              request.requestType === RevolutRequest.PAYMENT_PROFILE;
            // const isUserIdMissing = !jsonRegistrationBody.code;

            return isRequestTypeProfile;

          //   case RevolutAction.TRANSFER:
          //     // const jsonTransferBody = JSON.parse(request.responseBody as string);
          //     // const transferDetails = jsonTransferBody[0];

          //     const isRequestTypeTransfer =
          //       request.requestType === RevolutRequest.TRANSFER_DETAILS;

          //     // const amountParsed = transferDetails ? jsonTransferBody[0].amount / 100 * -1 : 0;
          //     // const isAmountParsedValid = amountParsed > 0;

          //     // const isNotBankWithdrawal = transferDetails ? !transferDetails.beneficiary : true;
          //     // const isUserCodeMissing = !jsonTransferBody.code;

          //     isRequestTypeTransfer;

          //   // if (isRequestTypeTransfer && isAmountParsedValid && isNotBankWithdrawal && isUserCodeMissing) {
          //   //   if (onramperIntent) {
          //   //     // If navigating from ZKP2P, then onramperIntent is populated. Therefore, we apply the filter
          //   //     const revolutPaymentCompletedDate = parseInt(transferDetails.completedDate) / 1000;
          //   //     const onRamperIntentTimestamp = parseInt(onramperIntent.intent.timestamp);
          //   //     const isPaymentAfterIntentTime = revolutPaymentCompletedDate >= onRamperIntentTimestamp;

          //   //     const revolutPaymentAmount = parseInt(onramperIntent.fiatToSend);
          //   //     const isPaymentAmountSufficient = amountParsed >= revolutPaymentAmount;

          //   //     const recipientCode = transferDetails.recipient.code;
          //   //     const isRecipientMatchingIntentDepositor = onramperIntent.depositorVenmoId === recipientCode;

          //   //    returnisRecipientMatchingIntentDepositor;
          //   //   } else {
          //   //     // If not navigating from ZKP2P, onramperIntent is empty. Therefore, we don't filter for users
          //   //     return true;
          //   //   }
          //   // } else {
          //   //   return false;
          //   // }

          default:
            return false;
        }
      });

      // console.log('Setting filtered requests', filteredRequests);
      setFilteredRequests(filteredRequests);
    } else {
      // console.log('Setting empty filtered requests');
      setFilteredRequests([]);
    }
  }, [requestsFromStorage, action]);

  return (
    <>
      <RequestTable requests={filteredRequests} />
    </>
  );
}
