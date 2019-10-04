self.components = {};

/**
 * lits of the shared values
 * @type {Object}
 */
self.shared = {};

/**
 * add an entry in shared values list and give the desired value to the subscriber
 * @param {String} component  the target component's name
 * @param {String} key        the key that should be observed
 * @param {String} subscriber the component which want to have the update
 */
self.addSharedState = function(component, key, subscriber){
  if (self.shared[component][key] === undefined ) self.shared[component][key] = [subscriber];
  else                                            self.shared[component][key].push(subscriber);
  self.shareState(component, key, subscriber);
};


self.checkSharedState = function(component, newState){
  let nSubscribers;
  for (let value of Object.entries(newState)) {
    if (self.shared[component] === undefined)      continue;
    if (self.shared[component][value[0]] === undefined) continue;
    nSubscribers = self.shared[component][value[0]].length;
    for(let i=0; i< nSubscribers; i++){
      self.shareState(component, value[0], self.shared[component][value[0]][i]);
    }
  }
};

// getHtml = function(componentName, functionToCall="html"){
//   return components[componentName][functionToCall]();
// }

/**
 * import components's class  
 * @function
 * @param  {array}  components   a list of component to download
 * @return {void} 
 */
// importClassComponents = function(components){
//   let component; 
//   let nComponents = components.length;
//   for ( let i=0; i< nComponents; i++ ) {
//     if (loaded.pages.indexOf(components[i]) === -1 ){
//       component = components[i].firstLower();
//       importScripts(`${paths.components}${component}/${component}.js`);
//       loaded.components.push(components[i]);
//     }    
//   }
// }

self.makeComponent = function( componentName, component){
  if (self.components[componentName] === undefined){
    self.components[componentName]      = component;
    self.components[componentName].name = componentName;
  }
  // console.log("self.components:",self.components);
  return self.components[componentName].render();
};

self.shareState = function(component, key, subscriber){
  // if the subscriber doesn't exist anymore it should be removed for subscriber's list
  if (self.components[subscriber] === undefined) {
    self.shared[component][key].splice(self.shared[component][key].indexOf(subscriber),1);
    return;
  }

  //check if the value exist in component
  if (self.components[subscriber].state.otherComponents[component] === undefined) self.components[subscriber].state.otherComponents[component] = {};

  // update subriber
  self.components[subscriber].state.otherComponents[component][key] = self.components[component].state[key];
  self.components[subscriber].updateState();
};

/**
 * allow to a component to follow key from state of another one
 * @function
 * @param  {String}         component  component's name thatyou want to have a state value
 * @param  {String | Array} key        state's key of the component you want to have updates
 * @param  {String}         subscriber the component that wants to have the updates
 * @return {void}                      call the function shareState in order to set the data 
 */
self.subscribe = function(component, keys, subscriber){
  if (self.shared[component] === undefined) self.shared[component] = {};
  if (typeof keys === "string"){
    console.log("subscribe String");
    self.addSharedState(component, keys, subscriber);
    return;
  }
  let nKeys = keys.length;
  for(let i=0; i<nKeys; i++){
    self.addSharedState(component, keys[i], subscriber);
  }  
};