// content.js

function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Timeout waiting for element: ${selector}`));
        }, timeout);
    });
}

async function clickConnectButtons() {
    const connectButtons = document.querySelectorAll('button[aria-label^="Invite "]');
    let clickCount = 0;

    for (const button of connectButtons) {
        if (button.textContent.trim() === 'Connect') {
            // Random delay between 5-10 seconds
            const delay = Math.floor(Math.random() * (100) + 500);
            await new Promise(resolve => setTimeout(resolve, delay));

            button.click();
            clickCount++;

            // Send progress update back to popup.js after each button click
            chrome.runtime.sendMessage({status: `Clicked ${clickCount} connect button(s)`});

            try {
                // Wait for the "Send" button in the modal and click it
                const sendWithoutNote = await waitForElement('button[aria-label^="Send "]');
                sendWithoutNote.click();
            } catch (error) {
                console.log('Send button not found, moving to next connection');
            }
        }
    }

    return clickCount;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "clickConnectButtons") {
        clickConnectButtons().then(clickCount => {
            sendResponse({status: `Finished clicking ${clickCount} connect buttons`});
        });
        return true; // Indicates we wish to send a response asynchronously
    }
});
