/**
 * class PFront is the main class of the framework. It launch the process
 * @class PFront
 */
class PFront{

  /**
   * @param  {JSON}    specs                      all arguments needed in order to initialyze the framework
   * @param  {JSON}    [specs.boot]               ordered boot sequence
   * @param  {JSON}    [specs.boot.makeObject]    allow to create an object following this structure "name" : class
   * @param  {JSON}    specs.classesMapping       a collection of needed objet to create them dynamically
   * @param  {JSON}    specs.paths                paths
   * @param  {String}  specs.paths.library        path where to load pFront's library files
   * @param  {String}  specs.paths.components     path where to load user's components files. Define ony if there is component that will extends pFrontComponent
   * @return {void}  
   */
  constructor(specs){
    this.components      = {};
    this.specs           = specs;

    // shortcuts
    window.pAction = this.pAction;
    window.pFront  = this;
    window.pMsg    = this.pMsg;

    this.workerManager = new Worker(specs.pFrontWorker, {"name":"pFrontWorkerManager"});
    this.workerManager.onmessage = function(event){
      // console.log("DOMpFront  receive :", event.data);
      // console.log(event.data.header.sender, pFront.components[event.data.header.sender]);
      for (let [key, value] of Object.entries(event.data)) {
        this[key](value);
      }
    }.bind(this);

    window.addEventListener("load", window.pFront.init.bind(this));
  }

  /**
   * add a listenener to a DOM element
   * @param {JSON}   args some arguments
   * @param {String} args.event
   * @param {String} args.function
   * @param {String} args.recipient  id of the element that should listen something
   */
  addEventListener(args){
    // console.log("addEventListener",args);
    let msg = {
      "recipient" : args.recipient
    };
    msg[args.function] = null;
    document
      .getElementById(args.recipient)
      .addEventListener(
        args.event, 
        ()=>window.pFront.workerManager.postMessage(msg)
      );
  }

  /**
   * alternative to insertDOM that can handle mutationObserver
   * @param {JSON}   elm               element to include
   * @param {String} elm.DOMcontainer  DOM element that will receive the new element
   * @param {String} elm.tagName       tag of the new element
   * @param {JSON}   elm.specs         specifications of the element
   */
  addNode(elm){
    var element = document.createElement(elm.tagName);
    for (let [key, value] of Object.entries(elm.specs)) {
      element[key] = value;
    }
    document.querySelector(elm.DOMcontainer).appendChild(element);
  }

  /**
   * function that observe and dispatch inforation about DOM's modifications
   * @todo changer "transition" qui est en dur par un tableau de données
   * @function
   * @param  {array} mutationsList list of MutationRecord
   * @return {void}
   */
  callbackObsverver(mutationsList) {
    // console.log(mutationsList);
    for(var mutation of mutationsList) {
      if (mutation.type == "childList") {
        if( mutation.addedNodes.length > 0){
          if (mutation.addedNodes[0].id == "transition"){
            window.pFront.workerManager.postMessage({
              "recipient" : "transition",
              "ready" : null
            });
          }
        }
      }
      else if (mutation.type == "attributes") {
        console.log(`L'attribut ${mutation.attributeName} de ${mutation.target.tagName}#${mutation.target.id}.${mutation.target.className} a été modifié.`);
      }
    }
  }

  /**
   * this functions has been made in order to get values from DOM for example document.body.clientWidth
   * @param  {JSON}   args           a JSON containig information
   * @param  {Array}  args.functions an array containig a list of functions to evaluate
   * @params {String} args.recipient the name of the object where to send the answer
   * @params {String} args.callBack  the name of the function where send the answer
   * @return {void}                  send a post message
   */
  DOMfunctions(args){
    let msg = {
      "recipient" : args.recipient
    };
    msg[args.callBack] = {};
    const nFunctions = args.functions.length;
    for (let i=0; i<nFunctions; i++){
      msg[args.callBack][args.functions[i]] = eval(args.functions[i]);
    }
    window.pFront.workerManager.postMessage(msg);
  }

  /**
   * get all inputs values from a component
   * @param  {JSON}   args                JSON which include the component name and the function name to call on succeed
   * @param  {String} args.componentName  the name of the component
   * @param  {String} args.callBack       the name of the function to call
   * @return nothing : send a postmessage
   */
  getFormValues(args){
    let answer = {};
    let elms   = document.getElementById(args.componentName).querySelectorAll("input");
    for (let elm of Object.entries(elms)) {
      switch (elm[1].type){
        case "checkbox" :
          answer[elm[1].name] = document.getElementById(elm[1].id).checked;
          break; 
        default : 
          answer[elm[1].name] = elm[1].value;
          break;
      }
    }
    elms   = document.getElementById(args.componentName).querySelectorAll("select");
    for (let elm of Object.entries(elms)) {
      answer[elm[1].name] = elm[1].options[elm[1].selectedIndex].value;
    }
    let msg= {
      "recipient" : args.componentName
    };
    msg[args.callBack] = answer;
    this.workerManager.postMessage(msg);
  }

  /**
   * [getParent description]
   * @param  {String} element element to find the parent
   * @return {Node}           the parent's node element 
   */
  // getParent(element){
  //   return document.querySelector(element).parentNode;
  // }
 
  /**
   * [init description]
   * @todo faire le commentaire
   * @return {[type]} [description]
   */
  init(){
    window.removeEventListener("load", window.pFront.init);


    /**
     * object that observe dom's modifications
     * @type {MutationObserver}
     */
    this.observer = new MutationObserver(this.callbackObsverver.bind(this));
    this.observer.observe(document.body, { attributes: true, childList: true } );

    //import needed libraries
    if (this.specs.importLibraries !== undefined) {
      this.workerManager.postMessage({
        "importLibraries": this.specs.importLibraries
      });
    }

    //launch boot options
    // if (this.specs.hasOwnProperty("boot")) {
    if (this.specs.boot !== undefined) {
      this.workerManager.postMessage(this.specs.boot);
    }

    //replace existing element
    if (this.specs.boot.makePage === undefined) window.pFront.replaceItems(document.querySelectorAll("[data-pFront]"));

    delete this.replaceItems;
    delete this.specs;
  }

  /**
   * [insertDOM description]
   * @todo faire le commentaire
   * @param  {[type]} args [description]
   * @return {[type]}      [description]
   */
  insertDOM(args){
    document.querySelector(args.DOMcontainer).innerHTML += args.DOMcontent;
  }


  /**
   * Create a page. Function used when pFront is started from scracth and not from a rendered page by a server
   * @param  {String} page the page name (same as the object which is based on)
   * @return {void}
   */
  makePage(page){
    this.changePage(page); 
  }

  /**
   * [pAction description]
   * @todo faire le commentaire
   * @param  {[type]} component            [description]
   * @param  {[type]} functionCallBackName [description]
   * @return {[type]}                      [description]
   */
  pAction(component, functionCallBackName){
    window.pFront.components[component][functionCallBackName]();
  }

  /**
   * send message to pFrontWorkerManager
   * @function
   * @param  {String|null} recipient it defines who to send the message to. If it's null the message is sent to pFrontWorkerManager directly
   * @param  {String}      action    [description]
   * @param  {JSON}        args      [description]
   * @return {void}
   */
  pMsg(recipient, action, args=null){
    let msg = {};
    if ( recipient !== null )  msg.recipient = recipient;    
    msg[action] = args;
    window.pFront.workerManager.postMessage(msg);
  }

  /**
   * [replaceItems description]
   * @todo faire le commentaire
   * @param  {[type]} list [description]
   * @return {[type]}      [description]
   */
  replaceItems (list){
    if (list.length === 0) return;
    let nItems = list.length;
    let tmp;
    for (let i=0; i<nItems; i++){
      tmp        = JSON.parse(list[i].dataset.pFront);
      tmp.dom    = list[i];
      tmp.method = "replaceInner";
      tmp.name   = list[i].id;
      delete list[i].dataset.pFront;
      new this.classesMapping[tmp.component](tmp);
    }
  }

  /**
   * remove a component from DOM
   * @param  {String} componentId Id of the component to remove
   * @return {void}
   */
  removeComponent(componentId){
    let target = document.getElementById(componentId);
    target.parentNode.removeChild(target);
  }

  /**
   * [removeEventListener description]
   * @todo faire le commentaire
   * @param  {[type]} args [description]
   * @return {[type]}      [description]
   */
  removeEventListener(args){
    let msg = {
      "recipient" : args.recipient
    };
    msg[args.function] = null;
    document
      .getElementById(args.recipient)
      .removeEventListener(
        args.event, 
        ()=>window.pFront.workerManager.postMessage(msg)
      );
  }

  /**
   * [updateDOMcomponent description]
   * @todo faire le commentaire
   * @param  {[type]} args [description]
   * @return {[type]}      [description]
   */
  updateDOMcomponent(args){
    // console.log("updateDOMcomponent", args);
    let target = document.querySelector(args.recipient);
    if ( args.container !== undefined ){
      for (let [key, value] of Object.entries(args.container)) {
        target.setAttribute(key,value);
      }
    }
    if ( args.containerAdd !== undefined ){
      for (let [key, value] of Object.entries(args.containerAdd)) {
        target[key] += ` ${value}`;
      }
    }
    if ( args.content !== undefined ) target.innerHTML = args.content;
  }

  /**
   * [updatePage description]
   * @todo faire le commentaire
   * @param  {[type]} args [description]
   * @return {[type]}      [description]
   */
  updatePage(args){
    let target;
    if (args.tagContainer !== undefined) target = document.querySelector(args.tagContainer);
    // console.log("updatePage",target, args);
    for (let [key, value] of Object.entries(args)) {
      if (value === undefined) continue;
      switch (key){
        case "name" :
          document.body.className = value;
          break;
        case "title" :
          document.title = value;
          break;
        case "html" :
          target.innerHTML = value;
          break;
      }
    }
  }

  /**
   * update stylesheet
   * @param  {JSON} args a json containing elements to update
   * @return {void}
   */
  updateStyleProperties(args){
    for (let [key, value] of Object.entries(args)) {
      document.documentElement.style.setProperty(key, value);
    }
  }

}

export default PFront;