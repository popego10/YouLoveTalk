const express = require('express');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

/* GET home page. */////요기 체크 
router.get('/', function(req, res, next) {
	Room.find({})
	.then((Room)=>{
		res.render('main', {rooms, title:'채팅방', error : req.flash('roomError')});
	}).catch((err)=>{
		console.error(err);
		next(err);
	});
});


/*router.get('/', async (req, res, next) =>{
	try{
		const rooms = await Room.find({});
		res.render('main', {rooms, title:'채팅창', error:req.flash('roomError')});
	}catch(error){
		console.error(error);
		next(error);
	}
});*/

/*router.get('/room', (req, res)=>{
	res.render('room',{title:'채팅방 생성'});
});
router.post('/room', function(req,res,next){
	Room.find({})
	.then((Room)=>{
		const room = new Room({
			title:req.body.title,
			max:req.body.max,
			owner:req.session.color,
			password:req.body.password,
		});
		const newRoom = room.save();
		const io = req.app.get('io');
		io.of('/room').emit('newRoom', newRoom);
		res.redirect('/room/${newRoom._id}?password=${req.body.password}');
	}).catch((error)=>{
		console.error(error);
		next(error);
	});
	
	router.get('/room/:id', function(req,res,next){
		Room.find({})
		.then((Room)=>{
			const room = 
		})
	})
});*/


module.exports = router;
