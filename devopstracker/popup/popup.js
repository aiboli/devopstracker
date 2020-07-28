//const sendMessageId = document.getElementById("sendmessageid");
// if (sendMessageId) {
//   sendMessageId.onclick = function() {
//     console.log("hello");
//   };
// }

const getProjectsBtn = document.getElementById("getbtn");
if (getProjectsBtn) {
	getProjectsBtn.onclick = function() {
		var ul = document.getElementById("list");
		// var li = document.createElement("li");
	 //    li.setAttribute('id','testItem1');
	 //    li.appendChild(document.createTextNode('testItem1'));
	 //    ul.appendChild(li);
		$.ajax({
			type: 'GET',
			url: 'https://dev.azure.com/microsoft/_apis/projects?api-version=5.1',
			headers: {
				"Content-Type":"application/json; charset=utf-8;",
				"Authorization": "Basic " + btoa('Basic' + ":" + 'rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya')
			}
		}).done(function(res) {
			// returned json file
			console.log(res);
			let data = res;
			var projects = data.value;
		    for(i = 0; i < projects.length; i++) {
		    	var name = projects[i].name;

		    	var li = document.createElement("li");
		    	li.setAttribute('id', name);
		    	li.appendChild(document.createTextNode(name));
		    	ul.appendChild(li);
		    }
		}).fail(function(err){
			alert("Try again champ!");
		});
	    // var request = new XMLHttpRequest()

		// request.open('GET', 'https://dev.azure.com/microsoft/_apis/projects?api-version=5.1', true)
		// request.setRequestHeader('Content-Type', 'application/json; charset=utf-8;');
		// request.setRequestHeader ("Authorization", "Basic " + btoa('Basic' + ":" + 'rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya'));

		// request.onload = function() {
		//   // Begin accessing JSON data here

		//   var data = JSON.parse(this.response)

		//   if (request.status >= 200 && request.status < 400) {
		//     console.log(data)
		//   } else {
		//     console.log('error')
		//   }
		// }

		//   if (request.status >= 200 && request.status < 400) {
		//     //console.log(data)
		//     var projects = data.value;
		//     for(i = 0; i < projects.length; i++) {
		//     	var name = projects[i].name;

		//     	var li = document.createElement("li");
		//     	li.setAttribute('id', name);
		//     	li.appendChild(document.createTextNode(name));
		//     	ul.appendChild(li);
		//     }
		//   } else {
		//     console.log('error')
		//   }
		// }

		// request.send()


	};
}