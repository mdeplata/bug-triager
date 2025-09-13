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
const aiWhat = document.getElementById("aiWhat")
const aiWhy = document.getElementById("aiWhy")
const aiWhere = document.getElementById("aiWhere")

runAnalyzeBtn.addEventListener("click",()=>{

  // show a buffer message 
  loadingBuffer.classList.remove("hidden")
  aiResponseBox.classList.add("hidden")


  //simulate  delay
  setTimeout(()=>{
  // show response box
  aiResponseBox.classList.remove("hidden");
  loadingBuffer.classList.add("hidden")

  },6000);
})


// =====================
// Settings Panel Logic
// =====================

const settingToggle = document.querySelectorAll(".toggle")

settingToggle.forEach(eachToggle =>{
  eachToggle.addEventListener("click",()=>{
    eachToggle.classList.toggle("on");
  });
});