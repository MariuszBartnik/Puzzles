import axios from 'axios';


const checkLoginStatus = async () => {
    const actionsOutput = document.querySelector('.actions');
    const status = await axios.get('http://localhost:5000/is_logged');
console.log(status.data);
    if(status.data.isLoggedIn){
        actionsOutput.innerHTML = `
            <a href="/game/play" class="btn btn-light rounded-0">Play game</a>
            <a href="/auth/logout" class="btn btn-dark rounded-0">Logout</a>
        `
    }else{
        actionsOutput.innerHTML = `
            <a href="/auth/login" class="btn btn-light rounded-0">Login</a>
            <a href="/auth/register" class="btn btn-dark rounded-0">Register</a>
        `
    }

}

checkLoginStatus();

