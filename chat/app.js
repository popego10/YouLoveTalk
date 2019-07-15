/**
 * http://usejsdoc.org/
 */
//fontawesome icon 사용하기 위한 npm 설정과 import
// import { library, icon } from '@fortawesome/fontawesome-svg-core'
// import { faCamera } from '@fortawesome/free-solid-svg-icons'

// library.add(faCamera)
//const camera = icon({ prefix: 'fas', iconName: 'camera' })

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const ColorHash = require('color-hash');//아이디를 색으로 구별
const JSAlert = require('js-alert');//스크립트에서 쓰이는 alert 가능하게 해주는 node module
//require('dotenv').config({path:'chat.env'});//root경로에 생성하여 전역에서 접근가능하게
require('dotenv').config();


const webSocket = require('./socket')
const indexRouter = require('./routes');
const connect = require('./schemas');

const app = express();
connect();

//채팅방 접속자가 0명일때 방을 제거하는 코드 추가
//sessionMiddleware를 이용하여  session에 회원정보 저장
const sessionMiddleware = session({
	resave:false,
	saveUninitialized:false,
	secret: process.env.COOKIE_SECRET,
	cookie:{
		httpOnly:true,
		secure:false,
	},
});

//
app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');
app.set('port', process.env.PORT || 8005);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use('/gif', express.static(path.join(__dirname,'uploads')));//==>이미지 업로드
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);

// app.use(session({
// 	resave:false,
// 	saveUninitialized:false,
// 	secret:process.env.COOKIE_SECRET,
// 	cookie:{
// 		httpOnly:true,
// 		secure:false,
// 	},
// }));
app.use(flash());

app.use((req, res, next)=>{
	if(!req.session.color){
		const colorHash = new ColorHash();
		req.session.color = colorHash.hex(req.sessionID);
	}
	next();
});

app.use('/',indexRouter);

app.use((req, res, next) =>{
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next)=> {
	  // set locals, only providing error in development
	  res.locals.message = err.message;
	  res.locals.error = req.app.get('env') === 'development' ? err : {};

	  // render the error page
	  res.status(err.status || 500);
	  res.render('error');
	});

const server = app.listen(app.get('port'), ()=>{
	console.log(app.get('port'), '포트에서 대기 중');
});

//webSocket(server, app);
webSocket(server, app, sessionMiddleware);



