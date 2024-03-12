module.exports = {
  HTML: function (title, body, authStatusUI) {
    return `
    <!doctype html>
    <html>
    <head>    
      <title>Login TEST - ${title}</title>
      <meta charset="utf-8">
      
      <style>
        @import url(http://fonts.googleapis.com/earlyaccess/notosanskr.css);

        body {
            font-family: 'Noto Sans KR', sans-serif;
            background-color: #CCDBFD;
            margin: 50px;
        }

        .background {
            background-color: white;
            height: auto;
            width: 90%;
            max-width: 450px;
            padding: 10px;
            margin: 0 auto;
            border-radius: 5px;
            box-shadow: 0px 40px 30px -20px rgba(0, 0, 0, 0.3);
            text-align: center;
        }

        form {
            display: flex;
            padding: 30px;
            flex-direction: column;
        }

        .login {
            border: none;
            border-bottom: 2px solid #abc4ff
            background: none;
            padding: 10px;
            font-weight: 700;
            transition: .2s;
            width: 75%;
        }
        .login:active,
        .login:focus,
        .login:hover {
            outline: none;
            border-bottom-color: #9fbefc;
        }

        .btn {            
            border: none;
            width: 75%;
            background-color: #abc4ff;
            color: white;
            padding: 15px 0;
            font-weight: 600;
            border-radius: 5px;
            cursor: pointer;
            transition: .2s;
        }
        .btn:hover {
            background-color: #9fbefc;
        }


        .checkmark {
          width: 15px; /* 체크박스 너비 */
          height: 15px; /* 체크박스 높이 */
          cursor: pointer; /* 마우스 커서를 포인터로 변경하여 클릭 가능함을 나타냄 */
          vertical-align: middle; /* 텍스트와 수직 정렬 */
          margin-right: 5px; /* 체크박스와 텍스트 사이의 간격 지정 */
          font-weight: 600;
        }
    
        .checkmark::before {
          content: ""; /* 가상 요소를 사용하여 체크박스 모양 생성 */
          display: inline-block; /* 요소를 인라인 블록으로 표시 */
          width: 15px; /* 너비 */
          height: 15px; /* 높이 */
          border: 2px solid #abc4ff; /* 테두리 선 스타일 */
          border-radius: 3px; /* 테두리 선의 모서리를 둥글게 만듦 */
          transition: background-color 0.2s; /* 배경 색상 전환 효과 지정 */
          background-color: white;
        }
    
        .checkmark:checked::before {
          background-color: #abc4ff; /* 체크된 경우의 배경 색상 지정 */
        }


    </style>

    </head>

    <body>
      <div class="background">
        ${authStatusUI}
        ${body}
      </div>
    </body>

    </html>
    `;
  }
}