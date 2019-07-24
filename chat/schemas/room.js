/**
 * http://usejsdoc.org/
 */
const mongoose = require('mongoose');

var today = new Date();
today.setHours(today.getHours());

//var titleImg = 
//console.log(today);
// var today = new Date();
// today=today.toLocaleString();
// console.log(today);

const {Schema} = mongoose;
const roomSchema = new Schema({
	title : {
		type : String,
		required : true,
	},//채팅방 제목
	max : {
		type : Number,
		required : true,
		default : 5,
		min : 1, // ==> 최소인원 1 ~ 최대 5명
	},//최대 수용 인원
	owner : {
		type : String,
		//required : true,
	},//방장
	password : {
		type : String,
	},//비밀번호(공개/비공개)
	createdAt : {
		type : Date,
		default : today,
	},//생성시간
	titleImg : {
		type : String,
		//default : "http://192.168.0.13:8080//resources/images/youlovetalk_logo.png",
	},
	// titleImg : {
	// 	data: Buffer, 
	// 	contentType: String
	// },
});
module.exports = mongoose.model('Room', roomSchema);