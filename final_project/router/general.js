const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doexist = (username) =>{
    const userwithsamename = users.filter(user => {
        return user.username = username;
    })
    if(userwithsamename.length > 0)
    return true;
else
return false
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password
    if(username && password){
        if(!doexist){
            users.push({"username":username,"password":password})
           return res.status(200).json({message:"User registered succesfully"})
        }
    else{
        return res.status(404).json({message:"User already exist"})
    }

}else{
    return res.status(404).json({message:"Username or password "})
}
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  
  return res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author =req.params.author
  const authorfilter =Object.values(books).filter((book)=>{
    return book.author ===author
  })
  if(authorfilter.length>0)
  return res.send(authorfilter)
else
  return res.status(404).json({message: "No author with this name found"})
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title =req.params.title
  const titlefilter =Object.values(books).filter((book)=>{
    return book.title === title
  })
  if(titlefilter.length>0)
  return res.send(titlefilter)
else
  return res.status(404).json({message: "No book with this title found"})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn =req.params.isbn;
    return res.send(books[isbn].reviews)
  
});

module.exports.general = public_users;
