let access_token = "rzzq3rpwxygmcetwrtdnu4rigavoeltaboes5vsiewbbucpdq3ya";
let projects = [];
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
      case "setProjects":
        projects = request.projects;
        sendResponse({result: "ok"});
        break;
      case "getProjects":
        if (access_token === "") {
          sendResponse({ result: "error", message: "PAT required" });
        }
        if(projects.length === 0) {
          sendResponse({ result: "error", message: "Projects arr not set yet" });
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