// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "bug-triager" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('bug-triager.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from bug-triager!');
	});
	context.subscriptions.push(disposable);

	// dashboard command
	 const dashboardCommand = vscode.commands.registerCommand(
		'bug-triager.openDashboard',
		function () {
			const panel = vscode.window.createWebviewPanel(
				'bugTriagerDashboard',
				'Bug Triager Dashboard',
				vscode.ViewColumn.One,
				{ enableScripts: true }
			);

			panel.webview.html = getWebviewContent(panel, context);
		}
	);
	context.subscriptions.push(dashboardCommand);
}

//WEBVIEW display function
  function getWebviewContent(panel,context) {
	const stylePath = vscode.Uri.file(
		path.join(context.extensionPath, "media","styles.css")
	);
	const styleUri = panel.webview.asWebviewUri(stylePath);

	const scriptPath = vscode.Uri.file(
		path.join(context.extensionPath,"media","main.js")
	);

	const scriptUri = panel.webview.asWebviewUri(scriptPath);
	return `<!DOCTYPE html>
	<html lang="en">
  	<head>
    <meta charset="UTF-8">
    <title>Bug Triager Dashboard</title>
	<link rel= "stylesheet" href="${styleUri}">
  </head>
  	<body>
	 <div class="sidebar">
	  <h2>DASHBOARD</h2>
	  <button id="historyBtn" class="active">History</button>
	  <button id="analyzeBtn">Analyze</button>
	  <button id="settingBtn">Settings</button>
	 </div>

	 <div class= "content">
	 
	 	<div id="historyPanel" class="panel active">
			<h2>History</h2>
			<p>This will show past errors.</p>
		</div>


	 	<div id="analyzePanel" class="panel">
			<h2>Stack Trace</h2>
			<textarea id= "stackTraceInput" placeholder="Please paste your stack trace message here"></textarea>

			<h3>Language</h3>
		  <select id ="languageSelect">
			<option>Javascript</option>
			<option>Python</option>
			<option>Java</option>
			<option>C++</option>
			<option>Typescript</option>
		  </select>
			
		  	<button id="runAnalyzeBtn">Analyze</button>

			<div id="loadingBuffer" class="hidden">
				  <p>Analyzing... Please wait ⏳</p>
			</div>			

			<div id="aiResponseBox" class="hidden">
				<h3>AI Response Box</h3>
				
				<div id="innerWrapper">
					<p><b>What:</b> <span id="aiWhat"></span></p>
					<p><b>Why:</b> <span id="aiwhy"></span></p>
					<p><b>Where:</b> <span id="aiWhere"></span></p>
				</div>
			 
			</div>

		</div>		

	 	<div id="settingsPanel" class="panel">
			<h2>Settings</h2>
			<p>settings Config</p>
		</div>		
	 </div>

 	 <script src="${scriptUri}"></script> 
  </body>
 </html>`;
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
