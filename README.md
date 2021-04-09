# Competitive-MasterThief
## OverView
### This app is an addon to my project 1 MasterThief game. It will have user profiles, friends, and score tracking(highscore, win/lose, etc.)

User Stories    ->  When a user plays the game they can sign into their own profile. See their stats, and see the stats of their friends. The user should also be able create their own profile and add friends profiles. 

Routes Inventory ->
app.post('/user/:id/win/:score', saveScore)

app.post('/user/:id/lost', addLoss)

app.get('/user/:id', getMyScore)

app.post('/user/:id/addFriend', addFriend)

app.get('/user/:id/friends', getFriendsScores)

app.get('/globalleaderboard', getHighestScores)

Markdown ->

|User|Friendship|
|:---|:---------|
|Id|userId|
|score|friendId|
|wins|
|losses|
|userName|

MVP Checklist ->
Create Profile\
Add Scoring and Win Lose Tracker\ 
Show stats in profile\
save friends profiles\
view friends stats

Stretch Goals ->
Global Leaderboard\
Design Changes\
Message when you beat your high score