


/*******************************************GLOBAL VARIABLES******************************************************/
const baseURL = 'http://localhost:3000'
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


//*****************************ALL SCREEN FUNCTIONS********************************************************/


//changes screens
async function changeToScreen(screen){
    var logSign = document.getElementById('log_sign_screen');
    var score = document.getElementById('score_screen');
    var game = document.getElementById('game_screen');


    //make sure background isnt the vault from winning:
    document.body.style.backgroundImage = "url('assets/bankWall2.jpeg')";


    if(screen == "log_sign_screen"){
        //hide other screens:
        score.style.display = 'none';
        game.style.display = 'none';
        //show log/sign screen:
        logSign.style.display = 'flex';
    }else if(screen == "score_screen"){
        //hide other screens:
        logSign.style.display = 'none';
        game.style.display = 'none';
        //show log/sign screen:
        score.style.display = 'flex';
        await initializeScoreScreen()
    }else if(screen == "game_screen"){
        //hide other screens:
        logSign.style.display = 'none';
        score.style.display = 'none';
        //show log/sign screen:
        game.style.display = 'block';
    }


}


/*****************************************************LOG IN SCREEN****************************************************/

const login = async () => {

    try{
        let user = await axios.post('http://localhost:3000/login', {
            username: document.getElementById('l_username').value
        })

       //check password
        if(user.data.user == null){
            alert('no user found with that username')
        }else if(user.data.user.password == document.getElementById('l_password').value){
            //log them in
            localStorage.userId = user.data.user.id;
            localStorage.username = user.data.user.userName;
            localStorage.name = user.data.user.name;
            await changeToScreen('score_screen');

            // console.log(localStorage)

       }else{
           alert('Incorrect Password.')
       }

    }catch(error){
        console.log(error);
    }

}


const signUp = async () => {
    try{
        let newUser = await axios.post(baseURL+'/signUp', {
            name: document.getElementById('s_name').value,
            username: document.getElementById('s_username').value,
            password: document.getElementById('s_password').value
        })
        
        //log them in automatically:
        localStorage.userId = newUser.data.newUser.id;
        localStorage.name = newUser.data.newUser.name;
        localStorage.username = newUser.data.newUser.userName;

       
        await changeToScreen('score_screen');

    }catch(error){
        console.log(error)
    }
}


//SIGN UP BUTTON
document.getElementById('signup_bttn').addEventListener('click', async (event) =>{
    event.preventDefault();

    await signUp();


})

//LOG IN BUTTON
document.getElementById('login_bttn').addEventListener('click', async (event) =>{
    event.preventDefault();

    
    await login();


})


/*****************************************************SCORE SCREEN****************************************************/

//get all friends
const getFriends = async () => {
    try{
        let friends = await axios.get(baseURL+'/user/'+localStorage.userId+'/friends')

        return friends
    }catch(error){
        console.log(error)
        return []
    }
}

//update friend board

const updateFriendBoard = async () => {
    try{
        //clear friend board first
        document.getElementById('friend_board').innerHTML = ''

        //get all friends of user
        var response = await getFriends()
        var friends = response.data.friends
        // console.log(friends)

        //make a div for each friend
        for(y = 0; y<friends.length; y++){
            //div for one line of rankings board:
            var friendDiv = document.createElement('div');
            friendDiv.classList.add('friendInfo');

            //div for friends username:
            var f_username = document.createElement('div');
            //console.log(friends[y])
            f_username.innerHTML = friends[y].userName;
            f_username.classList.add('friendUsername');

            //div for friends score:
            var f_score = document.createElement('div');
            f_score.innerHTML = friends[y].score;
            f_score.classList.add('friendScore');

            friendDiv.appendChild(f_username);
            friendDiv.appendChild(f_score);

            //add to friends ranking board
            document.getElementById('friend_board').appendChild(friendDiv);

        }

    }catch(error){
        console.log(error)
    }
}




//addfriend

const addFriend = async () => {
    try{
        let changes = await axios.post(baseURL+'/user/'+localStorage.userId+'/addFriend',{
            username: document.getElementById('friend_username').value
        })

        console.log(changes)

    }catch(error){
        console.log(error)
    }
}

document.getElementById('addFriend_bttn').addEventListener('click', async (event) => {
    event.preventDefault();
    try{
        await addFriend();
        await updateFriendBoard()
    }catch(error){
        console.log(error)
    }
})



const initializeScoreScreen = async () => {
    //get all the dom elements we are manipulating:
    var welcome = document.getElementById('welcome');
    var statsHead = document.getElementById('stats_header')
    var userScore = document.getElementById('userScore')
    var userWins = document.getElementById('userWins')
    var userLosses = document.getElementById('userLosses')

    try{
        //use login backend to get user from username:
        let user = await axios.post(baseURL+'/login', {
            username: localStorage.username
        })
        //console.log(localStorage)
       // console.log(user)
        welcome.innerHTML = 'Welcome, '+localStorage.name;

        statsHead.innerHTML = localStorage.username+'\'s stats:';
        userScore.innerHTML = user.data.user.score;

        userWins.innerHTML = user.data.user.wins;

        userLosses.innerHTML = user.data.user.losses;

        await updateFriendBoard()
    }catch(error){
        console.log(error);
    }
}

const logout = async () => {
    localStorage.clear();
    await changeToScreen('log_sign_screen');
}

document.getElementById('logOut').addEventListener('click', async (event)=>{
    event.preventDefault();
    await logout();
})


//play game button
document.getElementById('play_bttn').addEventListener('click', async (event) =>{
    event.preventDefault();

    await changeToScreen('game_screen');


})



/*****************************************************GAME SCREEN****************************************************/

// pause lose game animation
// https://css-tricks.com/controlling-css-animations-transitions-javascript/
document.getElementById("jailbars").style.webkitAnimationPlayState = "paused";
// pause win game animation
document.getElementById("main_screen").style.webkitAnimationPlayState = "paused";
// pause play again animation
document.getElementById("playAgain").style.webkitAnimationPlayState = "paused";



/*make play again button work*/
document.getElementById("playAgainBttn").addEventListener("click", async function () {
   // location.reload();

   await changeToScreen('score_screen');




})


//make random keypad passcode
for(let i=0; i < 4; i++){
    code.push(COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)]) //randomizing index of color list
}
console.log(code);


//Make fingerprints clickable
document.querySelector('#bluePrint').addEventListener('click', async function(){
    await fingerClick('blue')
})
document.querySelector('#greenPrint').addEventListener('click', async function(){
    await fingerClick('green')
})
document.querySelector('#redPrint').addEventListener('click', async function(){
    await fingerClick('red')
})
document.querySelector('#yellowPrint').addEventListener('click', async function(){
    await fingerClick('yellow')
})
document.querySelector('#whitePrint').addEventListener('click', async function(){
   await fingerClick('white')
})
document.querySelector('#purplePrint').addEventListener('click', async function(){
   await fingerClick('purple')
})



//when a fingerprint is clicked
async function fingerClick(color) {
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

    //if a full guess was entered
    if (currentGuess.length == 4){
        document.querySelector('#location1').style.display = 'none';
        document.querySelector('#location2').style.display = 'none';
        document.querySelector('#location3').style.display = 'none';
        document.querySelector('#location4').style.display = 'none';
        var g = {guess: currentGuess, red: 0, white: 0}
        pastGuesses.push(g)
        guessCount++

        await checkGuess(code, g)

        updateNoteScreen()

        /**************************************GAME OVER************************************************/
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


//check how right guess is, fill out red/white feedback
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
    // console.log("pastGuesses after newest check")
    // console.log(pastGuesses)


    /******************************************WIN GAME*****************************************/
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

        /***************SAVE WIN TO DATABASE****************/
        // backend route: app.post('/user/:id/win/:score', saveScore)
        try{
            let changes = await axios.post(baseURL + '/user/' +localStorage.userId+'/win/'+ guessCount, {})
            console.log(changes)

        }catch(error){
            console.log(error)
        }

       
    } else{ //if they inputed an incorrect guess

        //display incorrect 
        document.querySelector('#incorrect').style.display = 'block'

        //if theyre on guess number 8
        if(guessCount == 8){
            //play heartbeat
            document.getElementById("fastHeartBeat").play()
        }else if(guessCount== 9){
            //play siren
            document.getElementById("siren").play()
        }


    }
}

//display past guess and feedback
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

//INSTRUCTIONS BUTTON AND MODAL:
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