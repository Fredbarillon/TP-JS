const BASE_URL = "https://trouve-mot.fr/api/";
// const difficulty = "normal";
const currentWordList = [];
let choosenWord = null;
const difficulty = [5,10];
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

//   init function
const startGame = async () => {
    document.querySelector("#start").addEventListener("click", async () => {
        const worldList = await getWordList(difficulty[0],difficulty[1]);
        currentWordList.push(...worldList);
        console.log(currentWordList);
        selectRandomWord();
        detectKey();
    });    
}
startGame();

// select random word
const selectRandomWord = () => {
    const i = Math.floor(Math.random() * currentWordList.length);
    choosenWord = currentWordList[i];
    console.log("selected word:", choosenWord);   
    return choosenWord;
}

// detecting keyboard
const wordTyped = [];
const detectKey = () => {
    document.addEventListener("keydown", (event) => {
        
        if (event.key.match(/^[A-Za-z]$/)) {
            console.log(event.key+" key pressed");
            if (wordTyped.length < 5) {
                const letter = event.key.toLowerCase();
                wordTyped.push(letter);
                console.log(wordString);
            }
        }

       if (event.key === "Enter") {
            console.log("Enter key pressed");
           
            // checkWord();
        }   
    });
}

// check if the word is correct
const checkWord = () => {
    if (wordTyped.length === difficulty[0]) {
        const wordString = wordTyped.toString().replace(/,/g, "");  
        console.log("word typed:", wordString);
        if (wordString === choosenWord) {
            console.log("correct word");
            // display success message
        }else {
            console.log("incorrect word");
            // display error message
        }
    }else {
        console.log("word not complete");
    }
}








// const adjsutDifficulty = () => {
//   const easy = document.querySelector("#easy");
//   const medium = document.querySelector("#normal"); 
//   const hard = document.querySelector("#hard");
 
// };

  
