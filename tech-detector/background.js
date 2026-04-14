let detectedHeaders = {};

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    let backend = [];

    details.responseHeaders.forEach(header => {
      let name = header.name.toLowerCase();
      let value = header.value.toLowerCase();

      if (name === "x-powered-by") {
        if (value.includes("php")) backend.push("PHP");
        if (value.includes("express")) backend.push("Node.js");
      }

      if (name === "server") {
        if (value.includes("apache")) backend.push("Apache");
        if (value.includes("nginx")) backend.push("Nginx");
        if (value.includes("gunicorn")) backend.push("Python");
      }
    });

    detectedHeaders[details.tabId] = backend;
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);


// 📡 Send data to popup or content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getHeaders") {
    sendResponse(detectedHeaders[sender.tab.id] || []);
  }
});