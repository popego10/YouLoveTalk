/**
 * http://usejsdoc.org/
 */
const mongoose = require('mongoose');

const {Schema} = mongoose;
const sessionInfoSchema = new Schema({
	user : {
		type : String,
		required : true,
	},//session 유저
	profile : {
		type : String,
	},
});
module.exports = mongoose.model('SessionInfo', sessionInfoSchema);