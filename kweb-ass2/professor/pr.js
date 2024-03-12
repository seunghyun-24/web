var express = require('express');
var router = express.Router();

var template = require('./template3.js');
var db = require('./db.js');


router.get('/select', function (req, res) {
  var title = '교수 권한 접속';
  var html = template.HTML(title,`
          <h2>${req.session.name} 교수</h2>
          <form action="/professor/lecture_control" method="get">
          <p><input class="btn" type="submit" value="강의 관리"></p>
          </form>
          <form action="/professor/write" method="post">
          <p><input class="btn" type="submit" value="강의 게시물 작성"></p>
          </form>

      `, '');
  res.send(html);
});

router.get('/lecture_control', function (request, response) {
  var professorName = request.session.name;
  db.query('SELECT * FROM courses WHERE profname = ?', [professorName], function(error, results, fields) {
      if (error) throw error;
      response.render('lecture_control.ejs', { courses: results, info : request.session });
  });
  
  
});

router.get('/make_lecture', function(req, response) {
  var title = '강의 개설';
  var name = req.session.name;
  var html = template.HTML(title, `
  <h2>강의 개설</h2>
  <form action="/professor/make" method="post">
  <p><input class="login" type="text" name="lecname" placeholder="강의명"></p>
  <p><input class="login" type="int" name="total" placeholder="최대 인원"></p>
  <input type="hidden" name="name" value="${name}">
  <p><input class="btn" type="submit" value="제출"></p>
  </form>            
  `, '');
  response.send(html);
});

router.post('/make', function(request, response) {    
  var lecname = request.body.lecname;
  var total = request.body.total;
  var name = request.body.name;

  if (lecname && total && name) {
      db.query('SELECT * FROM courses WHERE lecname = ? AND profname = ?', [lecname, name], function(error, results, fields) {
          if (error) throw error;
          
          if (results.length > 0) {     
              var errorMessage = '이미 만든 강의입니다';
              response.send(`<script type="text/javascript">alert("${errorMessage}"); 
              document.location.href="/professor";</script>`);
          } 
          else {                                                  
            db.query('INSERT INTO courses (lecname, profname, total) VALUES(?,?,?)', [lecname, name, total], function (error, data) {
                if (error) throw error;
                  response.send(`<script type="text/javascript">alert("강의 등록이 완료되었습니다!");
                  document.location.href="/";</script>`);
                });
            }            
          });
  } 
  else {        
      response.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
      document.location.href="/";</script>`);
  }
});


router.post('/write', function (req, res) {
  var name = req.session.name;
  
  db.query('SELECT * FROM courses WHERE profname = ?', [name], function(error, results, fields) {
    if (error) throw error;
    else {
      res.render('p_course_list', { courses: results, info : req.session });
    }
  });
});

router.post('/writing', function(request, response) {    
  var title = '게시글 작성';
  var course_id = request.body.course_id;
  var lecname = request.body.lecname;
  var profname = request.body.profname;

  var html = template.HTML(title, `
  <h2>게시글 작성</h2>
  <form action="/professor/write_enter" method="post">
  <input type="hidden" name="course_id" value="${course_id}">
  <input type="hidden" name="lecname" value="${lecname}">
  <input type="hidden" name="profname" value="${profname}">
  <p><textarea name="content" placeholder="내용"></textarea></p>
  <p><input class="btn" type="submit" value="제출"></p>
  </form>            
  `, '');
  response.send(html);
});

router.post('/write_enter', function(request, response) {
  var course_id = request.body.course_id;
  var lecname = request.body.lecname;
  var profname = request.body.profname;
  var content = request.body.content;

  if (lecname && course_id && profname && content) {                                            
    db.query('INSERT INTO Notes (course_id, lecture_name, professor_name, content) VALUES(?,?,?, ?)', [course_id, lecname, profname, content], function (error, data) {
        if (error) throw error;
        response.send(`<script type="text/javascript">alert("게시글 등록이 완료되었습니다!");
        document.location.href="/professor/select";</script>`);
    });
  }            
  else {        
      response.send(`<script type="text/javascript">alert("오류 발생"); 
      document.location.href="/professor/select";</script>`);
  }
});

module.exports = router;