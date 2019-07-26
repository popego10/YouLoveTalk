const express = require('express');
const JSAlert = require('js-alert');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');
const SessionInfo = require('../schemas/sessionInfo');

const router = express.Router();

//채팅방 목록 띄우는 라우터(메인)
router.get('/', async (req, res, next) =>{
	try{
		//sessionInfo schema 생성하여 mongodb에 저장하고 사용
		// const sessionInfo = new SessionInfo({
		// 	user : req.param('nickname'),
		// 	profile : req.param('profile')
		// });
		// req.session.nickname = sessionInfo.user;
		// req.session.profile = sessionInfo.profile;
		// sessionInfo.save();
		const rooms = await Room.find({});
		req.session.save(function(){
			req.session.nickname = req.param('nickname');
			req.session.profile = req.param('profile');
			console.log('nickname + '+ req.session.nickname);
			res.render('main', {rooms, title:'채팅창', error:req.flash('roomError')});
		});
		//res.render('main', {rooms, title:'채팅창', error:req.flash('roomError')});
	}catch(error){
		console.error(error);
		next(error);
	}
});
//채팅방 목록 검색 기능 라우터
router.get('/search', async(req, res, next)=>{
	console.log('router 실행')
	try {
	const query = req.query.title;
	//검색어 미입력시 메인화면
	if(!query){
		return res.redirect('/');
	}
		const title = await title.find({where : {title:query}});
		let Room = [];
		
		return res.render('main', {
			title: `${query}`,
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//채팅방 목록 검색 기능 라우터
// function createSearch(query) {
// 	var findPost = {};
// 	if(query.searchKeyword && query.searchKeyword.length >= 2){
// 		var postQuery = [];
// 		postQuery.push({title : {$regax : new RegExp(query.searchKeyword, 'i')}});
// 		postQuery.push({owner : {$regax : new RegExp(query.searchKeyword, 'i')}});
// 	}
// 	return {searchKeyword : query.searchKeyword};
// }
// router.post('/', async (req, res, next)=>{
// 	//검색어(form에서 post방식으로 키워드 입력)
// 	try {
// 		var search = createSearch(req.query);
		
// 		const searchAll = await Room.find().where('title').in(['title', search])
// 		// const searchTitle = await Room.find({'title': searchKeyword});
// 		// const searchOwner = await Room.find({'owner': searchKeyword});
		
// 		//쿼리 날리기
// 		// Room.find().where('title').in(['title', '']);//room에서 title이 ~~인거
// 		// Room.find().where('owner').in(['owner', '']);//room에서 owner가 ~~인거
		
		
// 	} catch (error) {
// 		console.error(error);
// 		next();
// 	}
// });

//채팅방 생성 라우터(get)
// router.get('/room', (req, res) => {
// 	var nickname = req.param('nickname');
// 	console.log('nickname='+nickname);
// 	var profile = req.param('profile');
// 	console.log('profile='+profile);
// 	res.render('room', {title:'채팅방 생성'});
// });

//채팅방 생성 라우터(post)+titleImg 저장하는 공간 생성
fs.readdir('titleImg', (error)=>{
	if(error){
		console.error('저장경로가 없음으로 폴더 생성');
		fs.mkdirSync('titleImg');//==>파일 저장경로 생성하는 메서드(titleImg)
	}
});
const titleImg = multer({
	storage : multer.diskStorage({
		//저장할 폴더
		destination(req, file, callback){
			callback(null, 'titleImg/');
		},
		//저장하는 파일명
		filename(req, file, callback){
			const extension = path.extname(file.originalname);
			callback(null, path.basename(file.originalname, extension) + '_' + new Date().valueOf() + extension);
		},
	}),
	limits : {fileSize : 512*512},
});
router.post('/room', titleImg.single('titleImg'), async(req, res, next) => {
	console.log("/room 모달");
	try{
		const room = new Room({
			title: req.body.title, //채팅방제목
			max: req.body.max, //채팅방 인원
			owner: req.session.nickname,//채팅 방장
			password: req.body.password, //채팅방 비밀번호
			titleImg: req.file.filename,//채팅방 메인 이미지
		});
		//console.log(req.file);
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
	//console.log("session : "+req.session.nickname);  // 찾질못함 nickName 을 
	//console.log("cookie : "+res.cookies.nickname);  // 찾질못함 nickName 을 
	const chats = await Chat.find({room: room._id}).sort('createdAt');//==============>기존 채팅 불러오면서 생성 순서별로 정렬
	return res.render('chat', {
			room,
			title: room.title,
			chats,
			number: (rooms&&rooms[req.params.id]&&rooms[req.params.id].length+1)||1,//==>채팅인원수 표현
			user: req.session.nickname,
			//profile: req.session.profile,
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
// 	setTimeout(()=>{
// 	req.app.get('io').of('/room').emit('removeRoom', req.params.id);
// 	}, 2000);
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
			user: req.session.nickname,
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
			user: req.session.nickname,
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

//채팅내용 백업을 위한 라우터 설정(임시)
// var path = 'C:\Users\user\Desktop\backup';
// var data = 'Hello world!';

// fs.writeFile(path, data, 'utf8', function(error, data){
// 	if(error){
// 		console.log('파일 백업 에러');
// 	}
// });
// router.post('/room/:id/backup', async(req, res, next)=>{
// 	try{
		
// 	}catch(error){
// 		console.error(error);
// 		next();
// 	}
// })

module.exports = router;
