import {
  getCacheByTabId,
  getCookieStoreByHost,
  getHeaderStoreByHost,
} from './cache';
import { BackgroundActiontype, RequestLog } from './rpc';
import mutex from './mutex';
import browser from 'webextension-polyfill';
import { addRequest } from '../../reducers/requests';
import { urlify } from '../../utils/misc';
import {
  RevolutRequest,
  RevolutRequestType,
} from '../../utils/types/revolutActions';

export const onSendHeaders = (
  details: browser.WebRequest.OnSendHeadersDetailsType,
) => {
  return mutex.runExclusive(async () => {
    const { method, tabId, requestId } = details;

    if (method !== 'OPTIONS') {
      const cache = getCacheByTabId(tabId);
      const existing = cache.get<RequestLog>(requestId);
      const { hostname } = urlify(details.url) || {};

      // Set request type
      const urlString = details.url;
      const revolutTagEndpointRegex = new RegExp(
        'https://app.revolut.com/api/retail/user/current',
      );
      const revolutTransactionEndpointRegex = new RegExp(
        'https://app.revolut.com/api/retail/transaction/\\S+',
      );

      let requestType: RevolutRequestType = 'NONE';
      if (revolutTagEndpointRegex.test(urlString)) {
        requestType = RevolutRequest.PAYMENT_PROFILE;
      } else if (revolutTransactionEndpointRegex.test(urlString)) {
        requestType = RevolutRequest.TRANSFER_DETAILS;
      }

      if (hostname && details.requestHeaders) {
        const headerStore = getHeaderStoreByHost(hostname);

        details.requestHeaders.forEach((header) => {
          const { name, value } = header;
          if (/^cookie$/i.test(name) && value) {
            const cookieStore = getCookieStoreByHost(hostname);
            value
              .split(';')
              .map((v) => v.split('='))
              .forEach((cookie) => {
                cookieStore.set(cookie[0].trim(), cookie[1]);
              });
          } else {
            headerStore.set(name, value);
          }
        });
      }

      cache.set(requestId, {
        ...existing,
        method: details.method as 'GET' | 'POST',
        type: details.type,
        url: details.url,
        initiator: details.initiator || null,
        requestHeaders: details.requestHeaders || [],
        tabId: tabId,
        requestId: requestId,
        requestType,
      });
    }
  });
};

export const onBeforeRequest = (
  details: browser.WebRequest.OnBeforeRequestDetailsType,
) => {
  mutex.runExclusive(async () => {
    const { method, requestBody, tabId, requestId } = details;

    if (method === 'OPTIONS') return;

    if (requestBody) {
      const cache = getCacheByTabId(tabId);
      const existing = cache.get<RequestLog>(requestId);

      if (requestBody.raw && requestBody.raw[0]?.bytes) {
        try {
          cache.set(requestId, {
            ...existing,
            requestBody: Buffer.from(requestBody.raw[0].bytes).toString(
              'utf-8',
            ),
          });
        } catch (e) {
          console.error(e);
        }
      } else if (requestBody.formData) {
        cache.set(requestId, {
          ...existing,
          formData: requestBody.formData,
        });
      }
    }
  });
};

export const onResponseStarted = (
  details: browser.WebRequest.OnResponseStartedDetailsType,
) => {
  mutex.runExclusive(async () => {
    const { method, responseHeaders, tabId, requestId } = details;

    if (method === 'OPTIONS') return;

    const cache = getCacheByTabId(tabId);

    const existing = cache.get<RequestLog>(requestId);

    // Set request type
    const urlString = details.url;
    const revolutTagEndpointRegex = new RegExp(
      'https://app.revolut.com/api/retail/user/current',
    );
    const revolutTransactionEndpointRegex = new RegExp(
      'https://app.revolut.com/api/retail/transaction/\\S+',
    );

    let requestType: RevolutRequestType = 'NONE';
    if (revolutTagEndpointRegex.test(urlString)) {
      requestType = RevolutRequest.PAYMENT_PROFILE;
    } else if (revolutTransactionEndpointRegex.test(urlString)) {
      requestType = RevolutRequest.TRANSFER_DETAILS;
    }

    const newLog: RequestLog = {
      requestHeaders: [],
      ...existing,
      method: details.method,
      type: details.type,
      url: details.url,
      initiator: details.initiator || null,
      tabId: tabId,
      requestId: requestId,
      responseHeaders,
      requestType,
    };

    cache.set(requestId, newLog);

    chrome.runtime.sendMessage({
      type: BackgroundActiontype.push_action,
      data: {
        tabId: details.tabId,
        request: newLog,
      },
      action: addRequest(newLog),
    });
  });
};
