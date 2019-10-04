class Win extends PFrontPage {
  constructor(){
    super();
    this.keep  = [];
    this.name  = "gameOver";
    this.title = "vous avez gagné!";

    self.insertDOM(
      "page",
      `<div class="message">
        <h1>You Win !</h1>
        <button onclick="pMsg(null,'changePage','greeting')">recommencer</button>
      </div>`
    );
  }
}