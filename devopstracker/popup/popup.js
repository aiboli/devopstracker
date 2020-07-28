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
		var li = document.createElement("li");
	    li.setAttribute('id','testItem1');
	    li.appendChild(document.createTextNode('testItem1'));
	    ul.appendChild(li);
	};
}