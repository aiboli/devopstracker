$(document).ready(function() {
    // send request to get the work item
    chrome.storage.sync.get(['projectId', 'teamId', 'token','projectName', 'teamName'], function(result) {
        // get the cached data and send request
        if (result.projectId && result.teamId && result.token) {
            getWorkItems(result.projectId, result.teamId, result.token, function(data, error) {
                if (data) {
                    console.log(data);
                    renderWorkItems(data);
                } else {
                    console.log(error);
                }
            });
        } else {
            // let user to input data
			console.log('no data');
			renderAddCredential();
        }
    });
});

function getWorkItems(projectid, teamid, token, callback) {
	// send request to query all the work items
	$.ajax({
		type: 'POST',
		url: `https://dev.azure.com/microsoft/${projectid}/${teamid}/_apis/wit/wiql?api-version=5.1`,
		headers: {
			"Content-Type":"application/json",
			"Authorization": "Basic " + btoa('Basic' + ":" + token)
		},
		data: JSON.stringify({
			"query": "Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.State] <> 'Completed' AND [System.State] <> 'Closed' AND [System.AssignedTo] = @me"
		})
	}).done(function(res) {
		let ids = getWorkItemsList(res);
		// getting work items details
		$.ajax({
			type: 'GET',
			url: `https://dev.azure.com/microsoft/_apis/wit/workitems?ids=${ids.toString()}&api-version=6.0-preview.3`,
			headers: {
				"Content-Type":"application/json",
				"Authorization": "Basic " + btoa('Basic' + ":" + token)
			},
		}).done(function(res) {
			return callback(res);
		}).fail(function(err){
			console.log(err);
			return callback(null, err);
		})
	}).fail(function(err) {
		console.log(err);
		return callback(null, err);
	});
}

function renderWorkItems(data) {
    if (!data || !data.count > 0) {
        console.log('no data to render');
        return;
    } else {
		let workItems = data.value;
		workItems = sortWorkItem(workItems);
        for (let i = 0; i < workItems.length; i++) {
            let workItem = workItems[i];
            console.log(workItem);
			let workItem_html = ``;
            let workItem_object = {
                title: workItem.fields['System.Title'],
                state: workItem.fields['System.State'],
                iteration: workItem.fields['System.IterationPath'],
                deliverable: workItem.fields['System.WorkItemType'],
                id: workItem.id,
                url: workItem.url
			}
            workItem_html = `<tr class="workitem-column">
            <td class="center">${workItem_object.state}</td>
            <td><a href='https://microsoft.visualstudio.com/_workitems/edit/${workItem_object.id}'>${getWorkItemsIcon(workItem_object.deliverable)}${workItem_object.title}</a></td>
            <td class="center">${workItem_object.iteration}</td>
            </tr>`;
            $('#workitem-list').append(workItem_html);
        }
    }
}

// get all the work items
function getWorkItemsList(data) {
	let workItems = data.workItems;
	let ids = [];
	for (let i = 0; i < workItems.length; i++) {
		ids.push(workItems[i].id);
	}
	return ids;
}

function getWorkItemsIcon(type) {
	if (type === 'Deliverable') {
		return `<i class="fa fa-trophy" style="font-size:20px"></i>`;
	} else if (type === 'Bug') {
		return `<i class="fa fa-bug" style="font-size:20px"></i>`;
	} else if (type === 'Task') {
		return `<i class="fa fa-check-square" style="font-size:20px"></i>`;
	} else {
		return '';
	}
}

chrome.runtime.sendMessage({cmd: "getName"}, function(response) {
	console.log("called getName");
	if(!response.result || response.result.length === 0) return;
	console.log("got response");
	user_name = response.result;
	const helloText = document.getElementById("hello");
	helloText.innerHTML = "Hello, " + user_name[0];
})

const getWorkItemsBtn = document.getElementById("getworkitems-button");
if (getWorkItemsBtn) {
	getWorkItemsBtn.onclick = function() {
		chrome.runtime.sendMessage({cmd: "getWorkItems"}, function(response) {
			if(response.result && response.result.length > 0) {
				work_items = response.result;
			}
			console.log(work_items);
		});
	}
}

function sortWorkItem(array) {
	let ordering = {
		"Proposed":5,
		"Started":10,
		"Resolved":1,
		"Committed":8,
		"Active":10
	};
	array.sort(function(a,b) { return ordering[b.fields['System.State']] - ordering[a.fields['System.State']]; })
	return array;
}

function renderAddCredential() {
	$('#workitem-list').append(`<tr>
	<td></td>
	<td class="center">Please set credential by clicking the extension icon</td>
	<td></td>
	</tr>`);
}