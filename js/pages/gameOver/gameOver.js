class GameOver extends PFrontPage {
  constructor(bombs){
    super();
    this.title = "game over";
    this.name  = "gameOver";
    // this.transitionIn = new Transition();
    
    const nBombs = bombs.length;
    for (let i=0; i<nBombs; i++){
      self.components["square"+bombs[i]].setState({"template":"theBomb"});
      // this.keep.push("square"+i);
    }

    self.insertDOM(
      "page",
      `<div class="message">
        <h1>Game Over</h1>
        <button onclick="pMsg(null,'changePage','greeting')">recommencer</button>
      </div>`
    );
  }
}