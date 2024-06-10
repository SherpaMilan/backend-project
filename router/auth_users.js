const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users =[]

const isValid = (username) => {
  // Check if the username is at least 3 characters long
  return username.length >= 3;
};

// Check if the username and password match the ones in records
const authenticatedUser = (username, password) => {
    const user = users.find((user) => user.username === username && user.password === password);
    return !!user;
};

//only registered users can login

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body; // Extract username and password from request body

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username and password match the records
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ username }, "secret_key");

    // Return the token
    return res.status(200).json({ token });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Extract the JWT token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the JWT token
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Extract the username from the decoded JWT token
        const username = decoded.username;

        // Extract the ISBN from the request parameters
        const isbn = req.params.isbn;

        // Extract the review from the request body
        const { review } = req.body;

        // Check if the user has already reviewed the book
        if (books[isbn].reviews[username]) {
            // Modify the existing review
            books[isbn].reviews[username] = review;
        } else {
            // Add a new review
            books[isbn].reviews[username] = review;
        }

        // Return a success message
        return res.status(200).json({ message: "Review added/modified successfully" });
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username; // Assuming you are storing the username in the session
  
  // Filter out the reviews for the given ISBN that belong to the current user
  books[isbn].reviews = books[isbn].reviews.filter(review => review.username !== username);

  return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
