var config = {
  dev: 'development',
  prod: 'production',
  port: process.env.PORT || 3000,
  secrets: {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
},
  dbUrl: 'mongodb://andriikulyk:sicario@ds019654.mlab.com:19654/auth_db'
};

module.exports = config;