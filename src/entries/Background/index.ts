import { onBeforeRequest, onResponseStarted, onSendHeaders } from './handlers';
import { deleteCacheByTabId } from './cache';
import browser from 'webextension-polyfill';
import { getTransactionData } from './db';

(async () => {
  browser.webRequest.onSendHeaders.addListener(
    onSendHeaders,
    {
      urls: [
        'https://app.revolut.com/api/retail/user/current',
        'https://app.revolut.com/api/retail/transaction/*',
      ],
    },
    ['requestHeaders', 'extraHeaders'],
  );

  browser.webRequest.onBeforeRequest.addListener(
    onBeforeRequest,
    {
      urls: [
        'https://app.revolut.com/api/retail/user/current',
        'https://app.revolut.com/api/retail/transaction/*',
      ],
    },
    ['requestBody'],
  );

  browser.webRequest.onResponseStarted.addListener(
    onResponseStarted,
    {
      urls: [
        'https://app.revolut.com/api/retail/user/current',
        'https://app.revolut.com/api/retail/transaction/*',
      ],
    },
    ['responseHeaders', 'extraHeaders'],
  );

  browser.tabs.onRemoved.addListener((tabId) => {
    deleteCacheByTabId(tabId);
  });

  const { initRPC } = await import('./rpc');
  await createOffscreenDocument();
  initRPC();
})();

let creatingOffscreen: any;
async function createOffscreenDocument() {
  const offscreenUrl = browser.runtime.getURL('offscreen.html');
  // @ts-ignore
  const existingContexts = await browser.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl],
  });

  if (existingContexts.length > 0) {
    return;
  }

  if (creatingOffscreen) {
    await creatingOffscreen;
  } else {
    creatingOffscreen = (chrome as any).offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['WORKERS'],
      justification: 'workers for multithreading',
    });
    await creatingOffscreen;
    creatingOffscreen = null;
  }
}

chrome.runtime.onMessage.addListener((message) => {
  console.log('Background received of request_extension_data', message);
  if (message.action === 'request_extension_data') {
    console.log(
      new Date().toISOString(),
      'Successfully fetched request_extension_data',
    );
    let response = message.data;
    chrome.tabs.query({ url: 'http://localhost:3001/' }, function (tabs) {
      if (!tabs[0] || !tabs[0].id) return;
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'request_response',
        data: { response },
      });
    });
  }
});
