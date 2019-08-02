/**
 * http://usejsdoc.org/
 */
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;
const chatSchema = new Schema({
	room : {
		type : ObjectId,
		required : true,
		ref : 'Room',
	},//채팅방 아이디
	user : {
		type : String,
		//required : true,
	},//채팅유저
	chat : String, // 채팅내역
	gif : String, // 이미지 주소
	createdAt : String,// 생성시간
	profile: String,//프로필 
	mp4 : String,//동영상
});
module.exports = mongoose.model('Chat', chatSchema);