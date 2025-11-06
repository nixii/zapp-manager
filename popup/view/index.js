
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
	obj.id = `s-${site} u-${username}`;

	// Save the html element
	if (!passwords[site]) {
		passwords[site] = {};
	}
	passwords[site][username] = obj;

	// When you click it, select it
	obj.addEventListener('click', function(e) {
		if (item.classList.contains("selected")) {
			item.classList.remove("selected");
		} else {
			item.classList.add("selected");
		}
	});

	// Add the html element to the document
	document.getElementById('passwords').appendChild(obj);
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
	document.getElementById('view').addEventListener('click', function() {
		if (document.getElementsByClassName('selected').length == 0)
			return;
		else if (document.getElementsByClassName('selected').length > 1) {
			document.getElementById('error-frame').getElementById('errormsg').innerHTML = errors.MoreThanOneSelected;
			document.getElementById('error-frame').classList.remove('hidden');
			return;
		}
		document.getElementById('view-frame').classList.remove('hidden');
	});
	document.getElementById("view-frame").getElementsByClassName("close")[0].addEventListener('click', function() {
		document.getElementById('view-frame').classList.add('hidden');
	});
}