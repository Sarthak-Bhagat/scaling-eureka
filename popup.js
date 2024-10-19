
document.addEventListener('DOMContentLoaded', function() {
    const clickButton = document.getElementById('clickConnectButtons');
    const statusText = document.getElementById('status');

    clickButton.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            // Send message to start clicking connect buttons
            chrome.tabs.sendMessage(tabs[0].id, {action: "clickConnectButtons"});
        });
    });

    // Listener for progress updates from content.js
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.status) {
            statusText.textContent = request.status; // Update the status with progress
        }
    });
});
