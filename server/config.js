module.exports = {
  jwtSecret: process.env.POSTBUCKET_JWT_SECRET,           // "topsecretfornow"
  passportSecret: process.env.POSTBUCKET_PASSPORT_SECRET, // 'EEIJY7wZRcyQXoVgLDf4JAui4NNszHZYCIW+gAGR7X3IQbe7RALNMcBv2EPZOYrr'
  mongoUrl: process.env.POSTBUCKET_MONGODB                // 'mongodb://localhost/postbucket'
};