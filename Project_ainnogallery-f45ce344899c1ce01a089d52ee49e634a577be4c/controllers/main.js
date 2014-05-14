var repo = require('../models/repository');

/*
	controllers/main.js

	메인 페이지와 관련된 컨트롤러
*/

exports.root = function(req, res) {
    length = 3; // 작품 개수. 나중에 DB에서 동적으로 받아옴
	// fileName = new Array();
	// console.log(typeof(fileName));
	// fileName.push('work_01', 'work_02', 'work_03', 'work_04', 'work_05', 'work_06'
	// 	,'work_07', 'work_08', 'work_09', 'work_10', 'work_11', 'work_12', 'work_13'
	// 	,'work_14', 'work_15', 'work_16', 'work_17', 'work_18', 'work_19', 'work_20'
	// 	,'work_21', 'work_22', 'work_23', 'work_24', 'work_25');
	// fileName = JSON.stringify(fileName);
	var loadResult = repo.loadWorksInExhibition();

	loadResult.on('end', function(err, results) {
		var workArray = results[0].workcustominfo.split(',');
		fileName = new Array();
		// eval은 보안상의 문제로 쓰지 않는다.
		// console.log(eval("("+workArray[0]+")").work);

		// JSON.parse : string -> json. 보안상의 문제는 없지만 정확한 문법을 따라야 한다. {"work" : "1"}
		fileName.push('work_0'+JSON.parse(workArray[0]).work);
		fileName.push('work_0'+JSON.parse(workArray[1]).work);
		fileName.push('work_0'+JSON.parse(workArray[2]).work);

		fileName = JSON.stringify(fileName);
		res.render('show', { length: 3,
							 fileName: fileName,
							 reply: '92'
							});
	});
};