var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

var template = require('./template.js');
var db = require('./db');

// 로그인 화면
router.get('/login', function (request, response) {
    var title = '로그인';
    var html = template.HTML(title,`
            <h2>로그인</h2>
            <form action="/auth/login_process" method="post">
            <p><input class="login" type="text" name="id" placeholder="아이디"></p>
            <p><input class="login" type="password" name="password" placeholder="비밀번호"></p>
            <p><input class="btn" type="submit" value="로그인"></p>
            </form>            
            <p>계정이 없으신가요?  <a href="/auth/register">회원가입</a></p> 
        `, '');
    response.send(html);
});


router.post('/login_process', function (request, response) {
    var id = request.body.id;
    var password = request.body.password;
    if (id && password) {            

        db.query('SELECT * FROM user WHERE id = ?', [id], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
                const hashedPassword = results[0].password; // 데이터베이스에서 저장된 해싱된 비밀번호를 가져옴
                bcrypt.compare(password, hashedPassword, function(err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        request.session.is_logined = true;      // 세션 정보 갱신
                        request.session.nickname = id;
                        request.session.name = results[0].name;
                        request.session.student_id = results[0].student_id;
                        request.session.is_faculty = results[0].is_faculty; // 교수자 여부를 세션에 저장
                        request.session.save(function () {
                            response.redirect(`/`);
                        });
                    } else {
                        response.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); 
                        document.location.href="/auth/login";</script>`);    
                    }
                });
            } else {              
                response.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); 
                document.location.href="/auth/login";</script>`);    
            }            
        });

    } else {
        response.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요!"); 
        document.location.href="/auth/login";</script>`);    
    }
});


// 로그아웃
router.get('/logout', function (request, response) {
    request.session.destroy(function (err) {
        response.redirect('/');
    });
});


// 회원가입 화면
router.get('/register', function(request, response) {
    var title = '회원가입';    
    var html = template.HTML(title, `
    <h2>회원가입</h2>
    <form action="/auth/register_process" method="post">
    <p><input class="login" type="text" name="id" placeholder="아이디"></p>
    <p><input class="login" type="password" name="password" placeholder="비밀번호"></p>    
    <p><input class="login" type="password" name="password2" placeholder="비밀번호 재확인"></p>
    <p><input class="login" type="text" name="name" placeholder="이름"></p>
    <p><input class="login" type="text" name="student_id" placeholder="학번"></p>
    <p><input class="checkmark" type="checkbox" name="is_faculty"> 교수자 여부</p>
    <p><input class="btn" type="submit" value="제출"></p>
    </form>            
    <p><a href="/auth/login">로그인화면으로 돌아가기</a></p>
    `, '');
    response.send(html);
});


// 회원가입 프로세스
router.post('/register_process', function(request, response) {    
    var id = request.body.id;
    var password = request.body.password;
    var name = request.body.name;
    var studentId = request.body.student_id;
    var isFaculty = request.body.is_faculty === 'on' ? true : false; // 교수자 여부를 체크하면 'on'으로 전송됩니다.

    if (id && password && name && studentId) {
        // 비밀번호 해싱
        bcrypt.hash(password, 10, function(err, hash) {
            if (err) throw err;
            // DB에 같은 아이디의 사용자가 있는지 확인
            db.query('SELECT * FROM user WHERE id = ? OR student_id = ?', [id, studentId], function(error, results, fields) {
                if (error) throw error;
                if (results.length > 0) {     
                    // 이미 같은 아이디 또는 학번의 사용자가 있는 경우
                    var duplicateUser = results.find(user => user.id === id || user.student_id === studentId);
                    var errorMessage = duplicateUser.id === id ? '이미 존재하는 아이디입니다.' : '이미 가입된 학번입니다.';
                    response.send(`<script type="text/javascript">alert("${errorMessage}"); 
                    document.location.href="/auth/register";</script>`);
                } else {                                                  
                    // DB에 같은 아이디와 학번을 가진 사용자가 없는 경우
                    db.query('INSERT INTO user (id, password, name, student_id, is_faculty) VALUES(?,?,?,?,?)', [id, hash, name, studentId, isFaculty], function (error, data) {
                        if (error) throw error;
                        response.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
                        document.location.href="/";</script>`);
                    });
                }            
            });
        });
    } else {        
        // 입력되지 않은 정보가 있는 경우
        response.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/auth/register";</script>`);
    }
});



module.exports = router;