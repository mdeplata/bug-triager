// =====================
// VSCode API Import
// =====================
const vscode = acquireVsCodeApi();

// =====================
// Sidebar Navigation
// =====================

const historyBtn = document.getElementById("historyBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const settingsBtn = document.getElementById("settingBtn");

const historyPanel = document.getElementById("historyPanel");
const analyzePanel = document.getElementById("analyzePanel");
const settingsPanel = document.getElementById("settingsPanel");

function showPanel(panel){
    historyPanel.classList.remove("active");
    analyzePanel.classList.remove("active");
    settingsPanel.classList.remove("active");
    panel.classList.add("active");
}

historyBtn.addEventListener('click',()=>{

    while (historyPanel.lastChild.nodeName != 'H2') {
      historyPanel.removeChild(historyPanel.lastChild)
    }

    vscode.postMessage({
      command: 'getHistoryData'
    });

    showPanel(historyPanel);
    historyBtn.classList.add("active")
    analyzeBtn.classList.remove("active")
    settingsBtn.classList.remove("active")
})

analyzeBtn.addEventListener('click', () => {
  showPanel(analyzePanel);
  analyzeBtn.classList.add('active');
  historyBtn.classList.remove('active');
  settingsBtn.classList.remove('active');
});

settingsBtn.addEventListener('click', () => {
  showPanel(settingsPanel);
  settingsBtn.classList.add('active');
  historyBtn.classList.remove('active');
  analyzeBtn.classList.remove('active');
});


// =====================
// Analyze Panel Logic
// =====================

const runAnalyzeBtn = document.getElementById("runAnalyzeBtn")
const loadingBuffer = document.getElementById("loadingBuffer")
const aiResponseBox = document.getElementById("aiResponseBox")
const aiInnerBox = document.getElementById("innerWrapper")
const aiProblem = document.getElementById("analysisProblem");
const aiReason = document.getElementById("analysisReason");
const aiSolution = document.getElementById("analysisSolution");

runAnalyzeBtn.addEventListener("click",async () => {

  // show a buffer message 
  loadingBuffer.classList.remove("hidden")
  aiResponseBox.classList.add("hidden")

  // post a command message to the vscode extension to start LLM Analysis
  vscode.postMessage({
    command: 'analyze',
    text: document.getElementById('stackTraceInput').value
  })
})

window.addEventListener('message', event => {
  const message = event.data;
  if (message.command === 'analysisResult') {

    loadingBuffer.classList.add('hidden');
    aiResponseBox.classList.remove('hidden');

    aiProblem.textContent = message.problem;
    aiReason.textContent = message.reason;
    aiSolution.textContent = message.solution;

  } else if (message.command === 'historyData') {
    renderHistoryCards(message.jsonData);
  }

})

// =====================
// Settings Panel Logic
// =====================

const settingToggle = document.querySelectorAll(".toggle");
const lightDarkMode  = document.getElementById("themeSelect");

settingToggle.forEach(eachToggle =>{
  eachToggle.addEventListener("click",()=>{
    eachToggle.classList.toggle("on");
  });
});

lightDarkMode.addEventListener("click",()=>{
  if(lightDarkMode.value == "light"){
    document.body.classList.add("light-theme");
  }else{
    document.body.classList.remove("light-theme");
  }
})

// =====================
// Histoey  Panel Logic
// =====================

const historyCards = document.querySelectorAll(".history-card");

historyCards.forEach(card=>{
  card.addEventListener("click",()=>{
    if(card.classList.contains("active")){
      card.classList.remove("active")
    }
    else{
      historyCards.forEach(c=>c.classList.remove("active"))
      
      card.classList.add("active")
    }
  })
})

function renderHistoryCards(jsonData) {

  for (let json of jsonData) {
      let newHistoryCard = document.createElement('div');
      newHistoryCard.classList.add('history-card');

      let errorP = document.createElement('p');
      errorP.classList.add('error');
      errorP.textContent = json.error;

      newHistoryCard.appendChild(errorP)

      let fileP = document.createElement('p');
      fileP.classList.add('file');
      fileP.textContent = json.file;

      newHistoryCard.appendChild(fileP);

      let aiResponseDiv = document.createElement('div');
      aiResponseDiv.classList.add('history-aiResponse');

      let aiProblem = document.createElement('p');

      let problemBold = document.createElement('b');
      problemBold.textContent = 'Problem:';

      let problemSpan = document.createElement('span');
      problemSpan.textContent = json.aiResponse.problem;

      aiProblem.appendChild(problemBold);
      aiProblem.appendChild(problemSpan);

      aiResponseDiv.appendChild(aiProblem);

      let aiReason = document.createElement('p');

      let reasonBold = document.createElement('b');
      reasonBold.textContent = 'Reason:';

      let reasonSpan = document.createElement('span');
      reasonSpan.textContent = json.aiResponse.reason;

      aiReason.appendChild(reasonBold);
      aiReason.appendChild(reasonSpan);

      aiResponseDiv.appendChild(aiReason);

      let aiSolution = document.createElement('p');

      let solutionBold = document.createElement('b');
      solutionBold.textContent = 'Solution:';

      let solutionSpan = document.createElement('span');
      solutionSpan.textContent = json.aiResponse.solution;

      aiSolution.appendChild(solutionBold);
      aiSolution.appendChild(solutionSpan);

      aiResponseDiv.appendChild(aiSolution);

      newHistoryCard.appendChild(aiResponseDiv);
      
      let timeP = document.createElement('p');
      timeP.classList.add('time');
      timeP.textContent = json.time;

      newHistoryCard.appendChild(timeP);

      historyPanel.appendChild(newHistoryCard);
    }

}