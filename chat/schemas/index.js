/**
 * http://usejsdoc.org/
 */

//몽고디비와 연결하는 schema!!!!!!!!!!!!!!!!!!!!!!!!!!!
//중요중요중요주용요요요요요죠주죵ㅇ
const mongoose = require('mongoose');

//하드코딩하면 안되는데 일단 해야지
const MONGO_URL = 'mongodb://admin:1234@localhost:27017/admin'
//const {MONGO_ID, MONGO_PASSWORD, NODE_ENV} = process.env
//const MONGO_URL = 'mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin';

module.exports =() => {
	const connect = () =>{
		
		/*if(NODE_ENV != 'production'){
			mongoose.set('debug', true);
		}//////개발환경이 아닐때. 몽구스가 생서ㅇ하는 쿼리내용 콘솔에서 확인*/
		mongoose.connect(MONGO_URL, {useNewUrlParser: true}, {
			dbName:'chat',
		}, (error) =>{
			if(error){
				console.error('몽고디비 연결에러',error);
			}else{
				console.log('몽고디비 연결 성공')
			}
		});
	};///////////////몽구스와 몽고디비를 연결 ==> chat DB를 사용
	connect();
	
	mongoose.connection.on('error', (error) =>{
		console.error('연결 에러', error);
	});
	mongoose.connection.on('disconnected', () =>{
		console.error('연결이 끊겼습니다.', error);
		connect();
	});//////////////에러 발생시 에러 내용 기록하고 접속끊길시 재접속
	require('./chat');
	require('./room');
	/////////////chat스키마와 room스키마 연결
}