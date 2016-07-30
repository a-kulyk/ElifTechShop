class Filter {
    constructor() {
        this.properties = [{}];
        this.searchField = "";
        this.categories = [];
        this.min_price = 0;
        this.max_price = Math.pow(10,6);
        this.pages = 1;
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
                value.forEach(function (element) {
                    if (!("" == element)) {
                        let valueObject = {'properties.value': element};
                        propertyArray.push(valueObject);
                    }
                });
                property= {'properties.name' : name, $or : propertyArray};
            } else {
                property= {'properties.name' : name, 'properties.value': value};
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
                this.sort.price = 1;
                break;
            }
            case 'expensive' : {
                this.sort.price = -1;
                break;
            }
            default : {
                this.sort.price = 1;
            }

        }
    }


    definePage (number) {
        this.pages = Math.abs(parseInt(number)) || 1;
        let per_page = this.perPage;
        let skip = per_page > 0 ? (this.pages-1)*per_page : 0;
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

    setPrice(min,max) {
        if(min && max) {
            min = Math.abs(parseInt(min));
            max = Math.abs(parseInt(max));
        }
        this.min_price = min || 0;
        this.max_price = max || Math.pow(10,6);
    }



    setCategories(categories) {
        if(categories) {
            if(Array.isArray(categories)) {
                categories.forEach(function (category) {
                    this.categories.push({"category" : category});
                });
                return
            }
            this.categories.push({"category" : categories});
        }
    }

    creatQuery () {
        let query = {$and: [{}]};
        if (this.searchField) {
            let searchQuery = {$or:[{name: this.searchField},{description: this.searchField}]};
            query.$and.push(searchQuery);
        }
        if(this.min_price && this.max_price) {
            let priceQuery = {'price': { $gt: (this.min_price - 1), $lt: (this.max_price + 1)}};
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