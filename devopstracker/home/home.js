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
        }
    });
});

// function hasCachedData() {
//     chrome.storage.sync.get(['projectId', 'teamId', 'token','projectName', 'teamName'], function(result) {
//         // if it is cached
//         console.log(result);
//         if (result.projectId && result.teamId && result.token) {
//             return true;
//         } else {
//             return false;
//         }
//     });
// }

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
            <td>${workItem_object.id}</td>
            <td>${workItem_object.state}</td>
            <td>${workItem_object.deliverable}</td>
            <td><a href='https://microsoft.visualstudio.com/_workitems/edit/${workItem_object.id}'>${workItem_object.title}</a></td>
            <td>${workItem_object.iteration}</td>
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