let monitor_up = 0;

function initialize_night() {
  create_monitor_tab();
}



function create_monitor_tab() {
  const monitorTab = document.createElement("div");
  const monitorHitbox = document.getElementById("monitorHitbox");

  monitorTab.style.backgroundColor = "#301934";
  monitorTab.style.opacity = "50%";
  monitorTab.style.height = "10vh";
  monitorTab.style.width = "95vw";
  monitorTab.id = "monitorTab";
  monitorTab.style.bottom = "1vh";
  monitorTab.style.position = "absolute";

  monitorHitbox.appendChild(monitorTab);
  monitorHitbox.onclick = function(){pull_up_monitor};
  monitorTab.onclick = function(){pull_up_monitor};

}

function pull_up_monitor() {
  monitor_up = Number(!Boolean(monitor_up));
  console.log(monitor_up);
  console.log("meow");

}

initialize_night();