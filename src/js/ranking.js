import axios from 'axios';

const rankingOutput = document.querySelector('.ranking-output');

const getTopUsers = async () => {
    const users = await axios.get('http://localhost:5000/game/ranking/data');
    const finalOutput = '';
    const { highscores, userHighscore } = users.data;
    console.log(users)
    highscores.forEach((score, index) => {
        const output = `
            <div class="bg-light text-dark shadow-sm p-1 my-4 row">
                <div class="col-1 display-6 text-center text-secondary">
                    ${index + 1}
                </div>
                <div class="col-11 row row-cols-2 align-items-center">
                        <div class="user-name">
                            ${score.email}
                        </div>
                        <div class="user-score lead text-end">
                            ${score.score}
                        </div>
                </div>
            </div>
            `;        
        finalOutput += output;
    });

    if(userHighscore){
        const outputUser = `
            <div class="bg-dark text-light shadow-sm border border-light p-2 my-4 row">
                <div class="col-1 lead text-center text-light">
                    ${+userHighscore.position + 1}
                </div>
                <div class="col-11 row row-cols-2 align-items-center">
                    <div class="user-name">
                        ${userHighscore.email}
                    </div>
                    <div class="user-score lead text-end">
                        ${userHighscore.score}
                    </div>
                </div>
            </div>
            `

        finalOutput += outputUser;
    }

    rankingOutput.innerHTML = finalOutput;
}

export const setHighScore = async (score) => {
    const currentHighScore = await axios.get('http://localhost:5000/game/ranking/user-data');

    if(!currentHighScore){
        await axios.post('http://localhost:5000/game/ranking/user-data', {newScore: score});
    }

    if(currentHighScore.score < score){
        await axios.put('http://localhost:5000/game/ranking/user-data', {newScore: score});
    }
}

getTopUsers();
