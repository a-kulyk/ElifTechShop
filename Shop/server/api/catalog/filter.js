var _ = require('lodash');
class Filter {
    constructor() {
        this.properties = [{}];
        this.searchField = "";
        this.categories = [];
        this.min_price = 0;
        this.max_price = Math.pow(10, 6);
        this.pages = 1;
        this.perPage = 9;
        this.company = [];
        this.sort = {
            'price': 1
        }
    }

    setPerPage(perpage) {
        if (perpage) {
            this.perPage = parseInt(perpage) || 9;
        }
    }

    setProperties(name, value) {
        if (name && value) {
            let property = {};
            if (Array.isArray(value)) {
                let propertyArray = [];
                value.forEach(function (element) {
                    if (!("" == element)) {
                        let valueObject = {'properties.value': element};
                        propertyArray.push(valueObject);
                    }
                });
                property = {'properties.name': name, $or: propertyArray};
            } else {
                property = {'properties.name': name, 'properties.value': value};
            }
            this.properties.push(property);
        }
    }

    setCompany(companies) {
        let self = this;
        if (companies) {
            if (Array.isArray(companies)) {
                companies.forEach(function (company) {
                    console.log(this);
                    self.company.push({"company": company});
                });
                return
            }
            this.company.push({"company": companies});
        }

    }


    getSort() {
        return this.sort;
    }

    setSort() {

        if (!arguments[0]) return;
        arguments[0] = _.lowerCase(arguments[0]);
        if(arguments[0] != 'price' && arguments[0] != 'name') return;
        if(parseInt(arguments[1]) != -1 && parseInt(arguments[1]) != 1) {
            arguments[1] = 1;
        }
        let sortQuery = {};
        sortQuery[arguments[0]] = parseInt(arguments[1]);
        this.sort = sortQuery;
        console.log(this.sort)
    }


    definePage(number) {
        this.pages = Math.abs(parseInt(number)) || 1;
        let per_page = this.perPage;
        let skip = per_page > 0 ? (this.pages - 1) * per_page : 0;
        return {
            skip: function () {
                return skip
            },
            per_page: function () {
                return per_page;
            }
        }
    }

    setSearchField(text) {
        let searchExp = {};
        if (text) {
            let words = text.split(" ");
            for (let i = 0; i < words.length; i++) {
                words[i] = '?=.*' + words[i];
            }
            var searchExpe = "(" + words.join(')(') + ')';
            searchExp = new RegExp(searchExpe, "i");

        }
        this.searchField = searchExp;
    }

    setPrice() {
        let min = arguments[0];
        let max = arguments[1];
        if (min) {
            min = Math.abs(parseInt(min));
            this.min_price = min || 0;
        }

        if (max) {
            max = Math.abs(parseInt(max));
            this.max_price = max || Math.pow(10, 6);
        }


    }


    setCategories(categories) {
        let self = this;
        if (categories) {
            if (Array.isArray(categories)) {
                categories.forEach(function (category) {
                    self.categories.push({"category": category});
                });
                return
            }
            this.categories.push({"category": categories});
        }
    }

    creatQuery(params) {
        let query = {$and: [{}]};

        if (this.properties) {
            let propertiesQuery = {$and: this.properties};
            query.$and.push(propertiesQuery);
        }

        if (this.searchField) {
            let searchQuery = {$or: [{name: this.searchField}, {description: this.searchField}]};
            query.$and.push(searchQuery);
        }

        if (params) {
            query.$and.push(params)
        }

        if (!(this.company.length < 1)) {
            let companyQuery = {$or: this.company};
            query.$and.push(companyQuery);
        }


        if (this.min_price && this.max_price) {
            let priceQuery = {'price': {$gt: (this.min_price - 1), $lt: (this.max_price + 1)}};
            query.$and.push(priceQuery);
        }

        if (!(this.categories.length < 1)) {
            let categoriesQuery = {$or: this.categories};
            query.$and.push(categoriesQuery);
        }


        return query;
    }

}
module.exports = Filter;

