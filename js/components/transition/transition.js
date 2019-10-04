class Transition extends PFrontTransition{
  constructor(){
    super();
    this.startClass = "wait";
    this.endClass   = "end";
  }

  waiting(){
    this.end();
  }
}