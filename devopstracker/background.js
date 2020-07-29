let access_token = "rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya";
let projects = [1, 2, 3];
let teams = [];
let work_items = [];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.cmd) {
      case "setToken":
        access_token = request.token;
        sendResponse({ result: "ok" });
        break;
      case "getToken":
        sendResponse({ result: access_token });
        break;
      case "getProjects":
        if (access_token === "") {
          sendResponse({ result: "error", message: "PAT required" });
          return;
        }
        console.log("projects arr len: " + projects.length);
        if (projects.length) {
          console.log("calling API: /projects");
          $.ajax({
            type: 'GET',
            url: 'https://dev.azure.com/microsoft/_apis/projects?api-version=5.1',
            headers: {
              "Content-Type":"application/json; charset=utf-8;",
              "Authorization": "Basic " + btoa('Basic' + ":" + access_token)
            }
          }).done(function(res) {
            let data = res;
            projects = data.value;
          }).fail(function(err){
            alert("Try again champ!");
            sendResponse({ result: "error", message: "Could not get projects" });
            return;
          });
        }
        sendResponse({ result: projects });
        break;
      case "getTeams":
        sendResponse({ result: teams });
        break;
      case "getWorkItems":
        sendResponse({ result: work_items });
        break;
      default:
        sendResponse({ result: "error", message: "Invalid or missing 'cmd'" });
        break;
    }

    //return true; 
  }
);