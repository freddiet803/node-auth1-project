const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Users = require('./user-model.js');

// add a user
router.post('/register', (req, res) => {
  const newUser = req.body;

  if (newUser.username && newUser.password) {
    const hash = bcrypt.hashSync(newUser.password, 12);
    newUser.password = hash;

    Users.addUser(newUser)
      .then(added => {
        res.status(201).json(added);
      })
      .catch(err => {
        res
          .status(500)
          .json({ errorMessage: 'user could not be added to database' });
      });
  } else {
    res.status(400).json({ message: 'Please provide username and password' });
  }
});

// login

router.post('/login',(req,res)=>{
    const {username, password} = req.body;

    Users.findByName({username}).first().then(user=>{
        if(user && bcrypt.compareSync(password, user.password)){
            res.status(200).json({message: `Welcome ${user.username}`})
        }else{
            res.status(400).json({message: 'invalid credentials'})
        }
    }).catch(err=>{
        res.status(500).json({errorMessage: 'error getting users from database'})
    })
})

//middelware function 
function needApass(req,res,next){
    const {username, password} = req.headers;

    if(username && password){
        Users.findByName({username}).first().then(user=>{
            if(user && bcrypt.compareSync(password, user.password)){
                next();
            }else{
                res.status(400).json({message: 'invalid credentials'})
            }
        }).catch(err=>{
            res.status(500).json({message: 'error'})
        
        })
    }else{
        res.status(500).json({message: 'provide valid credentials'})
    }

}

router.get('/',needApass,(req,res)=>{
    Users.find().then(users=>{
        res.status(200).json(users);
    }).catch(err=>{
        res.status(500).json({errorMessage: "error getting users"})
    })
})

module.exports = router;
