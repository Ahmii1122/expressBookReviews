const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
 const validateduser = users.filter(user =>{
    return user.username ===username && user.password === password;
 })
 if(validateduser.length > 0)
  return true;
else
return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password)
    return res.status(404).json({message: "Error logging in"});

  if(authenticatedUser(username,password)){
    let accesstoken = jwt.sign({
        data:password
    },"access",{expiresIn:60*60});
  req.session.authorization = {
    accesstoken,username
  }
  return res.status(200).send("user logged in sccesfully");
}

  else{
  return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  if(!req.session.authorization.username){
    return res.status(401).json({message:"Please login first"})
  }
  const username = req.session.authorization.username;
  const isbn = req.params.isbn
  const review = req.params.review

  const book = books[isbn];
  if(!book){
    return res.status(404).json({message:"no book found"})
  }
  const isUpdate = Object.hasOwn(book.reviews, username);
book.reviews[username] = review.trim();
return res
    .status(isUpdate ? 200 : 201)
    .json({ message: isUpdate ? "Review updated" : "Review added", reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
