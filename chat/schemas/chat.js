/**
 * http://usejsdoc.org/
 */
const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types : {ObjectId}} = Schema;
const chatSchema = new Schema({
	room : {
		type : ObjectId,
		required : true,
		ref : 'room',
	},//채팅방 아이디
	user : {
		type : String,
		required : true,
	},//채팅유저
	chat : String, // 채팅내역
	gif : String, // 이미지 주소
	createdAt : {
		type : Date,
		default : Date.now,
	},// 생성시간
});
module.exports = mongoose.model('chat', chatSchema);