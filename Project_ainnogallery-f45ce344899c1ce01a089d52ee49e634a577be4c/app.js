var environment = require('./config/environment');
var common = require('./lib/common');
var hash = require('./lib/hash');
var http = require('http');
var path = require('path');
var inspect = require('util').inspect;
var querystring = require('querystring');
var express = require('express');
var expressValidator = require('express-validator');
var app = express();
var ECT = require('ect');
var ectRenderer = ECT({watch: true, root: __dirname + '/views'});
var controllers = [];
	controllers.common = require('./controllers/common')
	controllers.main = require('./controllers/main');
	controllers.user = require('./controllers/user');
	controllers.exhibition = require('./controllers/exhibition');
	controllers.work_detail = require('./controllers/work_detail');
	controllers.index = require('./controllers/index');
// 포트를 선택해서 실행할 수 있게
var does_exist_port_option = process.argv.indexOf('-port');
if (does_exist_port_option != -1) {
	var port_number = process.argv[does_exist_port_option + 1];
	if (port_number && port_number >= 50000 && port_number <= 60000) {
		app.set('port', port_number);
	} else {
		console.error('\t[Error] 안 돼. 혼 나. 50000부터 60000 중에서 쓰고 싶은 포트 번호를 입력해줘야 해.\n\tex) $node app -port 50001');
		process.exit(1);
	}
} else {
	app.set('port', process.env.PORT || 33000);
}	

// all environments
app.set('views', __dirname + '/views');
app.engine('.ect', ectRenderer.render);
app.set('view engine', 'ect');
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev')); 
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart({limit: '20mb'}));
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.') 
			, root    = namespace.shift()
			, formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg   : msg,
			value : value
		};
	}
}));
app.use(express.methodOverride());
app.use(express.cookieParser('SECRETSALTCODEOFAURUMPLANETCOLTD'));
app.use(express.session());
app.use(require('stylus').middleware(__dirname + '/statics'));
app.use(express.static(path.join(__dirname, 'statics')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
	console.log("[Info] 개발자 모드로 시작됨 (배포할 때 이거 뜨면 안 됨)");
	app.use(express.errorHandler());
}


/* 사전 예약 주소들 ***************************************/
/* 공통 */
app.post('/load_additional_works', controllers.user.loadAdditionalWorks); // 작품 목록에서 추가 로드
/**********************************************************/

/* 전시 상세보기 페이지 */
app.get('/workDetail/getWorkDetail', controllers.work_detail.getWorkDetail);
app.get('/workDetail/getSourceWorkDetailWindow', controllers.work_detail.getSourceWorkDetailWindow);
app.post('/workDetail/registerReply', controllers.work_detail.registerReply);
app.post('/workDetail/removeReply', controllers.work_detail.removeReply);
app.post('/workDetail/getReplylist', controllers.work_detail.getReplyList);
app.post('/workDetail/applyVoteReply', controllers.work_detail.applyVoteReply);
/**********************************************************/

/* 기본 페이지 관련 ***************************************/
app.get('/', controllers.index.index);// 아이노갤러리 초기화면
app.post('/loadArtists', controllers.index.loadArtists);// 아티스트 리스트
/**********************************************************/

/* 작가 관련 페이지 ***************************************/
app.get('/:user_url', controllers.user.index);						// 작가 페이지 - 초기 화면
app.get('/:user_url/works', controllers.user.works);						// 작가 페이지 - 작품 목록
app.get('/:user_url/newExhibition', controllers.user.newExhibition);
app.post('/:user_url/works', controllers.user.insertWork);		// 작가 페이지 - 작품 목록 작품 추가 
app.post('/user/exhibitionSourceLoad', controllers.user.exhibitionSourceLoad); //작가 페이지 - 전시관 ect 소스 로드
app.post('/user/exhibition', controllers.user.exhibition);// 작가 페이지 - 전시관 목록 로드
app.post('/user/profile', controllers.user.profile);// 작가 페이지 - 프로필 정보 로드
app.post('/user/profileSourceLoad', controllers.user.profileSourceLoad); //작가 페이지 - 프로필 ect 소스 로드
app.post('/user/comment', controllers.user.comment);//작가 페이지 - 댓글 추가 로드
app.post('/user/banner', controllers.user.banner);//작가 페이지 - 배너 추가 로드
app.post('/user/banner/register', controllers.user.bannerRegister);
app.post('/user/analytics', controllers.user.analytics);// 작가 페이지 - 분석 추가 로드
app.post('/user/guestbook', controllers.user.guestbook);// 작가 페이지 - 방명록 추가 로드
app.post('/user/guestbook/register', controllers.user.guestbookRegister);
app.post('/user/utilitySourceLoad', controllers.user.utilitySourceLoad); //작가 페이지 - 배너, 댓글, 분석, 방명록 ect 소스 로드
/**********************************************************/

/* 전시 관련 페이지 ***************************************/
app.get('/:user_url/:exhibition_url', controllers.exhibition.index);// 전시 페이지 - 전시 커버부터
/**********************************************************/

/* 작품 상세보기 관련 페이지 ***************************************/
app.get('/:user_url/works/:work_url', controllers.work_detail.index);// 작가 페이지 - 작품 목록 - 작품 상세보기 페이지
app.get('/:user_url/:exhibition_url/:work_url', controllers.work_detail.index);// 작가 페이지 - 작품 목록 - 작품 상세보기 페이지
// app.post('/:user_url/exhibitions/:exhibition/:work/reply/get_list', controllers.work_detail.getReplylist);// 작품 상세보기 - 댓글 가져오기
// app.post('/:user_url/exhibitions/:exhibition/:work/reply/register', controllers.work_detail.registerReply);// 작품 상세보기 - 댓글 등록하기
// app.post('/:user_url/exhibitions/:exhibition/:work/reply/modify', controllers.work_detail.modifyReply);// 작품 상세보기 - 댓글 수정하기
// app.post('/:user_url/exhibitions/:exhibition/:work/reply/remove', controllers.work_detail.removeReply);// 작품 상세보기 - 댓글 삭제하기
// app.post('/:user_url/exhibitions/:exhibition/:work/reply/apply_vote', controllers.work_detail.applyVoteReply);// 작품 상세보기 - 댓글 추천 적용하기
// app.post('/:user_url/exhibitions/:exhibition/:work/reply/cancel_vote', controllers.work_detail.cancelVoteReply);// 작품 상세보기 - 댓글 추천 취소하기
/*******************************************************************/

/*
	프로세스 관련 처리
	(참고 : http://shapeshed.com/uncaught-exceptions-in-node/)
*/
var cluster = require('cluster');
var workers = process.env.WORKERS || require('os').cpus().length;

if (cluster.isMaster)
{
	console.log('[!] %s개의 worker로 클러스터를 시작한다.', workers);

	for (var i = 0; i < workers; ++i)
	{
		var worker = cluster.fork().process;
		console.log('[!] 이름이 "%s"인 worker가 일을 시작했어.', worker.pid);
	}

	cluster.on('exit', function(worker) {
		console.log('[!} 이름이 "%s"인 worker가 죽어버렸어. 나빠. 아무래도 다시 켜야겠어.', worker.process.pid);
		cluster.fork();
	});
}
else
{
	http.createServer(app).listen(app.get('port'), function(){
		console.log('[Info] 서버가 켜졌어. 포트는 ' + app.get('port') + '번으로 열렸어');
		// console.log(hash.makeWorkHashByTitle('별이 빛나는 밤', '2013-12-27 15:01:49'));
		// console.log(hash.makeUserHashByEmail('test1@test.com', '2013-11-30 19:08:14'));
		// console.log(hash.makeExhibitionHashByTitle('gauguin', '2013-12-26 16:35:18'));
		// console.log(hash.makeWorkFileNamesByHash('f87dsa78f6d89f5s8d5f9'));
		// console.log(hash.makeWorkFileNamesByHash('f87dsa78f6d89f5s8d5f9', 'raw'));
		// console.log(hash.makeWorkFileNamesByHash('f87dsa78f6d89f5s8d5f9', 'preview'));
		// console.log(hash.makeWorkFileNamesByHash('f87dsa78f6d89f5s8d5f9', 'thumb'));
	});
}

process.on('uncaughtException', function(err) {
	console.error((new Date).toString() + ' uncaughtException:', err.message);
	console.error(err.stack);
	process.exit(1);
});