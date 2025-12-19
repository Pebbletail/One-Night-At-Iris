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
  console.log("arrow");
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
  if (newNum > -1 && newNum < 21){
    display.textContent = String(newNum); }
}

function main() {
  init_selectors();
}

main();