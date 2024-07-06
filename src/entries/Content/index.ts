window.onerror = (error) => {
  // console.log('error');
  // console.log(error);
};

(async () => {
  console.log('Content script works!');
  console.log('Must reload extension for modifications to take effect.');
})();

// window.addEventListener('message', function (event) {
//   console.log('Content received of fetch_data');
//   if (event.source != window) {
//     return;
//   }

//   if (event.data.type && event.data.type == 'fetch_data') {
//     console.log(new Date().toISOString(), 'Content received fetch_data');

//     chrome.runtime.sendMessage({ action: 'request_extension_data' });
//   }
// });

chrome.runtime.onMessage.addListener((message) => {
  console.log('Content received of request_response', message);

  if (message.action === 'request_response') {
    console.log('inside it');
    let response = message.data;
    window.postMessage(
      {
        type: 'data_response',
        status: 'loaded',
        data: { response },
      },
      '*',
    );
  }
});

// window.addEventListener('message', function (event) {
//   if (event.source != window) {
//     return;
//   }

//   if (event.data.type && event.data.type == 'fetch_transaction_data') {
//     console.log(
//       new Date().toISOString(),
//       'Content received fetch_extension_version',
//     );

//     chrome.runtime.sendMessage({ action: 'request_transaction_data' });
//   }
// });
