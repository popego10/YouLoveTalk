/**
 * http://usejsdoc.org/
 */
const mongoose = require('mongoose');

const {Schema} = mongoose;
const userSchema = new Schema({
	name:{
		type:String,
		required:true,
		unique:true
	},
	age:{
		type:Number,
		required:true
	},
	married:{
		type:Boolean,
		required:true
	},
	comment:String,
	createdAt:{
		type:Date,
		default:Date.now,
	}
});
//schema와 몽고디비 컬렉션을 연결
module.exports = mongoose.model('User', userSchema);