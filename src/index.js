function initClient() {
    gapi.load('client:auth2', () => {
        gapi.auth2.init({
            client_id: '792557354550-c825kq527a5gt0ddctag4p305bjovos7.apps.googleusercontent.com', // Replace with your Client ID
            scope: 'https://www.googleapis.com/auth/spreadsheets'
        }).then(() => {
            // Check if user is already signed in
            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                console.log("User is signed in");
            } else {
                console.log("User is not signed in");
            }
        });
    });
}

function signUp() {
    gapi.auth2.getAuthInstance().signIn().then((user) => {
        const email = user.getBasicProfile().getEmail();
        console.log(`Signed in as: ${email}`);
        addEmailToSheet(email);
    });
}

function addEmailToSheet(email) {
    const params = {
        spreadsheetId: '1SiqdehCoaZKKhTcNfeGl7jDxqu-EZMa24ybpfraCXK0', // Replace with your Spreadsheet ID
        range: 'Sheet1!A:A', // Adjust the range as needed
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
    };

    const valueRangeBody = {
        "range": "Sheet1!A1",
        "majorDimension": "ROWS",
        "values": [[email]],
    };

    gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody)
        .then((response) => {
            console.log(`${response.result.updates.updatedCells} cells appended.`);
        });
}

function signIn() {
    gapi.auth2.getAuthInstance().signIn().then((user) => {
        const email = user.getBasicProfile().getEmail();
        checkEmailInSheet(email);
    });
}

function checkEmailInSheet(email) {
    const params = {
        spreadsheetId: '1SiqdehCoaZKKhTcNfeGl7jDxqu-EZMa24ybpfraCXK0',
        range: 'Sheet1!A:A', // Adjust the range as needed
    };

    gapi.client.sheets.spreadsheets.values.get(params)
        .then((response) => {
            const values = response.result.values;
            if (values) {
                const emails = values.flat(); // Flatten the array of email addresses
                if (emails.includes(email)) {
                    console.log("Sign in successful.");
                    // Proceed to the next part of your application
                } else {
                    console.log("Email not found. Please sign up.");
                }
            } else {
                console.log("No data found.");
            }
        });
}

// Add event listeners
document.getElementById('signupButton').addEventListener('click', signUp);
document.getElementById('signinButton').addEventListener('click', signIn);

// Initialize the Google API Client when the page loads
window.onload = initClient;
