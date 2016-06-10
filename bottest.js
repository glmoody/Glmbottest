var Twit = require('twit'); //include twit package
var secretKeys = require('./secrets'); //include sercets.js, which contains Auth keys
var T = new Twit(secretKeys); //New Twit object, assuming OAuth stuff goes down here

var file = 'bandnames.txt';

var stream = T.stream('user');
stream.on('direct_message', dmAdd);
stream.on('tweet', tweetSend);

function dmAdd(event){
    var msg = event.direct_message.text;
    var screenName = event.direct_message.sender.screen_name;
    var msgID = event.direct_message.id_str;

    addList(msg);
    console.log('added new band name ' + msg + 'to list.');
}

//sends a band name to anyone who mentions me
function tweetSend(event){
    var atMen = event.in_reply_to_screen_name;
    var msg = event.text;
    var name = event.user.screen_name;

    if(atMen = 'GlmBottest'){
        if(msg.search('band name') != -1){
            //retrive and tweet a band name from list
            var bandName = chooseName();
            var bandTweet = '@' + name + ', your new band is ' + bandName;
            postStatus(bandTweet);
            console.log('Just sent @' + name + " a hella band name.");
        }
    }
}

//posts new tweet
function postStatus(twStatus) {
    var tweet = {
        status: twStatus
    }

    //twit call for posting
    T.post('statuses/update', tweet, tweeted);

    function tweeted(err, data, response) {
        console.log(data);
    }
}

//Loads list of band names from text file
function loadList(){
    var fs = require('fs');
    var textArray = fs.readFileSync(file).toString().split("\n");
    return textArray;
}

//adds a new band name to the list
function addList(newItem){
    var fs = require('fs');
    fs.appendFile(file, newItem);
}

//randomly chooses a name to tweet from the list
function chooseName(){
    var bandNames = loadList();
    return bandNames[Math.floor(Math.random()*bandNames.length)];
}
