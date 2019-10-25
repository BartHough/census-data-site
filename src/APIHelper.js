

class APIHelper {
  constructor() {
    this.tableObjects = [];
    this.variables = [];
  }
  

  getTables(apiData) {
    apiData.dataset.forEach(table => {
      this.tableObjects.push(
        {
          "id": table.c_dataset[2], // id needed for graph data API call URL
          "title": table.title.split(': ')[1], // takes table title description after ': '
          "varLink": table.c_variablesLink
        }
      );
    });
    return this.tableObjects;
  }

  async getVariables(varLink) {
    await fetch(varLink)
    .then(res => res.json())
      .then(data => {
        this.variables = data;
        console.log(data);
        return data;
        
      })
      .catch(console.log)
  }
}

export default APIHelper