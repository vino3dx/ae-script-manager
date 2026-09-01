/* 

名称: XYZ对齐脚本
版本: v1.0（暂定）


说明:

1、此脚本的作用是为了方便，归类凌乱的各种AE脚本，并且我〖视效网〗为了我国人使用方便通通都进行了汉化，方便了完全不想懂英文的宝宝们。
 
2、选中你放置脚本的文件夹，如果你的AE是默认安装位置，那么脚本文件夹最好是在C:\Program Files\Adobe\Adobe After Effects CC 2019\Support Files\Scripts想要使用就双击点击使用即可。

3、如果有新脚本想要安装在面板中，就把脚本复制放在这个文件夹内就好，然后在AE脚本管理器中点击刷新，该脚本不用每次重新打开面板。

4、如果想要在AE脚本管理器中的脚本左边显示图，就做一个png透明通道图放在AE脚本旁，名字与脚本名字一样，扩展名不要改，还是png，它就会出现在列表中脚本名称旁边了。

5、声明：这个脚本是根据原脚本基础上开发的，所以不提供任何形式的保障，因使用该脚本导致出现的任何问题，作者〖视效网〗均不承担任何赔偿责任。

6、换句话说，我只是汉化了这个脚本，毕竟对于我这个英语盲人来说，看英语就是天书，阿波次的一点不懂。最开始纯粹方便自己，独乐乐不如众乐乐，所以顺便分享了。

7、这个脚本可不是我开发的，我也不会编程，我只是有点了解，顺便乱改一同，我可不知道会不会有什么问题，有懂得朋友可以检查看看，我也学学，而且我并不是这个AE脚本的负责人，如果这个脚本代码出现任何问题，可不能怪我啊^_^

8、能看到这里的，基本都是对AE脚本、编程有一定基础和了解的，是不是，大神！

9、顺便打个广告，欢迎来我的博客作客 wanvfx.com，一起学习交流。
        
*/

function AMLFunction() {}

AMLFunction.prototype = {
	dropdownlist: {},
	project: {},
	array: {},
	window: {},
	check: {},
};

AMLFunction.prototype.dropdownlist = {
	addItem: function (list, array) {
		for(var i = 0; i < array.length; i++) {
			if(array[i] == null) {
				list.add('separator');
			}else {
				list.add('item', array[i]);
			}
		}
	},
};

AMLFunction.prototype.project = {
	getSelectedLayers: function () {
		var thisComp = app.project.activeItem;
		if(!(thisComp instanceof CompItem) || thisComp.selectedLayers.length == 0){
			return false;
		}
		return thisComp.selectedLayers;
	},
};

AMLFunction.prototype.array = {
	invert: function (array) {
		var newArray = new Array;
		for(var i = 0; i < array.length; i++) {
			newArray[i] = array[array.length - 1 - i];
		}
		return newArray;
	},
	random: function (array) {
		var newArray = new Array;
		for(var i = 0; i < array.length; i++) {
			var start = Math.round(Math.random() * newArray.length);
			newArray.splice(start, 0, array[i]);
		}
		return newArray;
	},
};

AMLFunction.prototype.window = {
	resize: function (window) {
		window.layout.layout(true);
		window.layout.resize();
		window.onResizing = window.onResize = function () {
			this.layout.resize();
		}
	},
};

AMLFunction.prototype.check = {
	isNumber: function (str) {
		var myNum = parseFloat(str);
		if(isNaN(myNum)) {
			return 0;
		}else {
			return myNum;
		}
	},

};


//-------------------------------------------------------------------------
var seqLayer = new AMLFunction();

seqLayer.str = {
	title: '层时间设置偏移',
	OK: '确定',
	sequence: '序列',
	sequenceList: ['正向', '反向', '随机'],
	unit: '单位',
	unitList: ['帧', '秒'],
	offset: '随机偏移',
};

seqLayer.win = function (obj) {
	var str = this.str;
	//创建窗口
	var win = (obj instanceof Panel) ? obj : new Window("palette", str.title, undefined, {resizeable: true});
	win.margins = 0;
	var group = win.group = win.add(
		"group{\
			alignment: ['fill','fill'],\
			alignChildren: ['fill','top'],\
			orientation: 'column',\
			spacing: 2,\
			top: Group{\
				spacing: 0,\
				value: EditText{text: '0', alignment: ['fill','center'],},\
				OK: Button{alignment: ['right','center'], size: [50, 25]},\
			},\
			center: Group{\
				spacing: 10,\
				alignChildren: ['left','center'],\
				left: Group{\
					spacing: 0,\
					alignChildren: ['left','center'],\
					text: StaticText{},\
					list: DropDownList{},\
				},\
				right: Group{\
					spacing: 0,\
					alignChildren: ['left','center'],\
					text: StaticText{},\
					list: DropDownList{},\
				},\
			},\
			bottom: Group{\
				spacing: 0,\
				alignChildren: ['left','center'],\
				offset: Checkbox{},\
				right: Group{\
					spacing: 0,\
					alignment: ['fill','center'],\
					alignChildren: ['fill','center'],\
					min: EditText{text: '0',},\
					max: EditText{text: '0',},\
				},\
			},\
		}"
	);
	var move = group.top.value;
	var OK = group.top.OK;
	OK.text = str.OK;
	group.center.left.text.text = str.sequence;
	var sequence = group.center.left.list;
	this.dropdownlist.addItem(sequence, str.sequenceList);
	var unit = group.center.right.list;
	this.dropdownlist.addItem(unit, str.unitList);
	group.center.right.text.text = str.unit;
	var offset = group.bottom.offset;
	offset.text = str.offset;
	var offsetValue = group.bottom.right;
	
	//事件
	offset.onClick = function () {
		if(this.value) {
			offsetValue.visible = 1;
		}else {
			offsetValue.visible = 0;
		}
	}
	
	OK.onClick = function () {
		var sl = seqLayer.project.getSelectedLayers();
		if(!sl) {
			return;
		}
	
		if(sequence.selection.index == 1) {
			sl = seqLayer.array.invert(sl);
		}else if(sequence.selection.index == 2) {
			sl = seqLayer.array.random(sl);
		}
	
		var value0 = seqLayer.check.isNumber(move.text);
		var min = seqLayer.check.isNumber(offsetValue.min.text);
		var max = seqLayer.check.isNumber(offsetValue.max.text);
		app.beginUndoGroup(str.title);
		for(var i = 0; i < sl.length; i++) {
			var value = value0;
			var time = value0;
			if(offset.value) {
				time += Math.random() * (max - min) + min;
			}
			if(unit.selection.index == 0) {
				time *= app.project.activeItem.frameDuration;
				value *= app.project.activeItem.frameDuration;
			}
			sl[i].startTime += time + value * (i - 1);
		}
		app.endUndoGroup();
		
	}

	this.window.resize(win);
	sequence.selection = 0;//初始化
	unit.selection = 0;
	offset.onClick();
	return win;
}

var seqLayerWin = seqLayer.win(this);
if(seqLayerWin instanceof Window) {
	seqLayerWin.center();
	seqLayerWin.show();
}