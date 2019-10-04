class Game extends PFrontPage {

  /********** templates **********/
  render(){
    let content = "",
      name;
    for (let i=0; i<this.maxSquares; i++){
      name = "square"+i;
      content += makeComponent(
        name,
        new Square({
          "id"   : i,
          "bomb" : this.bombs.indexOf(i) !== -1
        })
      );
    }
    return `<section>${content}</section>`;
    
  }
  /******* end of templates *******/


  /************ methods ************/
  constructor(options){
    super();
    this.bombs        = [];
    this.col          = options.columns;
    this.keep         = [];
    this.maxBombs     = options.bombs;
    this.maxSquares   = options.columns*options.rows;
    this.name         = "game";
    this.remaining    = this.maxSquares;
    this.rows         = options.rows;
    this.tagContainer = "page";
    this.title        = "my Proxx";
    this.transition   = new Transition();

    var tmp;

    for (let i=0; i<this.maxBombs; i++){
      tmp = Math.floor(Math.random() * this.maxSquares);
      if (this.bombs.indexOf(tmp) != -1) i--;
      else this.bombs.push(tmp);
    }
    postMessage({
      "updateStyleProperties" : {
        "--nRows"    : options.rows,
        "--nColumns" : options.columns
      }
    });
  }

  gameOver(){
    self.changePage("gameOver", this.bombs);
  }

  win(){
    self.changePage("win");
  }

  /********* end of methods *********/
}