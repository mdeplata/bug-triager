// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env')});

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
})

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed


/**
 * @param {vscode.ExtensionContext} context
*/
function activate(context) {

	if (!process.env.OPENAI_API_KEY) {
		vscode.window.showErrorMessage('OpenAI API Key not found.');
		return;
	}
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "bug-triager" is now active!');
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('bug-triager.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		
		// const client = new OpenAI({
			// 	apiKey: process.env.OPENAI_API_KEY
			// });
			
			// Display a message box to the user
			vscode.window.showInformationMessage('Hello World from bug-triager!');
			vscode.window.showInformationMessage(`API Key Status: ${process.env.OPENAI_API_KEY}`)
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

			panel.webview.onDidReceiveMessage(async (message) => {
				if (message.command === 'analyze') {
					try {
						const response = await client.chat.completions.create({
							model: 'gpt-5',
							messages: [
								{ role: 'system', content: 'You are a helpful assistant that helps developers triage bugs.' },
								{ role: 'user', content: `Analyze the following stack trace and provide a brief explanation of what and where the problem is, why it might be occurring, and a solution for resolving the error:\n\n${message.text}.
								Answer using the format "Problem: ...\nReason: ...\nSolution: ...\n". For all of the sections, please do not use a list and keep the response to one line.` }
							]
						});

						panel.webview.postMessage({
							command: 'analysisResult',
							problem: response.choices[0].message.content.match(/Problem: (.*)/)[1],
							reason: response.choices[0].message.content.match(/Reason: (.*)/)[1],
							solution: response.choices[0].message.content.match(/Solution: (.*)/)[1]
						});
						
					} catch (error) {
						console.error('Error during analysis:', error);
					}
				}
			})

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
	  <button id="analyzeBtn" >Analyze</button>
	  <button id="settingBtn" >Settings</button>
	 </div>

	 <div class= "content">
	 
	 	<div id="historyPanel" class="panel active">
			<h2>History</h2>
			
			<div class="history-card ">
				<p class="error"><strong>TypeError:</strong>Cannot read property</p>
				<p class="file">src/component/App.js:28</p>
				
				<div class="history-aiResponse" >
					<p><b>Problem:</b> <span id="aiProblem"></span></p>
					<p><b>Reason:</b> <span id="aiReason"></span></p>
					<p><b>Solution:</b> <span id="aiSolution"></span></p>
				</div>

				<p class= "time">17 min ago</p>
			</div>

						
			<div class="history-card ">
				<p class="error"><strong>TypeError:</strong>Cannot read property</p>
				<p class="file">src/component/App.js:28</p>
				
				<div class="history-aiResponse" >
					<p><b>Problem:</b> <span id="aiProblem"></span></p>
					<p><b>Reason:</b> <span id="aiReason"></span></p>
					<p><b>Solution:</b> <span id="aiSolution"></span></p>
				</div>

				<p class= "time">17 min ago</p>
			</div>

						
			<div class="history-card ">
				<p class="error"><strong>TypeError:</strong>Cannot read property</p>
				<p class="file">src/component/App.js:28</p>
				
				<div class="history-aiResponse" >
					<p><b>Problem:</b> <span id="aiProblem"></span></p>
					<p><b>Reason:</b> <span id="aiReason"></span></p>
					<p><b>Solution:</b> <span id="aiSolution"></span></p>
				</div>

				<p class= "time">17 min ago</p>
			</div>
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
					<p><b>Problem:</b> <span id="analysisProblem"></span></p>
					<p><b>Reason:</b> <span id="analysisReason"></span></p>
					<p><b>Solution:</b> <span id="analysisSolution"></span></p>
				</div>
			 
			</div>

		</div>		

	 	<div id="settingsPanel" class="panel">
			<h2>Settings</h2>

			<div class="setting-item">
				<label for="themeSelect">Theme</label>
				<select id = "themeSelect">
					<option value="dark">Dark</option>
					<option value="light">Light</option>
				</select>
			</div>

			<div class="setting-item">
				<label for= "languageSelect">Language</label>
				<select id="languageSelect">
					<option value = "English">English</option>
					<option value = "Spanish">Spanish</option>
					<option value = "French">French</option>
					<option value = "German">German</option>
				</select>
			</div>

			<div class= "setting-item-toggle">
				<label for= "errorMonitoring">Enable Error Monitoring</label>
				<p class="toggle">
					<span class="knob"></span>
				</p>
			</div>

			<div class= "setting-item-toggle">
				<label for= "autoStackTrace">Auto-Submit Stack Traces</label>
				<p class="toggle">
					<span class="knob"></span>
				</p>
			</div>

			<div class= "setting-item-toggle">
				<label for= "notifications">Enable Notification</label>
				<p class="toggle">
					<span class="knob"></span>
				</p>
			</div>

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
