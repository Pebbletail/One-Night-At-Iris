body = document.getElementsByTagName("body")[0];


function init_selectors() {
  const panels = document.getElementsByClassName("charContainer");
  const selectors = document.getElementsByClassName("aiSelectors");
  for (let i=0; i<6; i++) {
    let currpan = panels[i];
    currpan.addEventListener("mouseover", function() {
      show_selector(currpan);
    } )
    currpan.addEventListener("mouseout", function() {
      hide_selector(currpan);
    } )


    selectors[i].appendChild(create_arrow(1, currpan.id));
    selectors[i].appendChild(create_arrow(-1, currpan.id));
  }

}

function show_selector(self) {
  const toDisplay = document.getElementById(`${self.id}Select`);
  toDisplay.style.display = "flex";
}

function hide_selector(self) {
  const toDisplay = document.getElementById(`${self.id}Select`);
  toDisplay.style.display = "none";
}

function create_arrow(type, char) {
  const arrow = document.createElement("div");
  arrow.className = "aiArrow";
  arrow.id = String(type);
    if (type == 1) {
    arrow.style.backgroundImage = "url('../../resources/CustomNight/arrowUp.jpg"; }
    if (type == -1) {
    arrow.style.backgroundImage = "url('../../resources/CustomNight/ArrowDown.jpg')"; }
    
  arrow.onclick = function(){updateAI(type, char)};
  return arrow;
}

function updateAI(dir, char) {
  const display = document.getElementById(`${char}Num`);
  let currNum = Number(display.textContent);
  let newNum = String(currNum + (dir));
  if (newNum > -1 && newNum < 21) {
    display.textContent = String(newNum);
    sessionStorage.setItem(`${char}AI`, String(newNum)); }
}

function setAll20() {
  const nums = document.getElementsByClassName("counters");
  for (let i=0; i<nums.length; i++) {
    nums[i].textContent = "20";
    const char = document.getElementById((nums[i].id).substring(0, (nums[i].id).indexOf("N")));
  }
  sessionStorage.setItem("irisAI", "20");
    sessionStorage.setItem("taylorAI", "20");
    sessionStorage.setItem("leoAI", "20");
    sessionStorage.setItem("picklesAI", "20");
    sessionStorage.setItem("hazelAI", "20");
    sessionStorage.setItem("rubyAI", "20");
    sessionStorage.setItem("nigelAI", "20");
}

function setAll0() {
  const nums = document.getElementsByClassName("counters");
  for (let i=0; i<nums.length; i++) {
    nums[i].textContent = "0";
    let char = document.getElementById((nums[i].id).substring(0, (nums[i].id).indexOf("N")));
  }
  sessionStorage.setItem("irisAI", "0");
    sessionStorage.setItem("taylorAI", "0");
    sessionStorage.setItem("leoAI", "0");
    sessionStorage.setItem("picklesAI", "0");
    sessionStorage.setItem("hazelAI", "0");
    sessionStorage.setItem("rubyAI", "0");
    sessionStorage.setItem("nigelAI", "0");
}

function main() {
  init_selectors();
  setAll0();
}

main();
