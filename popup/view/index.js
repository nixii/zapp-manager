
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

// objects
const removeButton = document.getElementById('remove');

const errorFrame = document.getElementById('error-frame');
const errorFrameClose = errorFrame.getElementsByClassName('close')[0];
const errorMsg = document.getElementById('errormsg');

const editButton = document.getElementById('edit');
const editFrame = document.getElementById('edit-frame');
const editFrameClose = editFrame.getElementsByClassName('close')[0];

const editSubmit = document.getElementById('edit-submit');
const editUsernameInput = document.getElementById('edit-username-input');
const editWebsiteInput = document.getElementById('edit-website-input');
const editEmailInput = document.getElementById('edit-email-input');
const editPasswordInput = document.getElementById('edit-password-input');
const editMasterInput = document.getElementById('edit-master-input');

const addButton = document.getElementById('add');
const addFrame = document.getElementById('add-frame');
const addFrameClose = addFrame.getElementsByClassName('close')[0];

const addSubmit = document.getElementById('add-submit');
const addUsernameInput = document.getElementById('add-username-input');
const addWebsiteInput = document.getElementById('add-website-input');
const addEmailInput = document.getElementById('add-email-input');
const addPasswordInput = document.getElementById('add-password-input');
const addMasterInput = document.getElementById('add-master-input');

const viewEmail = document.getElementById('view-email');
const viewEmailContent = viewEmail.getElementsByClassName('content')[0];
const viewPassword = document.getElementById('view-password');
const viewPasswordContent = viewPassword.getElementsByClassName('content')[0];
const viewButton = document.getElementById('view');
const viewFrame = document.getElementById('view-frame');
const viewFrameClose = viewFrame.getElementsByClassName("close")[0];


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
	obj.className += "passworditem";
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
removeButton.addEventListener('click', function(e) {
	let items = document.getElementsByClassName("passworditem selected");
	for (let i = 0; i < items.length; i++) {
		items[i].remove();
	}
});

// When you edit a password
editButton.addEventListener('click', function() {
	if (document.getElementsByClassName('selected').length == 0)
		return;
	else if (document.getElementsByClassName('selected').length > 1) {
		errorMsg.innerHTML = errors.MoreThanOneSelected;
		errorFrame.classList.remove('hidden');
		return;
	}
	editFrame.classList.remove('hidden');
});
editFrameClose.addEventListener('click', function() {
	editFrame.classList.add('hidden');
});

// When you add a password
addButton.addEventListener('click', function() {
	addFrame.classList.remove('hidden');
});
addFrameClose.addEventListener('click', function() {
	addFrame.classList.add('hidden');
});
addSubmit.addEventListener('click', function() {
	let req = {
		Username: addUsernameInput.value,
		Website: addWebsiteInput.value,
		Password: addPasswordInput.value,
		MasterPassword: addMasterInput.value,
	}
	if (addEmailInput.value.trim().length != 0) {
		req.Email = addEmailInput.value.trim();
	}

	httpAsync("pwd", "PUT", req, (response) => {
		newPasswordItem(req.Website, req.Username);
	});
});

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
		viewEmailContent.innerHTML = json.Email;
		viewPasswordContent.innerHTML = json.Password;
		viewFrame.classList.remove('hidden');
	})
}

// When you view a password
viewButton.addEventListener('click', function() {
	if (document.getElementsByClassName('selected').length == 0)
		return;
	else if (document.getElementsByClassName('selected').length > 1) {
		errorMsg.innerHTML = errors.MoreThanOneSelected;
		errorFrame.classList.remove('hidden');
		return;
	} else {
		let val = document.getElementsByClassName('selected')[0];
		view(val.getElementsByClassName('site')[0].innerHTML, val.getElementsByClassName('username')[0].innerHTML);
	}
});
viewFrameClose.addEventListener('click', function() {
	viewFrame.classList.add('hidden');
});

// Hide the error frame
errorFrameClose.addEventListener('click', function() {
	errorFrame.classList.add('hidden');
});

/*
 * Contact the server and load passwords.
 * useful!
*/
function main() {

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

} main();