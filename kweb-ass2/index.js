const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const FileStore = require('session-file-store')(session)

var authRouter = require('./lib_login/auth');
var authCheck = require('./lib_login/authCheck.js');
var template = require('./lib_login/template.js');

var stRouter = require('./student/st');
var prRouter = require('./professor/pr');

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'chk',	// 원하는 문자 입력
  resave: false,
  saveUninitialized: true,
  store:new FileStore(),
}))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  if (!authCheck.isOwner(req, res)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.redirect('/auth/login');
    return false;
  } else {                                      // 로그인 되어있으면 메인 페이지로 이동시킴
    res.redirect('/index');
    return false;
  }
})
app.use('/auth', authRouter);

app.get('/student', (req, res) => {
  if (!authCheck.isOwner(req, res)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.redirect('/auth/login');
    return false;
  } 
  else {
    if (!authCheck.isFaculty(req, res)){
      res.redirect('/student/select');
      return false;
    }                                   // 로그인 되어있으면 메인 페이지로 이동시킴
    else{
      // res.redirect('/index');
      return false;
    }
  }
})
app.use('/student', stRouter);
// app.use('/professor', prRouter);

app.get('/professor', (req, res) => {
  if (!authCheck.isOwner(req, res)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.redirect('/auth/login');
    return false;
  } 
  else {
    if (authCheck.isFaculty(req, res)){
      res.redirect('/professor/select');
      return false;
    }                                   // 로그인 되어있으면 메인 페이지로 이동시킴
    else{
      // res.redirect('/index');
      return false;
    }
  }
})
app.use('/professor', prRouter);

// 메인 페이지
app.get('/index', (req, res) => {
  if (!authCheck.isOwner(req, res)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.redirect('/auth/login');
    return false;
  }

  if (!authCheck.isFaculty(req, res)) {
    res.redirect('/student'); // 학생 페이지로 이동
    return false;
  } else {
    res.redirect('/professor'); // 교수 페이지로 이동
    return false;
  }
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})