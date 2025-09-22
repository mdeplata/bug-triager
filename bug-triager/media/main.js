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