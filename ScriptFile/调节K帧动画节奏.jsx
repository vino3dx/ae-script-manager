/* 

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



#target aftereffects

var EASING_FOLDER        = '调节K帧脚本预设';
var CLEAR_EXPRESSION_BTN = false; // this adds a button to the palette, "clear", that deletes expressions on all selected properties. Off by default.
var easingEquation       = "";
var palette;

// 面板控制
var easingList;
var typeList;
var keysList;
var curvaceousCheckbox;

// 
var keysLookup = new Object();
keysLookup['-all'] = '所有';
keysLookup['-startEnd'] = '开始和结束';
keysLookup['-startOnly'] = '只有开始';

var inOutLookup = new Object();
inOutLookup['inOut'] = '入 + 出';
inOutLookup['in'] = '入';
inOutLookup['out'] = '出';

var easingTypesAry = ['展览', '环形', '五分度', '四分度', '四方', '正弦', '-', '迂回', '反弹', '橡皮筋']; // TODO: add AE exponential scale'Expo', '环行排列', '五度音', '四分之一', '线组', '正弦', '-', '后退', '反弹', '弹性'

var activeItem;
var selectedProperties;

function getHashValues_wizz(hash)
{ // {{{
	var ary = new Array();
	for (k in hash) {
		ary.push(hash[k]);
	}

	return ary;
} // }}}

function getHashKeys_wizz(hash)
{ // {{{
	var ary = new Array();
	for (k in hash) {
		ary.push(k);
	}

	return ary;
} // }}}

function main_wizz(thisObj)
{ //{{{
	createPalette_wizz(thisObj);
	/*
	activeItem = app.project.activeItem;
	if (activeItem == null) {
		return;
	}
	*/
} //}}}

function getPathToEasingFolder_wizz()
{ // {{{
	// much simpler, thanks Jeff
	var folderObj = new Folder((new File($.fileName)).path + "/" + EASING_FOLDER);
	return folderObj;

} // }}}

function createPalette_wizz(thisObj)
{//{{{
	var LIST_DIMENSIONS = [0, 0, 120, 15];
	var STATIC_TEXT_DIMENSIONS = [0, 0, 60, 15];

	palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", "关键帧节奏调节", undefined, {resizeable: true});
	palette.margins       = 6;
	palette.alignChildren = 'left';
	
	// fix the text display in the popup menu - thanks Jeff Almasol
	var winGfx = palette.graphics;
	var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0,0,0], 1);

	// popup menus
	{ // {{{

		// "easing" menu

		var easingGrp            = palette.add('group', undefined, 'Easing group');
		easingGrp.add('statictext', STATIC_TEXT_DIMENSIONS, '缓冲:');

		easingList                          = easingGrp.add('dropdownlist', LIST_DIMENSIONS, easingTypesAry);
		easingList.helpTip                  = "Choose the type of easing here. They're arranged";
		easingList.selection                = 'expo';
		easingList.graphics.foregroundColor = darkColorBrush;



		// "type" menu

		var typeGrp            = palette.add('group', undefined, 'Type group'); 
		typeGrp.add('statictext', STATIC_TEXT_DIMENSIONS, '类型:');

		typeList                          = typeGrp.add('dropdownlist', LIST_DIMENSIONS, getHashValues_wizz(inOutLookup));
		typeList.selection                = 'In + Out';
		typeList.graphics.foregroundColor = darkColorBrush;




		// "keys"功能表

		var keysGrp = palette.add('group', undefined, 'Keys group');
		keysGrp.add('statictext', STATIC_TEXT_DIMENSIONS, '键:');

		keysList                          = keysGrp.add('dropdownlist', LIST_DIMENSIONS, getHashValues_wizz(keysLookup));
		keysList.graphics.foregroundColor = darkColorBrush;
		keysList.selection                = getHashValues_wizz(keysLookup)[0]; // select the first item

	} // }}}

	//曲线美的复选框
	var curvaceousGrp        = palette.add('group', undefined, 'Curvaceous group');
	curvaceousCheckbox       = palette.add('checkbox', undefined, '曲线');
	curvaceousCheckbox.value = false;

	// 更新面板
	curvaceousCheckbox.onClick = function()
	{ // {{{
		if (this.value)
		{
			// it was off, remove
			easingList.remove("Elastic");
			easingList.remove("Back");

			keysList.remove("Start only");
		}
		else
		{ 
			// it was on, add the missing items
			easingList.add("item", "Elastic");
			easingList.add("item", "Back");

			keysList.add("item", "Start only");
		}

		//var items = easingList.items[2];
	} // }}}


	// 应用按钮
	{ // {{{

		var buttonGrp = palette.add('group', undefined, 'Button group');
		buttonGrp.add('statictext', STATIC_TEXT_DIMENSIONS, '');

		// standard buttons
		if (CLEAR_EXPRESSION_BTN)
		{
			var clearExpressionsBtn     = buttonGrp.add('button', undefined, 'Clear expressions');
			clearExpressionsBtn.onClick = clearExpressions_wizz;
		}

		////////////////////	
		//应用按钮
		////////////////////	

		var applyBtn     = buttonGrp.add('button', undefined, '应用');
		applyBtn.onClick = applyExpressions_wizz;

	} // }}}

	if (palette instanceof Window)
	{
		palette.show();
	}
	else
	{
		palette.layout.layout(true);
	}

}//}}}

function trace_wizz(s) { //用于调试
//{{{
	//$.writeln(s); // writes to the ExtendScript interface
	writeLn(s); // writes in the AE info window
} //}}}

function readFile_wizz(filename)
{ //{{{
	var easing_folder = getPathToEasingFolder_wizz();
	var file_handle   = new File(easing_folder.fsName + '/' + filename);

	if (!file_handle.exists) {
		throw("I can't find this file: '" + filename + "'. \n\n你看看这个路径: '" + easing_folder.fsName + "'. \n\n一看你就是没把“调节K帧脚本预设”文件夹和本脚本放在一起，赶紧拿回来。");
		return;
	}

	try 
	{

		file_handle.open('r');
		var the_code = file_handle.read();
	}
	catch(e) 
	{
		throw("I couldn't read the easing equation file: " + e);
		return;
	}
	finally
	{
		file_handle.close();
	}

	return(the_code);
} //}}}

function applyExpressions_wizz() { // 决定要加载哪些外部文件
 // {{{
	
	
	if (!canProceed_wizz()) { return false }

	app.beginUndoGroup("Ease and Wizz");


	// defaults
	var easingType              = 'inOut';
	var easeandwizzOrCurvaceous = "-easeandwizz";
	var keyframesToAffect       = "-allKeys";

	// l
	
	// easeAndWizz, or curvaceous?
	if (curvaceousCheckbox.value) easeandwizzOrCurvaceous = "-curvaceous";

	// which keys should be affected?
	for ( i in keysLookup ) 
	{
		if (keysLookup[i] == keysList.selection.toString())
		{
			keyframesToAffect = i;
		}
	}

	// then, should the expression be In, Out, or Both?
	for ( i in inOutLookup ) 
	{
		if (inOutLookup[i] == typeList.selection.toString()) {
			easingType = i;
		}
	}
	
	var curveType = easingList.selection.toString();
	// very hacky, sorry
	if (curveType == "AE expo") curveType = "aeExpo";


	var fileToLoad = easingType + curveType + easeandwizzOrCurvaceous + keyframesToAffect + '.js';

	try
	{
		
		easingEquation = readFile_wizz(fileToLoad);
	}
	catch(e)
	{
		// debugger;
		
		Window.alert(e);
		return false;
	}

	//Window.alert(fileToLoad);
	setProps_wizz(easingEquation);

	
	app.endUndoGroup();
	
} // }}}

function clearExpressions_wizz()
{//{{{
	// TODO : "Object is invalid"
	// TODO : "null is not an object"
	selectedProperties = activeItem.selectedProperties;
	for (var f in selectedProperties)
	{
		var currentProperty = selectedProperties[f];
		if (!currentProperty.canSetExpression) { continue }
		currentProperty.expression = '';
	}
}//}}}

function setProps_wizz(expressionCode)
// used to be just "setProps" - but that conflicted with Expression Toolbox, hence the "_wizz" suffix
{ //{{{
	var selectedProperties = app.project.activeItem.selectedProperties;
	
	for (var f in selectedProperties)
	{
		var currentProperty = selectedProperties[f];

		if ((currentProperty.propertyValueType == PropertyValueType.SHAPE) && !curvaceousCheckbox.value) {
			alert("It looks like you have a Mask Path selected. To apply Ease and Wizz to a Mask Path, select the ‘Curvaceous’ checkbox and try again.");
			continue;
		}
		
		if (!currentProperty.canSetExpression) { continue } // don't do anything if we can't set an expression
		if (currentProperty.numKeys < 2) { continue } // likewise if there aren't at least two keyframes selected
		
		// finally ...
		currentProperty.expression = expressionCode;
	}
} //}}}

function canProceed_wizz() 
{ // {{{
	activeItem = app.project.activeItem;
	if (activeItem == null)
	{
		Window.alert("Select a keyframe or two.");
		return false;
	}

	return true;
} // }}}

main_wizz(this);
