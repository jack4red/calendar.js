// author zhoukang
function Calender(id, option) {
	if (this === window) {
		return new Calender(id, option)
	}
	this.url = option.url;
	this.thDayText = option.thDayText || ['一','二','三','四','五','六','日'];
	this.Calender = document.getElementById(id) || document.body;
	this._date = option.date || new Date();
	this.rawFormatter = option.rawFormatter || this.rawFormatter;
	this.clickCallback = option.clickCallback || function(item, data){};  //当前点击的dom，ajax穿来的数据
	this.setDate();
	this.createTable();
	this.render();
	this.bindEvent();
}
Calender.prototype = {
	setDate: function(_date) {
		this._date = _date || this._date;
		this._year = this._date.getFullYear();
		this._month = this._date.getMonth() + 1;
		this._toDay = this._date.getDay();
		this._firstDay = new Date(this._year, this._month - 1, 1);
	},
	getDate: function(argument) {
		var dataText = this._year + '-' + this._toFixed(this._month) + '-' + this._toFixed(this._date.getDate());
		return [dataText, this._year, this._month];
	},
	rawFormatter: function(item, dayIndex, data) {
		return item;
	},
	createTable: function() {
		var thText = '',tbodyText = '';
		for (var i = 0; i < this.thDayText.length; i++) {
			thText += '<th>' + this.thDayText[i] + '</th>';
		}
		for (var j = 0; j < 6; j++) {
			tbodyText += '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
		}
		$(this.Calender).html("<table class='table table-bordered'><thead><tr></tr></thead><tbody></tbody></table>");
		$(this.Calender).find('thead tr').html(thText);
		$(this.Calender).find('tbody').html(tbodyText);
	},
	handleAjax: function(callback) {  //此处本来可以用bind漂亮的实现，因为要兼容IE8，不得不写成这样
		var _this = this;
		callback = callback || function(){};
		var dataText = _this.getDate()[1] + '-' + _this._toFixed(_this.getDate()[2]);
		if (_this.url) {
			$.ajax({
				url:_this.url,
				type:'GET',
				data:{"time":dataText},
				success:function(resp) {
					_this.ajaxData = resp;
					callback(_this.ajaxData);
				},
				fail:function(resp) {
					console.log(resp);
					callback();
				}
			})
		} else {
			callback();
		}
	},
	render: function() {
		var startIndex = this._firstDay.getDay();
		var dayIndex = 1;
		var _this = this;
		_this.handleAjax(function() {
			$(_this.Calender).find('td').each(function(index, item) {
				var currentDay = new Date(_this._year, _this._month - 1, dayIndex);
				if (index + 1 >= startIndex && currentDay.getMonth() + 1 === _this._month) {
					$(item).html(dayIndex);
					var dataInfo = _this._year + '-' + _this._toFixed(_this._month) + '-' +_this._toFixed(dayIndex);
					$(item).attr('data-info', dataInfo);
					_this.rawFormatter(item, dayIndex, _this.ajaxData);
					dayIndex++;
				} else {
					$(item).replaceWith('<td>&nbsp;</td>');
				}
			})
		});
	},
	bindEvent:function() {
		var _this = this;
		$(this.Calender).delegate('tbody td', 'click', function(event) {
			_this.clickCallback(event.currentTarget, _this.ajaxData)
		})
	},
	_toFixed:function(num) {
		return num < 10 ? '0' + num:'' + num;
	}
};