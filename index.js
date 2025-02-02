const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}))

app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here
    const token = req.session.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, "your_jwt_secret_key");
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).json({ message: "Invalid token." });
    }
     



});
 
const PORT =6000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
