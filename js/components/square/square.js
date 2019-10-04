class Square extends PFrontComponent{

  /********** templates **********/
  render(){
    return `
      <div id="${this.name}" onclick="pMsg('${this.name}', 'click', null)" oncontextmenu="javascript:pMsg('${this.name}', 'clickRight', null);return false;">
        ${this[this.state["template"]]()}
      </div>`;
  }

  defaultTemplate(){
    this.className    = "";
    this.onclickLeft  = `pMsg('${this.name}', 'click', null)`;
    this.onclickRight = `javascript:pMsg('${this.name}', 'clickRight', null);return false;`;
    return '<i class="fa fa-circle-thin" aria-hidden="true"></i>';
  }

  shownTemplate(){
    this.className    = "done";
    this.onclickLeft  = null;
    this.onclickRight = null;
    return this.bombsAround;
  }

  theBomb(){
    this.className    = "bomb";
    this.onclickLeft  = null;
    this.onclickRight = null;
    return '<i class="fa fa-times-circle" aria-hidden="true"></i>';
  }

  theFlag(){
    this.className    = "flag";
    this.onclickLeft  = null;
    this.onclickRight = `javascript:pMsg('${this.name}', 'clickRight', null);return false;`;
    return '<i class="fa fa-flag" aria-hidden="true"></i>';
  }
  /******* end of templates *******/


  /************ methods ************/
  constructor(args){
    super(args);

    this.className;
    this.onclickLeft;
    this.onclickRight;

    this.bomb           = args.bomb;
    this.bombsAround    = null;
    this.id             = args.id;
    this.noBombAround   = [];
    this.state.template = "defaultTemplate";
  }

  click(){
    if (this.bomb) return self.page.gameOver();
    this.checkSquareValue();
  }

  clickRight(){
    switch(this.state.template){
      case "defaultTemplate" : 
        this.setState({template : "theFlag"});
        break;
      case "theFlag" : 
        this.setState({template : "defaultTemplate"});
        break;
    }
  }

  checkSquareValue(){
    if (this.bombsAround === null) this.defineAround();
    if (this.bombsAround > 0)      this.revealSquare();
    else {
      self.page.list = [];
      this.checkAround();
      self.page.remaining -= self.page.list.length;

      //on affiche les cases vides. La fonction est directement dans le DOM pour gagner en performance
      postMessage({
        "revealEmptySquare" : self.page.list.sort()
      });
    }
    if (self.page.remaining === self.page.maxBombs) self.page.win();
  }

  checkEmpty(){

    // si cette case est marquée d'un drapeau on ne l'évalue pas
    if (this.state.template === "theFlag") return null;
    
    // si cette case a déjà été controllée (puisque le nombre de bombes autour est défini) on retourne null
    if (this.bombsAround !== null) return null;

    // on cherche le nombre de bombes
    this.defineAround();

    // si il y a des bombes on retourne null
    if (this.bombsAround > 0 ) {
      this.revealSquare(); 
      return null;
    }

    // il n'y a pas de bombes -> on cherches parmis les cases autours lesquelles sont vides également
    this.checkAround();
  }

  checkAround(){
    self.page.list.push(this.id);
    let nSquares = this.noBombAround.length;
    for(let i=0; i<nSquares; i++){
      self.components["square"+this.noBombAround[i]].checkEmpty();
    }
    return;
  }

  defineAround(){
    let available = [
      this.id - self.page.col - 1,
      this.id - self.page.col,
      this.id - self.page.col + 1,
      this.id - 1,
      this.id + 1,
      this.id + self.page.col - 1,
      this.id + self.page.col,
      this.id + 1 + self.page.col
    ];
    let row       = Math.floor(this.id / self.page.col);
    let col       = this.id-(self.page.col*row);
    let rowMax    = Math.floor(self.page.maxSquares / self.page.col);

    if ( col - 1 === -1)            available[0] = available[3] = available[5] = null;
    if ( col + 1 >= self.page.col ) available[2] = available[4] = available[7] = null;
    if ( row - 1 === -1)            available[0] = available[1] = available[2] = null;
    if ( row + 1 >= rowMax )        available[5] = available[6] = available[7] = null;

    this.bombsAround = 0;
    for (let i=0; i<8; i++){
      if (available[i] === null) continue;
      if (self.components["square"+available[i]].bomb) this.bombsAround++;
      else this.noBombAround.push(available[i]);
    }
  }

  revealSquare(){
    this.setState({"template" : "shownTemplate"});
    self.page.remaining--;
  }

  updateState(){
    this.updateDOMcomponent({
      "content"   : this[this.state["template"]](),
      "container" : {
        "class"         : this.className,
        "onclick"       : this.onclickLeft,
        "oncontextmenu" : this.onclickRight
      }
    });
  }

/********* end of methods *********/
}