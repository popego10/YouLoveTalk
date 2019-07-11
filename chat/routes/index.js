const express = require('express');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

/* GET home page. */////요기 체크 
// router.get('/', function(req, res, next) {
// 	Room.find({})
// 	.then((Room)=>{
// 		res.render('main', {rooms, title:'채팅방', error : req.flash('roomError')});
// 	}).catch((err)=>{
// 		console.error(err);
// 		next(err);
// 	});
// });


router.get('/', async (req, res, next) =>{
	try{
		const rooms = await Room.find({});
		res.render('main', {rooms, title:'채팅창', error:req.flash('roomError')});
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/room', (req, res) => {
	res.render('room', {title:'채팅방 생성'});
});
//채팅방 생성 라우터
router.post('/room', async(req, res, next) => {
	try{
		const room = new Room({
			title: req.body.title, //채팅방제목
			max: req.body.max, //채팅방 인원
			owner: req.session.color, //채팅방장
			password: req.body.password, //채팅방 비밀번호
		});
		const newRoom = await room.save();
		const io = req.app.get('io');
		io.of('/room').emit('newRoom', newRoom);
		res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
	}catch(error){
		console.error(error);
		next(error);
	}
});

//채팅방 랜더링
router.get('/room/:id', async(req, res, next)=>{
	try{
		const room = await Room.findOne({_id: req.params.id});
    const io = req.app.get('io');
    if(!room){
      req.flash('roomError', '없는 방입니다.');
      return res.redirect('/');
    }
		if(room.password && room.password !=req.query.password){
			req.flash('roomError', 'PW가 틀렸습니다.');
			return res.redirect('/');
    }
    const {rooms} = io.of('/chat').adapter;
    if(rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length){
      req.flash('roomError', '인원 초과');
			return res.redirect('/');
    }
		const chats = await Chat.find({room: room._id}).sort('createdAt');//==============>기존 채팅 불러오면서 생성 순서별로 정렬
		return res.render('chat', {
			room,
			title: room.title,
			chats,
			user: req.session.color,
		});
	}catch(error){
		console.error(error);
		return next(error);
	}
});

//채팅방 나가기, 삭제
router.delete('/room/:id', async(req,res,next)=>{
	try{
		await Room.remove({_id:req.params.id});
		await Chat.remove({room:req.params.id});
		res.send('ok');
	}catch(error){
		console.error(error);
		next(error);
	}
});

//채팅 라우터 설정
router.post('/room/:id/chat', async (req, res, next) => {
	try{
		const chat = new Chat({
			room: req.params.id,
			user: req.session.color,
			chat: req.body.chat,
		});
		await chat.save();
		req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
		res.send('ok');
	}catch(error){
		console.error(error);
		next(error);
	}
});
module.exports = router;
