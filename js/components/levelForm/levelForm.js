class LevelForm{

  /********** templates **********/
  render(){
    return `
      <select name="levelFormSelect">
        <option value="10*10|10">easy</option>
        <option value="20*20|20" disabled>medium</option>
        <option value="30*30|30" disabled>hard</option>
      </select>
      <button onclick="
        pFront.getFormValues({
          'componentName' : '${this.name}',
          'callBack'      : 'changePage'
        })
      ">GO</button>
    `;
  }
  /******* end of templates *******/


  /************ methods ************/
  changePage(values){
    let tmp = values.levelFormSelect.split("*");
    tmp[1] = tmp[1].split("|");
    self.changePage("game", {
      bombs   : Number(tmp[1][1]),
      columns : Number(tmp[1][0]),
      rows    : Number(tmp[0]),
    });
  }

/********* end of methods *********/
}