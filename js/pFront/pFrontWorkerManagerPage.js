/**
 * store all pages in order they had been shown (WORKER side)
 * @type {Array}
 */
self.history = [];

/**
 * the actual page (WORKER side)
 * @type {Object}
 */
self.page    = {};

/**
 * create a new page or change the actual page to another one
 * @function
 * @param  {String} newPage page name to create. 
 * @return {void}
 */
self.makePage = function(newPage, options={}){
  // console.log("makePage");
  let previousComponents = [];
  for (let key of Object.entries(self.components)) {
    previousComponents.push(key[0]);
  }
  
  let todo = `new ${newPage.firstUpper()}(`;
  if (Object.entries(options).length !== 0) todo += "options";
  todo += ")";
  self.page = eval(todo);

  // console.log("self.page.transition",self.page.transition);
  if(self.page.transition !== undefined){
    self.components.transition = self.page.transition;
    self.components.transition.init(previousComponents);
  }
  else self.switchPage(previousComponents);

};

/**
 * [switchPage description]
 * @todo faire le commentaire
 * @param  {[type]} previousComponents [description]
 * @return {[type]}                    [description]
 */
self.switchPage = function(previousComponents){
  // console.log("switchPage",previousComponents,self.page);
  for (let key of previousComponents) {
    if (self.page.keep.indexOf(key) == -1) delete self.components[key];
  }
  postMessage({
    "updatePage" : {
      "name"         : self.page.name,
      "html"         : self.page.render(),
      "tagContainer" : self.page.tagContainer,
      "title"        : self.page.title,
    }
  });
  history.push(self.page.name);
};

/**
 * shortcut of makePage
 * @function
 */
self.changePage = self.makePage;