async function initClient() {
    await gapi.load('client:auth2', async () => {
        await gapi.auth2.init({
            client_id: '792557354550-c825kq527a5gt0ddctag4p305bjovos7.apps.googleusercontent.com', // Replace with your Client ID
            scope: 'https://www.googleapis.com/auth/spreadsheets'
        });

        // already signed in
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            console.log("User is signed in");
        } else {
            console.log("User is not signed in");
        }
    });
}

async function signUp() {
    try {
        const user = await gapi.auth2.getAuthInstance().signIn();
        const email = user.getBasicProfile().getEmail();
        console.log(`Signed in as: ${email}`);
        await addEmailToSheet(email);
    } catch (error) {
        console.error("Error during sign up:", error);
    }
}

async function addEmailToSheet(email) {
    const params = {
        spreadsheetId: '1SiqdehCoaZKKhTcNfeGl7jDxqu-EZMa24ybpfraCXK0', 
        range: 'Sheet1!A:A', 
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
    };

    const valueRangeBody = {
        "range": "Sheet1!A1",
        "majorDimension": "ROWS",
        "values": [[email]],
    };

    try {
        const response = await gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
        console.log(`${response.result.updates.updatedCells} cells appended.`);
    } catch (error) {
        console.error("Error appending email to sheet:", error);
    }
}

async function signIn() {
    try {
        const user = await gapi.auth2.getAuthInstance().signIn();
        const email = user.getBasicProfile().getEmail();
        await checkEmailInSheet(email);
    } catch (error) {
        console.error("Error during sign in:", error);
    }
}

async function checkEmailInSheet(email) {
    const params = {
        spreadsheetId: '1SiqdehCoaZKKhTcNfeGl7jDxqu-EZMa24ybpfraCXK0',
        range: 'Sheet1!A:A', 
    };

    try {
        const response = await gapi.client.sheets.spreadsheets.values.get(params);
        const values = response.result.values;
        if (values) {
            const emails = values.flat(); 
            if (emails.includes(email)) {
                console.log("Sign in successful.");
            } else {
                console.log("Email not found. Please sign up.");
            }
        } else {
            console.log("No data found.");
        }
    } catch (error) {
        console.error("Error checking email in sheet:", error);
    }
}

document.getElementById('signupButton').addEventListener('click', signUp);
document.getElementById('signinButton').addEventListener('click', signIn);

window.onload = initClient;
