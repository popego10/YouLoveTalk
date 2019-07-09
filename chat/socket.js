/**
 * http://usejsdoc.org/
 */
const socketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) =>{
	//louter에서 io객체 사용할 수 있게 
	const io = socketIO(server, {path:'/socket.io'});
	app.set('io',io);
	//.of를 이용해서 socket.io에 네임스페이스 부여
	const room = io.of('/room');
	const chat = io.of('/chat');
	//웹소켓 연결시마다 호출
	io.use((socket, next)=>{
		sessionMiddleware(socket.request, socket.request.res, next);
	});
	
	room.on('connection', (socket)=>{
		console.log('room 접속');
		socket.on('disconnect',()=>{
			console.log('room 접속 해제');
		});
	});
	
	chat.on('connection', (socket)=>{
		console.log('chat 접속');
		const req = socket.request;
		const {headers:{referer}}=req;
		const roomId = referer
			.split('/')[referer.split('/').length-1]
			.replace(/\?.+/,'');
		socket.join(roomId);
		socket.to(roomId).emit('join',{
			user:'system',
			chat:'${req.session.color}님이 입장하셨습니다.',
	});
		
		socket.on('disconnect',()=>{
			console.log('chat 접속 해제');
			socket.leave(roomId);
			const currentRoom = socket.adapter.rooms[roomId];
			const userCount = currentRoom ? currentRoom.length : 0;
			if(userCount === 0){ //userCount가 0이면 방을 제거 
				axios.delete('http://localhost:8005/room/${roomId}')
				.then(()=>{
					console.log('방 제거 요청 성공');
				})
				.catch((error)=>{
					console.error(error);
				});
			}else{
				socket.to(roomId).emit('exit', {
					user:'system',
					chat: '${req.session.color}님이 퇴장하셨습니다.'
				});
			}
		});
	});
};