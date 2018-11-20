//Load items from server
function loadUsers(callback) {
    $.ajax({
        url: 'http://10.0.19.169:8080/users'
    }).done(function (users) {
        console.log('Items loaded: ' + JSON.stringify(users));
        callback(users);
    })
}

function createUser(user, callback) {
    $.ajax({
        method: "POST",
        url: 'http://10.0.19.169:8080/users',
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

//Update item in server
function updateItem(item) {
    $.ajax({
        method: 'PUT',
        url: 'http://10.0.19.169:8080/items/' + item.id,
        data: JSON.stringify(item),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (item) {
        console.log("Updated item: " + JSON.stringify(item))
    })
}

//Delete item from server
function deleteUser(userId) {
    $.ajax({
        method: 'DELETE',
        url: 'http://10.0.19.169:8080/users/' + userId
    }).done(function (item) {
        console.log("Deleted item " + itemId)
    })
}

function addGame(userId, mode, winner, callback) {
    $.ajax({
        method: 'PUT',
        url: 'http://10.0.19.169:8080/users/' + userId + "/" + mode,
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
		url: 'http://10.0.19.169:8080/users/' + userId,
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
	var nick = prompt("Por favor introduce tu nombre", "AnonymousPlayer");
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
/*
$(document).ready(function () {

    loadItems(function (items) {
        //When items are loaded from server
        for (var i = 0; i < items.length; i++) {
            showItem(items[i]);
        }
    });

    var input = $('#value-input')
    var info = $('#info')

    //Handle delete buttons
    info.click(function (event) {
        var elem = $(event.target);
        if (elem.is('button')) {
            var itemDiv = elem.parent();
            var itemId = itemDiv.attr('id').split('-')[1];
            itemDiv.remove()
            deleteItem(itemId);
        }
    })

    //Handle items checkboxs
    info.change(function (event) {

        //Get page elements for item
        var checkbox = $(event.target);
        var itemDiv = checkbox.parent();
        var textSpan = itemDiv.find('span');

        //Read item info from elements
        var itemDescription = textSpan.text();
        var itemChecked = checkbox.prop('checked');
        var itemId = itemDiv.attr('id').split('-')[1];

        //Create updated item
        var updatedItem = {
            id: itemId,
            description: itemDescription,
            checked: itemChecked
        }

        //Update item in server
        updateItem(updatedItem);

        //Update page when checked
        var style = itemChecked ? 'line-through' : 'none';
        textSpan.css('text-decoration', style);

    })

    //Handle add button
    $("#add-button").click(function () {

        var value = input.val();
        input.val('');

        var item = {
            description: value,
            checked: false
        }

        createItem(item, function (itemWithId) {
            //When item with id is returned from server
            showItem(itemWithId);
        });
    })
})
*/