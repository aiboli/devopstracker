//const sendMessageId = document.getElementById("sendmessageid");
// if (sendMessageId) {
//   sendMessageId.onclick = function() {
//     console.log("hello");
//   };
// }

var access_token = "rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya";

const getProjectsBtn = document.getElementById("getprojects");
if (getProjectsBtn) {
	getProjectsBtn.onclick = function() {
		if (access_token === "") return;

		var ul = document.getElementById("list");

		$.ajax({
			type: 'GET',
			url: 'https://dev.azure.com/microsoft/_apis/projects?api-version=5.1',
			headers: {
				"Content-Type":"application/json; charset=utf-8;",
				"Authorization": "Basic " + btoa('Basic' + ":" + access_token)
			}
		}).done(function(res) {
			// returned json file
			//console.log(res);
			let data = res;
			var projects = data.value;
		    for(i = 0; i < projects.length; i++) {
		    	let name = projects[i].name;

		    	$.ajax({
		    		type: 'GET',
		    		url: projects[i].url,
					headers: {
						"Content-Type":"application/json; charset=utf-8;",
						"Authorization": "Basic " + btoa('Basic' + ":" + access_token)
					}
		    	}).done(function(res2) {
		    		//console.log(res2["_links"]["web"]["href"]);
		    		//https://dev.azure.com/microsoft/Base
		    		//res2["_links"]["web"]["href"]

					var a = document.createElement("a");
					a.setAttribute('href', res2["_links"]["web"]["href"]);
					a.setAttribute('target', "_blank");
					var li = document.createElement("li");
					li.setAttribute('id', name);
					li.appendChild(document.createTextNode(name));
					a.appendChild(li);
					ul.appendChild(a);
		    	}).fail(function(err2){
		    		alert("couldn't get URL");
		    	});


		    }
		}).fail(function(err){
			alert("Try again champ!");
		});


	};
}

const tokenInput = document.getElementById("token");
const setTokenBtn = document.getElementById("settoken");
if (setTokenBtn) {
	setTokenBtn.onclick = function() {
		access_token = tokenInput.value;
		tokenInput.value = '';
	}
}