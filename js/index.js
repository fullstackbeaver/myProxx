import PFront from './pFront/pFront.js';

new PFront({
  "pFrontWorker"    : "/js/pFront/pFrontWorkerManager.js",
  "importLibraries" : [
    //pFront
    "/js/pFront/pFrontTransition.js",

    //components
    "/js/components/levelForm/levelForm.js",
    "/js/components/square/square.js",
    "/js/components/transition/transition.js",

    //pages
    "/js/pages/game/game.js",
    "/js/pages/gameOver/gameOver.js",
    "/js/pages/greeting/greeting.js",
    "/js/pages/win/win.js",
    
  ],
  "boot" : {
    // "makeObject" : {
    // "network"    : Network,
    // "modal"      : Modal
    // },
    "makePage" : "greeting",
  }
});

/**
 * this function is placed in DOM directly in order to improve performances. It reveal empty square by changing innerHtml and className
 * @param  {Array} list a list that contain square's Id
 * @return {void}      
 */
window.pFront.revealEmptySquare = function(list){
  let nList = list.length;
  let target;
  for(let i=0; i<nList ; i++){
    target = document.getElementById('square'+list[i]);
    target.className = "empty";
    target.innerHTML = "";
    target.onclick   = null;
  }
};