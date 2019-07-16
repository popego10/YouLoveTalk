const express = require('express');
const JSAlert = require('js-alert');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
		if(!room.password){
			JSAlert.alert("공개방 생성");
		}else{
			JSAlert.alert("비공개방 생성");
		}
		const newRoom = await room.save();
		const io = req.app.get('io');
		io.of('/room').emit('newRoom', newRoom);
		res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
	}catch(error){
		console.error(error);
		next(error);
	}
});

//채팅방 입장 라우터
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
	//console.log(rooms && rooms[req.params.id]);
	const chats = await Chat.find({room: room._id}).sort('createdAt');//==============>기존 채팅 불러오면서 생성 순서별로 정렬
	return res.render('chat', {
			room,
			title: room.title,
			chats,
			number: (rooms&&rooms[req.params.id]&&rooms[req.params.id].length+1)||1,//==>채팅인원수 표현
			user: req.session.color,
			//createdAt: chats.createdAt,
		});
	}catch(error){
		console.error(error);
		return next(error);
	}
});

//채팅방 삭제
// router.delete('/room/:id', async(req,res,next)=>{
// 	try{
// 		await Room.remove({_id:req.params.id});
// 		await Chat.remove({room:req.params.id});
// 		res.send('ok');
	// setTimeout(()=>{
	// req.app.get('io').of('/room').emit('removeRoom', req.params.id);
	// }, 2000);
// 	}catch(error){
// 		console.error(error);
// 		next(error);
// 	}
// });

//채팅 라우터 설정
router.post('/room/:id/chat', async (req, res, next) => {
	try{
		const chat = new Chat({
			room: req.params.id,
			user: req.session.color,
			chat: req.body.chat,
			createdAt: req.body.createdAt,
		});
		await chat.save();
		req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
		res.send('ok');
	}catch(error){
		console.error(error);
		next(error);
	}
});

//채팅 이미지 전송 라우터 설정
fs.readdir('uploads', (error)=>{
	if(error){
		console.error('저장경로가 없음으로 폴더 생성');
		fs.mkdirSync('uploads');//==>파일 저장경로 생성하는 메서드
	}
});
const upload = multer({
	storage : multer.diskStorage({
		destination(req, file, callback){
			callback(null, 'uploads/');
		},
		filename(req, file, callback){
			const extension = path.extname(file.originalname);
			//var basename = path.basename(file.originalname+'_'+new Date().valueOf(), extension);
			callback(null, path.basename(file.originalname, extension) + '_' + new Date().valueOf() + extension);
		},
	}),
	limits : {fileSize : 1024*1024},
});
router.post('/room/:id/gif', upload.single('gif'), async(req, res, next)=>{
	try{
		const chat = new Chat({
			room: req.params.id,
			user: req.session.color,
			gif: req.file.filename,
			createdAt: req.body.createdAt,
		});
		await chat.save();
		console.log(req.file);
		req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
		res.send('ok');
	}catch(error){
		console.error(error);
		next(error);
	}
});

module.exports = router;
