const CLIENT_ID = '792557354550-dqq1ir0vtjp5nl35em70ec8fs19kddrl.apps.googleusercontent.com'; // Replace with your actual client ID
const API_KEY = 'AIzaSyBDyIrGF0aaQHC3K-3XPmQcScdojmJ_ayc';      // Replace with your actual API key
const DISCOVERY_DOCS = [
    "https://sheets.googleapis.com/$discovery/rest?version=v4",
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];
const SCOPES = "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/spreadsheets";

let accessToken = null; // Initialize accessToken to null

// Load the Google API client
function initClient() {
    return new Promise((resolve, reject) => {
        gapi.load('client', async () => {
            try {
                await gapi.client.init({
                    apiKey: API_KEY,
                    discoveryDocs: DISCOVERY_DOCS,
                });
                console.log('Google API Client loaded.');
                resolve(); // Resolve the promise when initialized
            } catch (error) {
                console.error('Error loading Google API client:', error);
                reject(error); // Reject the promise if there's an error
            }
        });
    });
}

// Function to authenticate using traditional OAuth 2.0
function signInWithOAuth() {
    const redirectUri = 'http://localhost:5500/src/index.html'; // Replace with your actual redirect URI
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(SCOPES)}`;

    window.location.href = authUrl; // Redirect to Google's OAuth 2.0 server
}

// Function to handle token retrieval
function handleTokenResponse() {
    const hash = window.location.hash;
    if (hash) {
        const params = new URLSearchParams(hash.replace('#', ''));
        accessToken = params.get('access_token');
        
        if (accessToken) {
            console.log('Access Token:', accessToken);
            // Check if gapi.client is initialized before setting the token
            if (gapi.client) {
                gapi.client.setToken({ access_token: accessToken });
                // Redirect to the form page after successful sign-in
                window.location.href = 'http://127.0.0.1:5500/src/form.html'; // Replace with the actual form page URL
            } else {
                console.error('gapi.client is not initialized.');
            }
        } else {
            console.error('Failed to retrieve access token from URL hash.');
        }
    }
}

// Load the API client and initialize sign-in on page load
window.onload = async function() {
    try {
        await initClient(); // Ensure the client is initialized before proceeding
        
        // Check if the URL has an access token
        handleTokenResponse();

        // Attach click event to your custom sign-in button after the client is initialized
        const signInButton = document.getElementById('signInButton');
        if (signInButton) {
            signInButton.addEventListener('click', signInWithOAuth);
        } else {
            console.error('Sign-in button not found.');
        }
    } catch (error) {
        console.error('Failed to initialize Google API client:', error);
    }
};
