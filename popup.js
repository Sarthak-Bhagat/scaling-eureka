document.addEventListener('DOMContentLoaded', function() {
    const clickButton = document.getElementById('clickConnectButtons');
    const statusText = document.getElementById('status');

    clickButton.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "clickConnectButtons"}, function(response) {
                if (response && response.status) {
                    statusText.textContent = response.status;
                } else {
                    statusText.textContent = "Error: Could not click connect buttons";
                }
            });
        });
    });
});
