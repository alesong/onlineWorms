chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    for (var i = 0; i < details.responseHeaders.length; ++i) {
      if (details.responseHeaders[i].name.toLowerCase() === 'content-security-policy') {
        details.responseHeaders[i].value = details.responseHeaders[i].value.replace('block-all-mixed-content', '');
      }
    }
    return {responseHeaders: details.responseHeaders};
  },
  {
    urls: ["<all_urls>"],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
  },
  ["blocking", "responseHeaders"]
);

console.log('Background a2g script loaded');