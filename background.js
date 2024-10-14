chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, {action: "toggleFeature"});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getStoredData") {
    chrome.storage.sync.get(['enhancementEnabled'], (result) => {
      sendResponse({enhancementEnabled: result.enhancementEnabled || false});
    });
    return true; // Indicates we wish to send a response asynchronously
  }
});
