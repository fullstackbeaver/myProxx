class PFrontTransition extends PFrontComponent {

  /**
   * [constructor description]
   * @todo faire le commentaire
   * @return {[type]} [description]
   */
  constructor(){
    super();
    this.name       = "transition";
    this.pointerEnd = false;
  }

  /**
   * [end description]
   * @todo faire le commentaire
   * @return {[type]} [description]
   */
  end(){
    if (this.pointersEnd) return;
    this.pointersEnd = true;

    //changer de page;
    self.switchPage(this.previousComponents);
    
    //enlever le listener & changer de classe & ajouter un listener
    postMessage({
      "removeEventListener" : {
        "event"     : "transitionend",
        "function"  : "waiting",
        "recipient" : "transition"
      },
      "addEventListener" : {
        "event"     : "transitionend",
        "function"  : "finished",
        "recipient" : "transition"
      },
      "updateDOMcomponent" : {
        "recipient"    : "transition",
        "containerAdd" : {
          "className" : this.endClass
        }
      }
    });
  }

  /**
   * [finished description]
   * @todo faire le commentaire
   * @return {[type]} [description]
   */
  finished(){
    postMessage({
      "removeEventListener" : {
        "event"     : "transitionend",
        "function"  : "finished",
        "recipient" : "transition"
      }
    });
    this.die();
  }

  /**
   * [init description]
   * @todo faire le commentaire
   * @param  {[type]} previousComponents [description]
   * @return {[type]}                    [description]
   */
  init(previousComponents){
    this.previousComponents = previousComponents;
    postMessage({
      "addNode" : {
        "DOMcontainer" : "body",
        "tagName"      : "transition",
        "specs"        : {
          "id"        : "transition",
          "className" : "",
        }
      }
    });
  }

  /**
   * [ready description]
   * @todo faire le commentaire
   * @return {[type]} [description]
   */
  ready(){
    setTimeout(this.start.bind(this),25);
  }

  /**
   * [start description]
   * @todo faire le commentaire
   * @return {[type]} [description]
   */
  start(){
    postMessage({
      "addEventListener" : {
        "event"     : "transitionend",
        "function"  : "waiting",
        "recipient" : "transition"
      },
      "updateDOMcomponent" : {
        "recipient"    : "transition",
        "containerAdd" : {
          "className" : this.startClass
        }
      }
    });
  }

  /**
   * [waiting description]
   * @todo faire le commentaire
   * @return {[type]} [description]
   */
  waiting(){
    console.log("waiting");
  }
}