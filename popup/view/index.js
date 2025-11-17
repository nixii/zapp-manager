
/*
 * please please please ignore this really bad code. I hate JS and webdev.
 * I am thinking I should have just use imgui.
*/

// consts

/*
		<div class="passworditem">
			<p class="site">www.google.com</p>
			<p class="username">TheTrueBear</p>
		</div>
*/
const passwordItemTemplate = '<p class="site">#s</p><p class="username">#u</p>';
const errors = {
	ServerNotStarted: "The password manager isn't running!<br>Did you run the executable?",
	IncompletePayload: "You have to put more information in!",
	MoreThanOneSelected: "You can only view or modify one password at a time."
};

// globals
var passwords = {}

// error message
function err(txt) {
	document.getElementById('errormsg').innerHTML = txt;
	document.getElementById('error-frame').classList.remove('hidden');
}

// http request
function httpAsync(endpoint, method, data, callback) {
	let xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
		else if (xmlHttp.readyState == 4)
			err(xmlHttp.responseText);
	}

	console.log(JSON.stringify(data));

	xmlHttp.open(method, `http://localho.st:2327/${endpoint}/`, true);
	xmlHttp.setRequestHeader("Content-Type", "application/json");
	xmlHttp.send(JSON.stringify(data));
}

// useful functions
// Get the site/username tag of the thing.
function getBy(e, st) {
	let tag = e.tag;
	let tags = tag.split(" ");
	for (let i = 0; i < tags.length; i++) {
		if (tags[i].startsWith(st)) {
			let idx = tags[i].indexOf(st)
			return tags[i].substring(idx + 2, tags[i].length - idx);
		}
	}
	return null;
}

// Create a new password item
function newPasswordItem(site, username) {

	// Create the html element
	let pwditem = passwordItemTemplate.replace("#s", site).replace("#u", username);
	let obj = document.createElement('div');
	obj.className += "passworditem"
	obj.innerHTML = pwditem;

	// Save the html element
	if (!passwords[site]) {
		passwords[site] = {};
	}
	passwords[site][username] = obj;

	// When you click it, select it
	obj.addEventListener('click', function(e) {
		if (obj.classList.contains("selected")) {
			obj.classList.remove("selected");
		} else {
			obj.classList.add("selected");
		}
	});

	// Add the html element to the document
	document.getElementById('passwords').appendChild(obj);
}

// get a master password
function getMasterPassword() {
	// get master password
	let mpwd = "simplex2";
	return mpwd;
}

// testing
// newPasswordItem("googleeee", "hsdajif")
// console.log(getBy({tag: "u-nixii s-www.google.com"}, "u-"))
// Connect removing a password
{
	document.getElementById("remove").addEventListener('click', function(e) {
		let items = document.getElementsByClassName("passworditem selected");
		for (let i = 0; i < items.length; i++) {
			items[i].remove();
		}
	});
}

// When you edit a password
{
	document.getElementById("edit").addEventListener('click', function() {
		if (document.getElementsByClassName('selected').length == 0)
			return;
		else if (document.getElementsByClassName('selected').length > 1) {
			document.getElementById('error-frame').getElementById('errormsg').innerHTML = errors.MoreThanOneSelected;
			document.getElementById('error-frame').classList.remove('hidden');
			return;
		}
		document.getElementById('edit-frame').classList.remove('hidden');
	});
	document.getElementById("edit-frame").getElementsByClassName("close")[0].addEventListener('click', function() {
		document.getElementById('edit-frame').classList.add('hidden');
	});
}

// When you add a password
{
	document.getElementById('add').addEventListener('click', function() {
		document.getElementById('add-frame').classList.remove('hidden');
	});
	document.getElementById("add-frame").getElementsByClassName("close")[0].addEventListener('click', function() {
		document.getElementById('add-frame').classList.add('hidden');
	});
}

// When you view a password
{
	// View a selected password
	function view(s, u) {
		// TODO: make this
		httpAsync("pwd", "POST", {
			MasterPassword: getMasterPassword(),
			Website: s,
			Username: u
		}, (response) => {
			let json = JSON.parse(response);
			console.log(json);
			document.getElementById('view-email').getElementsByClassName('content')[0].innerHTML = json.Email
			document.getElementById('view-password').getElementsByClassName('content')[0].innerHTML = json.Password
		})
	}

	// Connect the events
	document.getElementById('view').addEventListener('click', function() {
		if (document.getElementsByClassName('selected').length == 0)
			return;
		else if (document.getElementsByClassName('selected').length > 1) {
			document.getElementById('error-frame').getElementById('errormsg').innerHTML = errors.MoreThanOneSelected;
			document.getElementById('error-frame').classList.remove('hidden');
			return;
		} else {
			let val = document.getElementsByClassName('selected')[0];
			view(val.getElementsByClassName('site')[0].innerHTML, val.getElementsByClassName('username')[0].innerHTML);
		}
		document.getElementById('view-frame').classList.remove('hidden');
	});
	document.getElementById("view-frame").getElementsByClassName("close")[0].addEventListener('click', function() {
		document.getElementById('view-frame').classList.add('hidden');
	});
}

// Hide the error frame
{
	document.getElementById('error-frame').getElementsByClassName('close')[0].addEventListener('click', function() {
		document.getElementById('error-frame').classList.add('hidden');
	});
}

/*
 * Contact the server and load passwords.
 * useful!
*/
function main() {

	// httpAsync( // test to make a simple password
	// 	"pwd",
	// 	"PUT",
	// 	{
	// 		MasterPassword: mpwd,
	// 		Website: "google.com",
	// 		Username: "nixii",
	// 		Password: "123",
	// 		Email: "nixii@nixii.nixii"
	// 	},
	// 	() => {}
	// )

	// load passwords
	httpAsync(
		"allpwds", 
		"POST",
		{
			MasterPassword: getMasterPassword()
		}, 
		function(response) {
			let res = JSON.parse(response);
			for (const site in res) {
				for (const user in res[site]) {
					newPasswordItem(site, res[site][user]);
				}
			}
		} // ick so much indentation-
	);
}

/*
 * actually run
*/
main();