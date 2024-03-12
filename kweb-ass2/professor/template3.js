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