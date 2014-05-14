global._db_client = new (require('mariasql'));

(function(global) {
	function DBClient()
	{
		var _db_connect_info = null;
	}

	DBClient.prototype.connect = function(connectInfo) {
		if (!connectInfo && !_db_connect_info)
			return;
		else if (_db_connect_info == null)
			_db_connect_info = connectInfo;

		var config = _db_connect_info.config;
		var success = _db_connect_info.success;
		var error = _db_connect_info.error;
		var close = _db_connect_info.close;

		_db_client.connect(config);
		_db_client.on('connect', success);
		_db_client.on('error', error);
		_db_client.on('close', close);
	};

	DBClient.prototype.close = function(isDestroying) {
		if (isDestroying == true) _db_client.destroy();
		else _db_client.end();
	};

	DBClient.prototype.query = function(queryInfo) {
		var queryString = queryInfo.queryString;
		var queryArgument = queryInfo.queryArgument || null;
		var success = queryInfo.success;
		var error = queryInfo.error;
		var abort = queryInfo.abort;
		var end = queryInfo.end;
		var all_end = queryInfo.all_end;

		if ((typeof queryString) == 'string')
		{
			_db_client.query(queryString, queryArgument)
				.on('result', function(res) {
					res.on('row', success);
					.on('error', error);
					.on('end', end);
				});
			if (end) res.end('end', all_end);
		}
		else if ((typeof queryString) == 'object')
		{
			_db_client.query(queryString);
		}

		_db_client.on('result', function(res) {
			res.
		});

		_db_client.end();
	};

	DBClient.prototype.createTable = function(createInfo) {
		var name = createInfo.name;
		var fields = createInfo.fields;
		var success = createInfo.success;
		var error = createInfo.error;
		var abort = createInfo.abort;
		var end = createInfo.info;
	};

	DBClient.prototype.table = function(table_name) {
		var table_name = table_name;
		return function(table_name) {
			var table_name = table_name;
			this.record = {
		};
	};

	function find(findInfo)
	{
		var fields = findInfo.fields;
		var conditions = findInfo.conditions;
		var success = findInfo.success;
		var error = findInfo.error;

		return function(result)

	}

	global.$DB = new DBClient();
})(global);