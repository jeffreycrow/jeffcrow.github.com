function JSONP( url, callback ) {
	var id = ( 'jsonp' + Math.random() * new Date() ).replace('.', '');
	var script = document.createElement('script');
	script.src = url.replace( 'callback=?', 'callback=' + id );
//	script.setAttribute('type','text/json');
	document.body.appendChild( script );
	window[ id ] = function( data ) {
		if (callback) {
			callback( data );
		}
	};
}

function parseGithubActivity( response ) {

	var activityContainer = $("#githubActivity #container");
	var successFlag = false;

	for(var i=0;i<response.length;i++) {
		
		var actor = response[i].actor;
		var repository = response[i].repository;
		var action;

		switch(response[i].type) {
			case 'IssueCommentEvent':
				action = "commented on";
				break;
			case 'PushEvent':
				action = "pushed to";
				break;
			case 'CreateEvent':
				action = "created"
				break;
			case 'PullRequestEvent':
				action = "submitted a pull request to";
				break;
			case 'ForkEvent':
				action = "forked";
				break;
			case 'WatchEvent':
				action = "started watching";
				break;
		}

		try {
			var repositoryLink = "<a href='"+repository.url+"'>"+repository.name+"</a>";
			var actorSpan = "<span class='actor'>"+actor+"</span>";
			var actionSpan = "<span class='action'>"+action+"</span>";
		} catch(TypeError) {
			continue;
		}
		var item = actorSpan+" "+actionSpan+" repository "+repositoryLink;
		console.log(item);
		$(activityContainer).append(item);

		successFlag = true;

	}

	if( successFlag ) {
		$("#githubActivity").show();
	}
}

JSONP( 'https://github.com/jeffcrow.json?callback=?', function( response ) {
	parseGithubActivity(response);
});