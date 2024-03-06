const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // Task 6: Register a new user
  // Write your code here
  const username = req.body.username;
  const password = req.body.password;
  //check username exist in the list
  const doesExist = (username) =>{
    let userwithsamename = users.filter((user) => {
        return user.username === username
    });
    if(userwithsamename.length > 0){
        return true;
    } else {
        return false;
    }
  }
  if (username && password) {
    if(!doesExist(username)) {
        users.push({"username":username, "password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login."});
    } else {
        return res.status(404).json({message: "User already exists."});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1 & Task 10: Get the book list available in the shop
// const getBooks
const getBooks = () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

// Task 1 & 10,12,13: Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBooks(books)
    .then(
      result => res.send(result),
      error => res.status(error.status).json({message: error.message})
  );
  //res.send(JSON.stringify(books,null,3));
  
});

// Task 2 & 11: Const getByISBN
const getByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({ status: 404, message: `ISBN ${isbn} not found` });
        }
    });
};
// Task 2 & Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  getByISBN(isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
 });
  
// Task 3 & Task 12: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});

// Task 4 & Task 13: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  getByISBN(isbn)
    .then(
        result => res.send(result.reviews),
        error => res.status(error.status).json({message: error.message})
    );
});

module.exports.general = public_users;
