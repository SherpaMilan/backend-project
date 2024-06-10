const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
const { username, password } = req.body;

if (!username || !password) {
  return res
    .status(400)
    .json({ message: "Username and password are required" });
}

if (users.find((user) => user.username === username)) {
  return res.status(400).json({ message: "Username already exists" });
}

users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
  

});

// Get the book list available in the shop
const axios = require("axios");

public_users.get("/", (req, res) => {
  axios
    .get("http://localhost:6000/books")
    .then((response) => {
      const books = response.data;
      return res.status(200).json(books);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    });
});


// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/books/${isbn}`);
    const book = response.data;
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});



  public_users.get("/author/:author", async function (req, res) {
    const author = req.params.author;
    try {
      const response = await axios.get(
        `http://localhost:5000/books?author=${author}`
      );
      const books = response.data;
      if (books.length === 0) {
        return res
          .status(404)
          .json({ message: "No books found for the author" });
      }
      return res.status(200).json(books);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });



// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(
      `http://localhost:5000/books?title=${title}`
    );
    const books = response.data;
    if (books.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json(books[0]); // Assuming there is only one book with the title
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn; // Extract ISBN from request parameters

  // Convert the books object into an array of book objects
  const booksArray = Object.values(books);

  const book = booksArray.find((book) => book.isbn === isbn); // Find the book with the matching ISBN

  if (!book) {
    return res.status(404).json({ message: "Book not found" }); // If book not found, return 404 status
  }
  // Get the reviews for the book
  const reviews = book.reviews;

  return res.status(200).json(reviews); // If book found, return book details
});

module.exports.general = public_users;
