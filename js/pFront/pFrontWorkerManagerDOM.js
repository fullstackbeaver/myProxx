self.getFormValues = function(componentName, functionCallBackName){
  postMessage({
    "getFormValues" : {
      "callBack"      : functionCallBackName,
      "componentName" :componentName
    }
  });
};

/**
 * insert html in a DOM node
 * @param  {String} DOMcontainer an element that can be reached by queryselector
 * @param  {String} DOMcontent   an HTML string ton insert in DOM node
 * @return {void}              
 */
self.insertDOM = function(DOMcontainer, DOMcontent){
  postMessage({
    "insertDOM" : {
      "DOMcontainer" : DOMcontainer,
      "DOMcontent"   : DOMcontent
    }
  });
};

/**
 * add a component with functions in DOM
 * @param  {String} componentName   the name of the component that will be created and receive the function 
 * @param  {String} classToInvoke   an object with mainly functions inside needed for make some DOM actions
 * @return {void}
 */
self.makeLinkedComponentInDOM = function(componentName, classToInvoke){
  // let classPath      = classToInvoke.firstLower();
  postMessage({
    "makeLinkedComponentInDOM" : {
      "classToInvoke" : classToInvoke,
      "name"          : componentName,
    }
  });
};

/**
 * update a component in the DOM
 * @param  {JSON}    thingsToUpdate             a JSON including things to updates
 * @param  {String}  [thingsToUpdate.container] 
 * @param  {String}  [thingsToUpdate.content ]
 * @param  {String}  target                     the id of the component to update
 * @return {void}                               send a post message
 */
self.updateDOMcomponent = function(thingsToUpdate, target){
  postMessage({
    "updateDOMcomponent" : {
      "recipient" : target,
      ...thingsToUpdate
    }
  });
};