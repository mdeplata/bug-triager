// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

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

	//new dashboard command
	 const dashboardCommand = vscode.commands.registerCommand(
		'bug-triager.openDashboard',
		function () {
			const panel = vscode.window.createWebviewPanel(
				'bugTriagerDashboard',
				'Bug Triager Dashboard',
				vscode.ViewColumn.One,
				{ enableScripts: true }
			);

			panel.webview.html = getWebviewContent();
		}
	);
	context.subscriptions.push(dashboardCommand);
}

//helper function
  function getWebviewContent() {
	return `<!DOCTYPE html>
	<html>
  	<head>
    <meta charset="UTF-8">
    <title>Bug Triager Dashboard</title>
  </head>
  <body style="font-family: sans-serif; padding: 20px;">
    <h1>Bug Triager Dashboard</h1>
    <p>This is the starting point for your UI 💃🏾</p>
  </body>
 </html>`;
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
