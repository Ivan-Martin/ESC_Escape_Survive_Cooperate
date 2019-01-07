//Load items from server
//var ip = 'http://10.0.4.82:8080';
//var ip = 'http://192.168.1.40:8080';
var ip = 'http://192.168.1.46:8080';
var connection = new WebSocket('ws://192.168.1.46:8080/echo');
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

function comprobarModo(mode, callback){
	$.ajax({
		method: 'GET',
		url: ip + '/users/' + globalid + '/' + mode
	}).done(function (user){
		console.log(user);
		callback(user);
	}).fail(function (){
		alert("Ups! Algo salió mal");
	})
}

//Show item in page
function showUser(user) {

    var name = user.name;
    $('#info').append('<div id="Player Connected:' + user.nick + '</div>');
    //alert("Bienvenido " + name);
    
}

var globalid;

function comenzar (str) {
	var nick = str;
	var user = {name: nick};
	createUser(user, function (userCreated) {
        //When item with id is returned from server
        showUser(userCreated);
        globalid = userCreated.id;
    });
	
};

function cargarUsuario (callback) {
	$.ajax({
		method: 'GET',
		url: ip + '/users/' + globalid
	}).done(function (user){
		callback(user);
	}).fail(function (){
		alert("Ups! Algo salió mal");
	})
	
};

/*
function comprobarServidor (game) {
	console.log("comprobando server");
	$.ajax({
		method: 'GET',
		url: ip + "/users/status"
	}).fail(function () {
		alert("Servidor fuera de servicio");
		var manejadorescenas = game.scene;
		var totalescenas = manejadorescenas.keys;
		var refescenas = manejadorescenas.scenes;
		console.log(refescenas);
		console.log(totalescenas);
		
		for(var i = 0; i < totalescenas.length; i++){
			var escena = totalescenas[i];
			refescenas[i].add.image(200, 300, 'errorserver');
			escena.add.image(200, 300, 'errorserver');
		}
	});
}*/


window.onbeforeunload = function () {
	deleteUser(globalid);
	console.log("saliendito" + globalid);
};