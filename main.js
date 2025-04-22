const BASE_URL = "https://trouve-mot.fr/api/";
// const difficulty = "normal";
const currentWordList = [];
let choosenWord = null;
const wordTyped = [];
const difficulty = [5,10];
let tries = 5; 

/**
 * adjust to increase or decrease difficulty
 * @param {Number} length 
 * @param {Number} number 
 * @returns {Array} list of words 
 */
async function getWordList(length,number) {
    const response = await fetch(BASE_URL + "size/" + length + "/" + number);
    const data = await response.json();
    
    return data.map(word => word.name);
}

const selectRandomWord = () => {
    const i = Math.floor(Math.random() * currentWordList.length);
    choosenWord = currentWordList[i];
    return choosenWord;
}

const storeWordList = async () => {
    const worldList = await getWordList(difficulty[0],difficulty[1]);
    currentWordList.push(...worldList);
    return currentWordList;
}

const startGame = async () => {
    document.querySelector("#start").addEventListener("click", async (event) => {
        event.preventDefault();
        currentWordList.length = 0; 
        wordTyped.length = 0;
        choosenWord = null;
        tries = 5;   
        
        await storeWordList();
        selectRandomWord();
        console.log("selected word:", choosenWord);   
        console.log(currentWordList);
    });    
}

// detecting keyboard
const detectKey = () => {
    document.addEventListener("keydown", (event) => {

        if (tries === 0) return console.log("Game over. Le mot était :", choosenWord); 

        if (event.key.match(/^[A-Za-z]$/)) {
            console.log(event.key + " key pressed");
            if (wordTyped.length < difficulty[0]) {
                const letter = event.key.toLowerCase();
                wordTyped.push(letter);
                console.log(wordTyped);
            }
        }

        if (event.key === "Enter") {
            console.log("Enter key pressed");
            checkWord();
        }   
    });
}

// check if the word is correct
const checkWord = () => {
    if (wordTyped.length === difficulty[0]) {
        const wordString = wordTyped.toString().replace(/,/g, "");
        console.log("word typed:", wordString);

        if (wordString === choosenWord) {
            console.log(" gg! le mot est: ", choosenWord);
        } else {
            tries--; 
            console.log(" non! essais restants :", tries);
            if (tries === 0) {
                console.log(" game over. le mot est :", choosenWord);
            }
        }

        wordTyped.length = 0; 
    } else {
        console.log(" Mot incomplet");
    }
}
startGame();
detectKey();
