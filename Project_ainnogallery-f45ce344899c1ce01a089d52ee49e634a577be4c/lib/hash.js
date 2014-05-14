var common = require('./common')
var crypto = require('crypto');

/*
	makeUserHashByEmail(email, date)
	: 이메일 주소로 user의 hash값을 생성하는 함수

	- email : 사용자의 이메일 주소
	- date : 날짜(따로 입력 안 하면 현재 시간을 기본으로 입력. 단, '2014-01-09 22:21:07'의 형식을 유지해야 함. new Date()와 같은 자바스크립트의 시간 생성 함수를 '2014-01-09 22:21:07'와 같은 형식으로 바꾸어주는 함수인 common 라이브러리 파일(/lib/common.js)에 있는 getDateTimeForDBFromDate 함수를 이용해도 됨.)
	
	예)
		makeUserHashByEmail('test1@test.com')
		makeUserHashByEmail('test1@test.com', '2019.12.31 14:33:51')
*/
exports.makeUserHashByEmail = function(email, date) {
	var date = date || new Date(common.getDateTimeForDBFromDate(new Date()));
	return crypto.createHash('sha1')
					.update('user')
					.update(date)
					.update(email)
					.digest('hex');
};

/*
	makeExhibitionHashByTitle(title, date)
	: 전시 제목으로 exhibition의 hash값을 생성하는 함수

	- title : 전시 제목
	- date : 날짜(따로 입력 안 하면 현재 시간을 기본으로 입력. 단, '2014-01-09 22:21:07'의 형식을 유지해야 함. new Date()와 같은 자바스크립트의 시간 생성 함수를 '2014-01-09 22:21:07'와 같은 형식으로 바꾸어주는 함수인 common 라이브러리 파일(/lib/common.js)에 있는 getDateTimeForDBFromDate 함수를 이용해도 됨.)
	
	예)
		makeExhibitionHashByTitle('살바도르 달리 전시회')
		makeExhibitionHashByTitle('살바도르 달리 전시회', '2019.12.31 14:33:51')
*/
exports.makeExhibitionHashByTitle = function(title, date) {
	var date = date || new Date(common.getDateTimeForDBFromDate(new Date()));
	return crypto.createHash('sha1')
					.update('exhibition')
					.update(date)
					.update(title)
					.digest('hex');
}

/*
	makeWorkHashByTitle(title, date)
	: 작품 제목으로 work의 hash값을 생성하는 함수

	- title : 작품 제목
	- date : 날짜(따로 입력 안 하면 현재 시간을 기본으로 입력. 단, '2014-01-09 22:21:07'의 형식을 유지해야 함. new Date()와 같은 자바스크립트의 시간 생성 함수를 '2014-01-09 22:21:07'와 같은 형식으로 바꾸어주는 함수인 common 라이브러리 파일(/lib/common.js)에 있는 getDateTimeForDBFromDate 함수를 이용해도 됨.)
	
	예)
		makeWorkHashByTitle('별이 빛나는 밤')
		makeWorkHashByTitle('별이 빛나는 밤', '2019.12.31 14:33:51')
*/
exports.makeWorkHashByTitle = function(title, date) {
	var date = date || new Date(common.getDateTimeForDBFromDate(new Date()));
	return crypto.createHash('sha1')
					.update('work')
					.update(date.toString())
					.update(title)
					.digest('hex');
}

/*
	makeWorkReplyHashByWorkHash(work_hash, date)
	: work의 hash값으로 work_reply의 hash값을 생성하는 함수

	- work_hash : work의 hash
	- date : 날짜(따로 입력 안 하면 현재 시간을 기본으로 입력. 단, '2014-01-09 22:21:07'의 형식을 유지해야 함. new Date()와 같은 자바스크립트의 시간 생성 함수를 '2014-01-09 22:21:07'와 같은 형식으로 바꾸어주는 함수인 common 라이브러리 파일(/lib/common.js)에 있는 getDateTimeForDBFromDate 함수를 이용해도 됨.)
	
	예)
		makeWorkReplyHashByWorkHash('f87dsa78f6d89f5s8d5f9')
		makeWorkReplyHashByWorkHash('f87dsa78f6d89f5s8d5f9', '2019.12.31 14:33:51')
*/
exports.makeWorkReplyHashByWorkHash = function(work_hash, date) {
	console.log("work_hash : " + work_hash + " (" + typeof(work_hash) + ")")
	var date = date || new Date(common.getDateTimeForDBFromDate(new Date()));
	return crypto.createHash('sha1')
					.update('work_reply')
					.update(date)
					.update(work_hash)
					.digest('hex');
};

/*
	makeWorkFileNamesByHash(work_hash, type)
	: work의 hash값으로 작품의 파일명을 생성하는 함수

	- work_hash : work의 hash
	- type : 입력 안 하면 모든 유형이 Object로 반환되고, 입력하면 그 형태의 파일명만 생성된다. 가능한 입력값은 'raw', 'preview', 'thumb'이다.
	
	예)
		makeWorkFileNamesByHash('f87dsa78f6d89f5s8d5f9')
		makeWorkFileNamesByHash('f87dsa78f6d89f5s8d5f9', 'raw')
		makeWorkFileNamesByHash('f87dsa78f6d89f5s8d5f9', 'preview')
		makeWorkFileNamesByHash('f87dsa78f6d89f5s8d5f9', 'thumb')
*/
exports.makeWorkFileNamesByHash = function(work_hash, type) {
	var type = type || null;
	var types = ['raw', 'preview', 'thumb'];
	var salt = "WeAreAurumPlanet";
	var result;

	if (type != null)
	{
		result = crypto.createHash('sha1')
							.update(type)
							.update(work_hash)
							.update(salt)
							.digest('hex');
	}
	else
	{
		result = {};
		for (var the_type in types)
		{
			result[types[the_type]] = crypto.createHash('sha1')
												.update(types[the_type])
												.update(work_hash)
												.update(salt)
												.digest('hex');
		}
	}
	
	return result;
};