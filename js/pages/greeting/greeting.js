class Greeting extends PFrontPage {

  /********** templates **********/
  render(){
    const content = makeComponent(
      "formulaire",
      new LevelForm()
    );
    return `
      <section id="formulaire">
        <h1>Swipper</h1>
        <p>choose your level</p>
        ${content}
      </section>
    `;
  }
  /******* end of templates *******/


  /************ methods ************/
  constructor(){
    super();
    this.name         = "greeting";
    this.tagContainer = "page";
    this.title        = "choisissze un niveau";
    if ( self.history.length > 0) this.transition = new Transition();
  }

  /********* end of methods *********/
}