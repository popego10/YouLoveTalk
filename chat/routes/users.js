var express = require('express');
var User = require('../schemas/user');

var router = express.Router();

//get 방식으로 보내기
router.get('/', function(req, res, next) {
  User.find({})
  	.then((users)=>{
	  res.json(users);
  }).catch((err)=>{
	  console.error(err);
	  next(err);
  });
});
//post방식으로 보내기
router.post('/', function(req,res,next){
	const user = new User({
		name: req.body.name,
		age: req.body.age,
		married: req.body.married,
	});
	user.save()
	.then((result)=>{
		console.log(result);
		res.status(201).json(result);
	})
	.catch((err)=>{
		console.error(err);
		next(err);
	});
});

module.exports = router;
