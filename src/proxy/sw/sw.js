


navigator.serviceWorker.addEventListener('message', event => {
    console.log(`The service worker sent me a message: ${event.data}`);
})