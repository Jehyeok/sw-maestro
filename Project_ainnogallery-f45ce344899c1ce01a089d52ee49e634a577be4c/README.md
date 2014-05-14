AinnoGallery - Alpha1
====================

서버 실행 방법
--------------------
- $ node app
- $ node app -port 50004	// 포트를 지정해서 실행하고 싶은 경우


nodemon 사용
--------------------
소스 고칠 때마다 자꾸 서버를 재실행시키기 싫으면 이렇게 'node' 대신에 'nodemon'이라는 명령어로 실행하면 됨.
1) npm install -g nodemon
2) nodemon으로 실행시킴
ex) nodemon app.js

필요한 npm
--------------------
- express
- ect : https://npmjs.org/package/ect, https://github.com/baryshev/ect
- stylus
- express-validator : https://github.com/ctavan/express-validator
- mariasql : https://github.com/mscdex/node-mariasql