
// HARD CODING IN A CURRENT USER HERE
// DELETE THIS WHEN YOU HAVE LOG IN WORKING
localStorage.userId = 1


console.log('hey')

const baseURL = 'http://localhost:3000'
// Main Screen
const COLOR_LIST = ['green', 'red', 'blue', 'yellow', 'white', 'purple'] //use this to get random code

let code= [] //answer
let currentGuess = []
let pastGuesses = [] // this is an array of guess objects. guess objects holds GUESS and RED and WHITE values
// pastGuesses example:
// pastGuesses = [
//     {   guess: ['red', 'red', 'blue', 'yellow'],
//         red: 0;
//         white: 2;
//     },
//     {   guess: ['red', 'blue', 'red', 'yellow'],
//         red: 1;
//         white: 1;
//     }
// ]
let guessCount = 0

// pause lose game animation
// https://css-tricks.com/controlling-css-animations-transitions-javascript/
document.getElementById("jailbars").style.webkitAnimationPlayState = "paused";
// pause win game animation
document.getElementById("main_screen").style.webkitAnimationPlayState = "paused";
// pause play again animation
document.getElementById("playAgain").style.webkitAnimationPlayState = "paused";

/*make play again button work*/
document.getElementById("playAgainBttn").addEventListener("click", function () {
    location.reload();
})

for(let i=0; i < 4; i++){
    code.push(COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)]) //randomizing index of color list
}
console.log(code);

document.querySelector('#bluePrint').addEventListener('click', function(){
    fingerClick('blue')
})
document.querySelector('#greenPrint').addEventListener('click', function(){
    fingerClick('green')
})
document.querySelector('#redPrint').addEventListener('click', function(){
    fingerClick('red')
})
document.querySelector('#yellowPrint').addEventListener('click', function(){
    fingerClick('yellow')
})
document.querySelector('#whitePrint').addEventListener('click', function(){
    fingerClick('white')
})
document.querySelector('#purplePrint').addEventListener('click', function(){
    fingerClick('purple')
})


function fingerClick(color) {
    /*first clear any msg on bank lock */
    document.querySelector('#correct').style.display = 'none';
    document.querySelector('#incorrect').style.display = 'none';

    currentGuess.push(color);

    /*add stars to bank lock*/
    
    if (currentGuess.length == 1){
        document.querySelector('#location1').style.display = 'block';
    }else if (currentGuess.length == 2){
        document.querySelector('#location2').style.display = 'block';
    }else if (currentGuess.length == 3){
        document.querySelector('#location3').style.display = 'block';
    }else if (currentGuess.length == 4){
        document.querySelector('#location4').style.display = 'block';
    }

    if (currentGuess.length == 4){
        document.querySelector('#location1').style.display = 'none';
        document.querySelector('#location2').style.display = 'none';
        document.querySelector('#location3').style.display = 'none';
        document.querySelector('#location4').style.display = 'none';
        var g = {guess: currentGuess, red: 0, white: 0}
        pastGuesses.push(g)
        guessCount++
        checkGuess(code, g)
        updateNoteScreen()
        if(guessCount == 10 && g.red != 4){ //if they lost
            //stop heartbeat
            document.getElementById("fastHeartBeat").pause();

            //jail bar animation
            document.getElementById("jailbars").style.webkitAnimationPlayState = "running";

            //play again button slides down
            document.getElementById("playAgain").style.webkitAnimationPlayState = "running";

        }
        currentGuess = []
    }

    
    
}

async function checkGuess(code, currentGuess){
    var tempCode = []
    var tempGuess = []
    for(let i=0;i<4;i++){
        tempGuess[i] = currentGuess.guess[i]
        tempCode[i] = code[i]
    }


    for(let i=0; i<4; i++){
       if(code[i] == currentGuess.guess[i]){
           currentGuess.red++
           tempCode[i]= ""
           tempGuess[i]="_"  //will never match so we dont double count red as white
       } 
    } 
    for(let i=0; i<4; i++){
        if (tempCode.includes(tempGuess[i])){
            currentGuess.white++ 
            tempCode[tempCode.indexOf(tempGuess[i])] = ""; //so we dont double count white
        }

    }
    console.log("pastGuesses after newest check")
    console.log(pastGuesses)
    // if they found the answer
    if(currentGuess.red == 4){

        //stop all stressor sounds
        document.getElementById("fastHeartBeat").pause()
        document.getElementById("siren").pause()

        //display access granted
        document.querySelector('#correct').style.display = 'block'
        

         // vault open sound
        document.getElementById('vaultOpen').play()
        //slide keypad and thief tech away to the left
        document.getElementById('main_screen').style.webkitAnimationPlayState = "running";

        //as it slides away change bg to vault
        document.body.style.backgroundImage = "url('assets/openVault.jpeg')";
        

        //play again button slides down
        document.getElementById("playAgain").style.webkitAnimationPlayState = "running";

        //save win to database
        // app.post('/user/:id/win/:score', saveScore)

        try{
            let changes = await axios.post(baseURL + '/user/' +localStorage.userId+'/win/'+ guessCount, {})
            console.log(changes)

        }catch(error){
            console.log(error)
        }

       
    } else{ //if they inputed an incorrect guess

        //display incorrect 
        document.querySelector('#incorrect').style.display = 'block'

        //if their on guess number 8
        if(guessCount == 8){
            //play heartbeat
            document.getElementById("fastHeartBeat").play()
        }else if(guessCount== 9){
            //play siren
            document.getElementById("siren").play()
        }


    }
}

function updateNoteScreen(){
    while(document.querySelector('#noteScreen').firstChild) {
        document.querySelector('#noteScreen').removeChild(document.querySelector('#noteScreen').firstChild)
    }
    for(let i=0; i< pastGuesses.length; i++){
        let guessDiv = document.createElement('div')
        guessDiv.classList.add('guessDisplay')
        for(let j=0; j< pastGuesses[i].guess.length; j++){
            let color = document.createElement('div')
           
            color.classList.add(pastGuesses[i].guess[j])
            color.classList.add("guessCircles")
            guessDiv.appendChild(color)
        }
        for(let j=0; j<pastGuesses[i].red; j++){
            let red = document.createElement('div')
            red.classList.add('hintCircles')
            red.classList.add('red')
            guessDiv.appendChild(red)
        }
        for(let j=0; j<pastGuesses[i].white; j++){
            let white = document.createElement('div')
            white.classList.add('hintCircles')
            white.classList.add('white')
            guessDiv.appendChild(white)
        }
        document.querySelector('#noteScreen').appendChild(guessDiv)

    }
}
/* Code ASSISTED with code from https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal */
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("manualBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}