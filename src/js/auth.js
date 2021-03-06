import axios from 'axios';

const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');

const emailError = document.querySelector('.email_error');
const passwordError = document.querySelector('.password_error');
const confirmPasswordError = document.querySelector('.confirm_password_error');

const registerUser = async (e) => {
    e.preventDefault();

    resetErrorMessages();

    const email = registerForm.email.value;
    const password = registerForm.password.value;
    const confirmPassword = registerForm.confirm_password.value;

    let errors = [];

    if(password !== confirmPassword) {
        errors.push({path: "confirmPasswordError", message: "Passwords do not match"});
        displayErrorMessages(errors);
    }

    else{
        const auth = await axios.post('http://localhost:5000/auth/register', { email, password});

        if(auth.data.errors) displayErrorMessages(auth.data.errors);
        if(auth.data.user) location.assign('/game/play');
    }
}

const loginUser = async (e) => {
    e.preventDefault();

    resetErrorMessages();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const auth = await axios.post('http://localhost:5000/auth/login', { email, password});

    if(auth.data.errors) displayErrorMessages(auth.data.errors);
    if(auth.data.user) location.assign('/game/play');
}

const resetErrorMessages = () => {
    emailError.textContent = '';
    passwordError.textContent = '';

    if(confirmPasswordError){
        confirmPasswordError.textContent = '';
    }
}

const displayErrorMessages = (errors) => {
    errors.forEach(error => {
        switch(error.path){
            case 'emailError':
                emailError.textContent = error.message;
                break;
            case 'passwordError':
                passwordError.textContent = error.message;
                break;
            case 'confirmPasswordError':
                confirmPasswordError.textContent = error.message;
                break;
        }
    })
}

if(registerForm){
    registerForm.addEventListener('submit', registerUser);
}

if(loginForm){
    loginForm.addEventListener('submit', loginUser);
}
