const BASE_URL = "https://trouve-mot.fr/api/";
// const difficulty = "normal";
const currentWordList = [];
let choosenWord = null;
const wordTyped = [];
const difficulty = [5,10];
let tries = 5; 
let targetRow= 0;


// DOM SELECTORS
const keyboard = document.querySelector(".keyboard");
const key = document.querySelectorAll(".key");
const screen = document.querySelector("#screen");


// ASYNC FUNCTIONS
/**
 * adjust to increase or decrease difficulty
 * @param {Number} length 
 * @param {Number} number 
 * @returns {Array} list of words 
 */
async function getWordList(length,number) {
    const response = await fetch(BASE_URL + "size/" + length + "/" + number);
    const data = await response.json();
    
    return data.map(word => word.name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
}

// GAME LOGIC

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
// penser a changer le focus du document car sinon ca refait un start 
        event.preventDefault();
        currentWordList.length = 0; 
        wordTyped.length = 0;
        choosenWord = null;
        tries = 5;
        displayTries();
        await storeWordList();
        selectRandomWord();
        createScreen();
        console.log("selected word:", choosenWord);   
        console.log(currentWordList);
    });    
}

// detecting keyboard
const detectKey = () => {
    document.addEventListener("keydown", (event) => {

        if (tries == 0) return

        if (event.key.match(/^[A-Za-z]$/)) {
            // console.log(event.key + " key pressed");
            if (wordTyped.length < difficulty[0]) {
                const letter = event.key.toLowerCase();
                wordTyped.push(letter);
                displayLetter();
                // console.log(wordTyped);
            }else {
                alert("Mot trop long");
            }
        }

        if (event.key === "Enter") {
            console.log("Enter key pressed");
            checkWord();
        }
        
        if (event.key === "Backspace" && wordTyped.length > 0) {
            // console.log("Backspace key pressed");
            wordTyped.pop();
            displayLetter();
            // console.log(wordTyped);
        }
    });
}

// check if the word is correct
const checkWord = () => {
    const btn = document.querySelector("#start");
    if (wordTyped.length === difficulty[0]) {
        // console.log("word typed:", wordString);
        checkLetters(wordTyped);
        const wordString = wordTyped.toString().replace(/,/g, "");

        if (wordString === choosenWord) {
            alert(" gg! le mot est: "+ choosenWord);
            btn.textContent = "Recommencer";
            return
        } else {
            tries--; 
            alert("Mot incorrect, essaye encore !");
            displayTries();
            // console.log(" non! essais restants :", tries);
            if (tries === 0) {
                alert(" game over. le mot est :" + choosenWord);
                btn.textContent = "Recommencer";
            }
        }

        wordTyped.length = 0; 
    } else {
        alert(" Mot incomplet");
    }
}

const checkLetters = () => {
    const wordArray = choosenWord.split("");
    const rows = screen.querySelectorAll(".row");
    const targetRow = rows[difficulty[0] - tries]; 
    const boxes = targetRow.querySelectorAll(".letterBox");

    for (let i = 0; i < difficulty[0]; i++) {
        const typed = wordTyped[i];
        const target = wordArray[i];
        const box = boxes[i];

        box.textContent = typed;

        if (typed === target) {
            box.style.backgroundColor = "green";
        } else if (wordArray.includes(typed)) {
            box.style.backgroundColor = "yellow"; // 
        }
    }
};

// word display
const createScreen = () => {
    screen.innerHTML = "";
    for (let i = 0; i < tries; i++) {
        const row = document.createElement("div");
        row.classList.add("row");

        for (let i = 0; i < difficulty[0]; i++) {
            const box = document.createElement("div");
            box.classList.add("letterBox");
            box.innerHTML =" ";
            row.appendChild(box);
        }

        screen.appendChild(row);
    }
}

const displayLetter = () => {
    const rows = screen.querySelectorAll(".row");

    if (tries === 0) {
       return 
    } else {
        targetRow = rows[5 - tries];
    }

    const boxes = targetRow.querySelectorAll(".letterBox");

    boxes.forEach((box, i) => {
        if (wordTyped[i]) {
        box.textContent = wordTyped[i];
        // console.log( wordTyped[i], i);
        } else {
            box.textContent = "";
        }
    });
}

// tries display
const displayTries = () => {
    const p = document.querySelector("p");
    p.textContent = "Essais: " + tries;
}



// virtual keyboard
keyboard.addEventListener("click",(event)=>{
    
    if(event.target.matches(".key")){
        const letter = event.target.innerText.toLowerCase();
        if(event.target.innerText == "ENTER"){
            checkWord();
        return
        }
        if(event.target.innerText == "DEL" && wordTyped.length > 0){
            wordTyped.pop();
            displayLetter();
            // console.log(wordTyped);
            
        return
        }
        if (wordTyped.length < difficulty[0] && event.target.innerText != "ENTER" && event.target.innerText != "DEL") {
            wordTyped.push(letter);
            displayLetter();
            // console.log(wordTyped);
        }
    // console.log(event.target.innerText + " key pressed");
    
    }
})


startGame();
displayTries();
detectKey();
