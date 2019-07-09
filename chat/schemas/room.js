/**
 * http://usejsdoc.org/
 */
const mongoose = require('mongoose');

const {Schema} = mongoose;
const roomSchema = new Schema({
	title : {
		type : String,
		required : true,
	},//채팅방 제목
	max : {
		type : Number,
		required : true,
		default : 10,
		min : 1, // ==> 최소인원 1 ~ 최대 10명
	},//최대 수용 인원
	owner : {
		type : String,
		required : true,
	},//방장
	password : String,//비밀번호
	createdAt : {
		type : Date,
		default : Date.now,
	},//생성시간
});
module.exports = mongoose.model('room', roomSchema);