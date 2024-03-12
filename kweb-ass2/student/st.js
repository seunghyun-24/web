var express = require('express');
var router = express.Router();

var template2 = require('./template2.js');
var db = require('./db');


router.get('/select', function (req, res) {
  var title = '학생 권한 접속';
  var html = template2.HTML(title,`
          <h2>${req.session.nickname} 학생</h2>
          <form action="/student/sugang_preprocess" method="get">
          <p><input class="btn" type="submit" value="강의 수강 신청"></p>
          </form>
          <form action="/student/see" method="post">
          <p><input class="btn" type="submit" value="강의 게시물 열람"></p>
          </form>
          <form action="/student/update" method="post">
          <p><input class="btn" type="submit" value="강의 게시물 업데이트 확인"></p>
          </form>
      `, '');
  res.send(html);
});

router.get('/sugang_preprocess', function (request, response) {
  db.query('SELECT * FROM courses', function(error, results, fields) {
      if (error) throw error;
      response.render('sugang.ejs', { courses: results, info : request.session });
  });
  
  
});

// 수강신청 프로세스 처리 라우트
router.post('/sugang_process', function (request, response) {

  var studentId = request.body.student_id;
  var courseId = request.body.course_id;

  // 학번과 과목 ID를 사용하여 해당 과목에 대한 수강신청 처리
  db.query('SELECT * FROM course_enrollment WHERE student_id = ? AND course_id = ?', [studentId, courseId], function(error, results, fields) {
      if (error) throw error;

      if (results.length > 0) {
          response.send(`<script type="text/javascript">alert("이미 수강신청한 과목입니다."); 
          document.location.href="/student/select";</script>`);
      } 
      else {
          db.query('SELECT * FROM course_enrollment WHERE course_id = ?', [courseId], function(err, regResults, regFields) {
            if (err) throw err; // 수강신청 인원에 학번이 겹치는 사람이 없으면 수강신청 성공
            db.query('INSERT INTO course_enrollment (student_id, course_id) VALUES (?, ?)', [studentId, courseId], function (err, data) {
              if (err) throw err;
                response.send(`<script type="text/javascript">alert("수강신청이 완료되었습니다!");
                document.location.href="/student/select";</script>`);
              });
        });
      }
  });
  
});

router.post('/see', function (req, res) {
  var studentId = req.session.student_id; // 세션에서 학생 ID 가져오기

  var sqlQuery = `
    SELECT ce.course_id, c.lecname, c.profname, c.total
    FROM course_enrollment ce
    INNER JOIN courses c ON ce.course_id = c.id
    WHERE ce.student_id = ?;
  `;

  // 학생 ID를 사용하여 해당 학생이 수강하는 강의 정보를 가져옴
  db.query(sqlQuery, [studentId], function (error, results, fields) {
    if (error) throw error;
    else {
      if (results.length === 0) {
        res.send('수강 중인 강의가 없습니다. <a href="/student/select">돌아가기</a>');
      }
      else res.render('course_list', { courses: results, info : req.session });
    }
  });
});


router.post('/see_lecture', function (req, res) {

  var courseId = req.body.course_id;
  // info 귀찮아서 안씀

  var query = 'SELECT * FROM Notes WHERE course_id = ?';

  db.query(query, [courseId], function (error, results, fields) {
    if (error) throw error;
    else {
      if (results.length === 0) {
        res.send('게시글이 없습니다. <a href="/student/select">돌아가기</a>');
      }
      else res.render('course', { texts : results, course_id : courseId});
    }
  });
  
});


router.post('/lecture', function (req, res) {
  
  var noteId = req.body.note_id;
  var query = 'SELECT * FROM Notes WHERE note_id = ?';

  db.query(query, [noteId], function (error, result, fields) {
    if (error) throw error;
    else {
      res.render('view_text', { texts : result });
    }
  });

});


router.post('/update', function (req, res) {
  var studentId = req.session.student_id; // 세션에서 학생 ID 가져오기

  var sqlQuery = `
    SELECT ce.course_id, c.lecname, c.profname, c.total
    FROM course_enrollment ce
    INNER JOIN courses c ON ce.course_id = c.id
    WHERE ce.student_id = ?;
  `;

  // 학생 ID를 사용하여 해당 학생이 수강하는 강의 정보를 가져옴
  db.query(sqlQuery, [studentId], function (error, results, fields) {
    if (error) throw error;
    else {
      if (results.length === 0) {
        res.send('수강 중인 강의가 없어, 업데이트 된 게시글이 없습니다. <a href="/student/select">돌아가기</a>');
      }
      else {
        // 모든 쿼리를 Promise 배열로 만듭니다.
        const queryPromises = results.map(course => {
          return new Promise((resolve, reject) => {
            var noteQuery = `
              SELECT *
              FROM Notes
              WHERE course_id = ?
              ORDER BY note_id DESC;
            `;
            db.query(noteQuery, [course.course_id], function(error, notes, fields) {
              if (error) reject(error);
              else resolve(notes);
            });
          });
        });

        // 모든 쿼리가 완료되면 결과를 렌더링합니다.
        Promise.all(queryPromises)
          .then(notesArray => {
            const mergedNotes = notesArray.flat(); // 배열을 평탄화합니다.
            mergedNotes.sort((a, b) => b.note_id - a.note_id);
            res.render('update_list', { notes: mergedNotes });
          })
          .catch(error => {
            throw error;
          });
      }
    }
  });
});


module.exports = router;