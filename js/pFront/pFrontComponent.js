/**
 * the class that handle components in WORKER side
 */
class PFrontComponent{

  /**
   * [constructor description]
   * @todo faire le commentaire
   * @return {[type]} [description]
   */
  constructor(){
    this.state = {
      "otherComponents" : {}
    };
    this.beforeDie = [];
  }

  /**
   * [die description]
   * @todo faire le commentaire
   * @return {[type]} [description]
   */
  die(){
    let nTodo = this.beforeDie.length;
    for (var i = 0; i < nTodo; i++) {
      eval(this.beforeDie[i]);
    }
    postMessage({
      "removeComponent" : this.name
    });
    delete self.components[this.name];
  }

  /**
   * [render description]
   * @todo faire le commentaire
   * @return {[type]} [description]
   */
  render(){}

  /**
   * update the component's state and check in workerManager if the values is (are) shared with other components
   * @param {JSON} newState the object you want to merge with current state. 
   * @this {PFrontComponent}
   */
  setState(newState){
    this.state = {...this.state, ...newState};
    this.updateState();
    self.checkSharedState(this.name, newState);
  }

  /**
   * Allow to this component to receive state's update from another component. It call the subribe's function of the workerManager 
   * @param  {String} otherComponent other component's name
   * @param  {String} properties     property's name
   * @return {void}
   */
  subscribe(otherComponent, properties){
    self.subscribe(otherComponent, properties, this.name);
  }

  /**
   * this function should be redefined in the component with custom rules
   * @return {void}
   */
  updateState(){
    console.warn(`you should define updateState function in ${this.name}'s component`);
  }


  /**
   * udpate a component in the DOM
   * @param  {JSON} thingsToUpdate /!\ todo : to complete 
   * @return {void}                send message to the DOM
   */
  updateDOMcomponent(thingsToUpdate){
    self.updateDOMcomponent(thingsToUpdate, "#"+this.name);
  }
}