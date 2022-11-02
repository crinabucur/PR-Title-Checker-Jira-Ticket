const core = require('@actions/core');
const github = require('@actions/github');

try {
  // Inputs defined in action metadata file
  let jiraProjectKey = core.getInput('jira-project-key');
  let noTicketPrefix = core.getInput('no-ticket-prefix');
  const ignoreCase = core.getInput('ignore-case');
  const verbose = core.getInput('verbose');

  logPayload(verbose);
  
  let pullRequestTitle = getPullRequestTitle();
  
  let caseInsensitiveMode = (ignoreCase === 'true');
  console.log(`Ignore case set to ${caseInsensitiveMode}`);
  
  if (caseInsensitiveMode) {
    pullRequestTitle = pullRequestTitle.toUpperCase();
    jiraProjectKey = jiraProjectKey.toUpperCase();
    noTicketPrefix = (noTicketPrefix == null) ? noTicketPrefix : noTicketPrefix.toUpperCase();
  }
  
  let passes = false;

  // Check for no-ticket indication match first, to avoid an unnecessary computationally expensive RegEx
  if (noTicketPrefix != null && pullRequestTitle.startsWith('[' + noTicketPrefix + ']') === true) {
    passes = true;
  }
  
  if (passes === false) {
    let pattern = "^\\[" + jiraProjectKey + "-[0-9]+\\]\\ [^\\ ]";
    let regExp = new RegExp(pattern, caseInsensitiveMode ? "ig" : "g");

    passes = regExp.test(pullRequestTitle);
    if (passes === false) {
	  core.setFailed(getFormattingFailureMessage(pullRequestTitle, jiraProjectKey, noTicketPrefix));
	}
  }
} catch (error) {
  core.setFailed(error.message);
}


function getPullRequestTitle() {
  let pullRequest = github.context.payload.pull_request;
  core.debug(`Pull Request: ${JSON.stringify(github.context.payload.pull_request)}`);
  if (pullRequest == undefined || pullRequest.title == undefined) {
    throw new Error("This action should only be run with Pull Request events");
  }
  return pullRequest.title;
}

function logPayload(verbose) {
  if (verbose === false) {
	console.log(`Verbose set to false, skipping Payload logging`); 
	return;
  }
	
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
}

function getFormattingFailureMessage(pullRequestTitle, jiraProjectKey, noTicketPrefix) {
  let message = `Pull Request title "${pullRequestTitle}" does not start with a Jira ticket (i.e. [${jiraProjectKey}-123] YourMessage)`;
  if (noTicketPrefix != null)
	  message += ` or a no ticket indication (i.e. [${noTicketPrefix}] YourMessage)`;
  
  return message;
}