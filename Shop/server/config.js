var config = {
  dev: 'development',
  prod: 'production',
  port: process.env.PORT || 3000,
  API_KEY: "d6911f567ef734f18ea176481638cc8a",
  shopBankAccount: "57a9152719e3cdbc10730705",
  shopEmail: "shop@gmail.com",
  shopAddress: {
    str: "Heroiv UPA Street, 73, Lviv, Lviv Oblast, Ukraine",
    lat: "49.829068",
    lng: "23.992714"
  },
  secrets: {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
},
  dbUrl: 'mongodb://andriikulyk:sicario@ds019654.mlab.com:19654/auth_db'
  //npdbUrl: 'mongodb://localhost/shop_app_new'
};

module.exports = config;