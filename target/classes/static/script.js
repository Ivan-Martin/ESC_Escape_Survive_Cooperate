//Load items from server
var ip = 'http://10.0.4.82:8080';
//var ip = 'http://192.168.1.40:8080';
function loadUsers(callback) {
    $.ajax({
        url: ip + '/users'
    }).done(function (users) {
        console.log('Items loaded: ' + JSON.stringify(users));
        callback(users);
    })
}

function createUser(user, callback) {
    $.ajax({
        method: "POST",
        url: ip + '/users',
        data: JSON.stringify(user),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (item) {
        console.log("User created: " + JSON.stringify(item));
        callback(item);
    })
}

//Delete item from server
function deleteUser(userId) {
    $.ajax({
        method: 'DELETE',
        url: ip + '/users/' + userId
    }).done(function (item) {
        console.log("Deleted item " + itemId)
    })
}

function addGame(userId, mode, winner, callback) {
    $.ajax({
        method: 'PUT',
        url: ip + '/users/' + userId + "/" + mode,
        data: JSON.stringify(winner),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (user) {
        console.log("User created: " + JSON.stringify(user));
        callback(user);
    })
}

function updateMode(userId, mode){
	$.ajax({
		method: 'PUT',
		url: ip + '/users/' + userId,
		data: JSON.stringify(mode),
		processData: false,
		headers: {
			"Content-Type": "application/json"
		}
	}).done(function (user) {
		console.log("Usuario " + user.name + " está jugando a " + user.modo);
	})
}

//Show item in page
function showUser(user) {

    var name = user.name;
    $('#info').append('<div id="Player Connected:' + user.nick + '</div>');
    alert("Bienvenido " + name);
    
}

var globalid;

function comenzar () {
	var nick = "";
	do{
		nick = prompt("Por favor introduce tu nombre", "AnonymousPlayer");
	}while (nick.length <= 3 || nick.length >= 20);
	var user = {name: nick};
	createUser(user, function (userCreated) {
        //When item with id is returned from server
        showUser(userCreated);
        globalid = userCreated.id;
    });
	
};

window.onbeforeunload = function () {
	deleteUser(globalid);
	console.log("saliendito" + globalid);
};