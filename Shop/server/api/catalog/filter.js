class Filter {
  constructor() {
    this.properties = [{}];
    this.searchField = "";
    this.categories = [];
    this.min_price = 0;
    this.max_price = Math.pow(10,6);
    this.page = 1;
    this.perPage = 9;
    this.sort =  {
      'quantity' : -1,
      'price': 1
    }
  }

  setProperties(name,value) {
    if(name && value) {
      let property = {};
      if(Array.isArray(value)) {
        let propertyArray = [];
        for (var item in value) {
          if (!("" == value[item])) {
            let valueObject = {'properties.value' : value[item]}
            propertyArray.push(valueObject);
          }
        } 
        property= {'properties.name' : name, $or : propertyArray};
        console.log(property);
      } else {
        property= {'properties.name' : name, 'properties.value': value};
        console.log(property);
      }
    this.properties.push(property);
    }
  }

  getSort () {
    return this.sort;
  }

  setSort (by) {
    if(typeof by == "undefined") return;
    switch(by) {
      case 'cheap' : {
        this.sort.price = 1
        break;
      }
      case 'expensive' : {
        this.sort.price = -1
        break;
      }
      default : {
        this.sort.price = 1
        };
        
      }
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

   setMinPrice(price) {
    if(typeof price !== 'undefined') {
      var price = Math.abs(parseInt(price));
    } 
    this.min_price = price || 0;
  }

  setMaxPrice(price) {
    if(typeof price !== 'undefined') {
      var price = Math.abs(parseInt(price));
    } 
    this.max_price = price || Math.pow(10,6);
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
    if((typeof this.min_price !== 'undefined') && (typeof this.max_price !== 'undefined')) {
      let priceQuery = {'price': { $gt: (this.min_price - 1), $lt: (this.max_price + 1) } };
      query.$and.push(priceQuery);
    } 
    if(this.properties) {
      let propertiesQuery = {$and : this.properties};
      query.$and.push(propertiesQuery);
    }
    if(!(this.categories.length < 1)) {  
      let categoriesQuery = {$or : this.categories};
      query.$and.push(categoriesQuery);
    }
    


    return query;
  }

}

module.exports = Filter;