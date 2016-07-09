class Filter {
  constructor() {
    this.properties = [{}];
    this.searchField = "";
    this.categories = [];
    this.page = 1;
    this.perPage = 4;
  }

  setProperties(name,value) {
    let property= {'properties.name' : name, 'properties.value': value};
    this.properties.push(property);
  }

  setPage (number) {
    this.page = Math.abs(parseInt(number)) || 1;
    let per_page = this.perPage;
    let skip = per_page > 0 ? (this.page-1)*per_page : 0;
      return {
        skip : function () {return skip},
        per_page: function() {return per_page;}
      }
  }

  setSearchField(text) {
    let searchExp = {};
    if(text) {
      searchExp = new RegExp(text+"*","i");
    } 
    this.searchField = searchExp;

  }

  setCategories(cat) {
    if(cat) {
      if(Array.isArray(cat)) {
        for(let i in cat) {
          this.categories.push({"category" : cat[i]});
        }
        return
      }
      this.categories.push({"category" : cat});
    } 
  }

  creatQuery () {
    let query = {$and: [{}]};
    if (this.searchField) {
      let searchQuery = {$or:[{name: this.searchField},{description: this.searchField}]}
      query.$and.push(searchQuery);
    }
    if(this.properties) {
      let propertiesQuery = {$and : this.properties};
 
      query.$and.push(propertiesQuery);
    }
    if(!(this.categories.length < 1)) {
      console.log(this.categories);
      let categoriesQuery = {$or : this.categories};
      query.$and.push(categoriesQuery);
    }


    return query;
  }

}

module.exports = Filter;