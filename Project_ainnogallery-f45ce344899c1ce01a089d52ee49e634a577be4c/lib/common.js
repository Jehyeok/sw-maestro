// pad2 : 한 자리 숫자면 0을 붙여 두 자리 수로 만들어내는 
var pad2 = exports.pad2 = function(number) {  
    var str = '' + number;
    while (str.length < 2)
        str = '0' + str;
    return str;
}

exports.getDateTimeForDBFromDate = function(date) {
	var date = date || new Date();

	var result = date.getFullYear()
		+ '-' + pad2(date.getMonth()+1)
		+ '-' + pad2(date.getDate())
		+ ' ' + pad2(date.getHours())
		+ ':' + pad2(date.getMinutes())
		+ ':' + pad2(date.getSeconds());
	return result;
}