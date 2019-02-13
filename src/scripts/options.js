import browser from 'webextension-polyfill';

// update UI - API Key on options page load
document.addEventListener('DOMContentLoaded', () => {
    // replace the input value with current value on load
    browser.storage.local.get(['key', 'pwd', 'userOptions'])
        .then(result => {
            // to string
            let API_KEY = `${result.key}`, pwd = result.pwd;
            if (API_KEY === 'undefined') {
                document.getElementById('api__key--value').value = '';
            } else {
                document.getElementById('api__key--value').value = API_KEY;
                document.getElementById('password__label--checkbox').checked = result.userOptions.pwdForUrls;
                // if disabled -> delete save password
                if (!result.userOptions.pwdForUrls) {
                    pwd = '';
                }
                document.getElementById('password--value').value = pwd;
                // view password holder
                toggleView(result.userOptions.pwdForUrls);
            }
            document.getElementById('autocopy__label--checkbox').checked = result.userOptions.autoCopy;
            document.getElementById('history__label--checkbox').checked = result.userOptions.keepHistory;
        })
        .catch(err => {
            // to be removed on the next major release
            browser.storage.local.get(['pwd']).then(result => {
                if (result.pwd.length > 0) {
                    document.getElementById('password--value').value = result.pwd;
                    document.getElementById('password__label--checkbox').checked = true;
                    // view password holder
                    toggleView(true);
                }
            });
        });
});


// Store Data and alert message
let saveData = () => {
    let password = document.getElementById('password--value').value;
    let API_KEY = document.getElementById('api__key--value').value;
    let pwdForUrls = document.getElementById('password__label--checkbox').checked;
    let autoCopy = document.getElementById('autocopy__label--checkbox').checked;
    let keepHistory = document.getElementById('history__label--checkbox').checked;

    if (password == '') {
        pwdForUrls = false;
    }
    if (!pwdForUrls) {
        password = '';
    }

    let userOptions = {
        pwdForUrls: pwdForUrls,
        autoCopy: autoCopy,
        keepHistory: keepHistory
    };

    // store value locally
    browser.storage.local.set({ key: API_KEY, pwd: password, URL_array: [], userOptions: userOptions }).then(() => {
        // Saved Alert
        let element = document.getElementById('button__submit');
        element.textContent = 'Saved!';
        setTimeout(() => {
            element.textContent = 'Save';
            // close current tab
            browser.tabs.getCurrent().then((tabInfo) => {
                browser.tabs.remove(tabInfo.id);
            });
        }, 1250);
    });
};


// on save button click
document.getElementById('button__submit').addEventListener('click', () => {
    saveData();
});


// on enter key press
document.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        saveData();
    }
});


// Show Password
document.getElementById('view__password--eye').addEventListener('click', () => {
    let element = document.getElementById('password--value');
    if (element.type === 'password') {
        element.type = 'text';
        document.querySelector('.show__pwd--eye').src = 'assets/eye-slash.svg';
    } else {
        element.type = 'password';
        document.querySelector('.show__pwd--eye').src = 'assets/eye.svg';
    }
});


// Password Holder View Toggle
function toggleView(checked) {
    let pwdHolder = document.getElementById('pwd__holder');
    if (checked) {
        pwdHolder.classList.remove('d-none');
    } else {
        pwdHolder.classList.add('d-none');
    }
}


// Password Option toggle key press
document.getElementById('password__label--switch').addEventListener('click', () => {
    let checked = document.getElementById('password__label--checkbox').checked;
    toggleView(checked);
});