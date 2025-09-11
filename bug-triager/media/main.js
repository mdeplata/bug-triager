const historyBtn = document.getElementById("historyBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const settingsBtn = document.getElementById("settingsBtn");

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
    historyBtn.classList.add(active)
    analyzeBtn.classList.add(active)
    settingsBtn.classList.add(active)
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