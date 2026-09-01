/* 

名称: pt_AutoExpress
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

{
	function rd_Precompose(thisObj)
	{
		// Globals
		
		var rd_PrecomposeData = new Object();	// Store globals in an object
		
		rd_PrecomposeData.scriptName = "批量预合成";
		rd_PrecomposeData.scriptTitle = rd_PrecomposeData.scriptName + " v1.0";
		
		rd_PrecomposeData.strNewCompName = {en: "新建的合成名称:"};
		rd_PrecomposeData.strLeaveOpt = {en: "保留所有属性在 \\'%s\\'"};
		rd_PrecomposeData.strLeaveOpt2 = {en: "保留所有属性在每个被选层"};
		rd_PrecomposeData.strLeaveOptDesc = {en: "使用该选项创建一个仅包含 \\'%s\\' 的新中间合成. 新合成将成为源当前层."};
		rd_PrecomposeData.strMoveOpt = {en: "移动所有属性到新建合成"};
		rd_PrecomposeData.strMoveOptDesc = {en: "使用此选项可将当前选中的图层移动到一个新的中间合成."};
		rd_PrecomposeData.strMoveOptDescMulti = {en: "使用此选项可将当前选中的图层移动到一个新的中间合成.\n\n \"保留所有属性\" 选项不可用，因为选择了一个以上的图层."};
		rd_PrecomposeData.strMoveOptDescNoSrc = {en: "使用此选项可将当前选中的图层移动到一个新的中间合成.\n\n \"保留所有属性\" 选项不可用，因为被选图层没有包含源素材."};
		rd_PrecomposeData.strBatchMode = {en: "预合成每一个被选图层"};
		rd_PrecomposeData.strBatchModeLayerName = {en: "使用现有的图层名称作为新的合成名称"};
		rd_PrecomposeData.strTrimLayers = {en: "修剪新合成到组合图层\\' 长度"};
		rd_PrecomposeData.strHeadHandle = {en: "头部句柄:"};
		rd_PrecomposeData.strTailHandle = {en: "尾部句柄:"};
		rd_PrecomposeData.strHandleUOM = {en: "秒"};
		rd_PrecomposeData.strOK = {en: "确定"};
		rd_PrecomposeData.strCancel = {en: "取消"};
		rd_PrecomposeData.strHelp = {en: "帮助"};
		rd_PrecomposeData.strErrNoCompSel = {en: "无法执行操作。 请在“项目”面板中选择或打开一个合成，然后重试."};
		rd_PrecomposeData.strErrNoLayerSel = {en: "无法执行操作。 请选择至少一层，然后重试."};
		rd_PrecomposeData.strMinAE80 = {en: "此脚本需要Adobe After Effects CS3或更高版本."};
		rd_PrecomposeData.strHelpText = 
		{
			en: "Copyright (c) 2007-2012 redefinery (Jeffrey R. Almasol). \n" +
			"All rights reserved.   视效网 汉化\n" +
			"\n" +
			"这个脚本会在预合成一个或多个层前显示一个对话框（类似内置预合成对话框），在添加到修剪前，会排版选定层的持续时间，可选的修剪句柄和在每个选定的层上执行相同的操作的批处理模式选项。\n" +
			"\n" +
			"当前问题:\n" +
			"-- 使用 \"保留所有属性\" 选项，单个被选定的负拉伸层将不能被正确修剪。\n" +
			"\n" +
			"注意: 此脚本需要运行在 After Effects CS3 以上版本中.\n" +
			"\n" +
			"Originally requested by Gary Jaeger.\n" + 
			"Enhancements requested by Jerzy Drozda Jr. (Maltaannon) and Colin Proctor.\n"
		};
		
		
		
		
		// rd_Precompose_localize()
		// 
		// Description:
		// This function localizes the given string variable based on the current locale.
		// 
		// Parameters:
		//   strVar - The string variable's name.
		// 
		// Returns:
		// String.
		//
		function rd_Precompose_localize(strVar)
		{
			return strVar["en"];
		}
		
		
		
		
		// rd_Precompose_buildUI()
		// 
		// Description:
		// This function builds the user interface.
		// 
		// Parameters:
		// thisObj - Panel object (if script is launched from Window menu); null otherwise.
		// 
		// Returns:
		// Window or Panel object representing the built user interface.
		//
		function rd_Precompose_buildUI(thisObj)
		{
			var pal = new Window("dialog", rd_PrecomposeData.scriptName, undefined);
			if (pal != null)
			{
				var res = 
				"group { \
					orientation:'column', alignment:['fill','fill'], alignChildren:['fill','top'], \
					compName: Group { \
						alignment:['center','top'], \
						lbl: StaticText { text:'" + rd_Precompose_localize(rd_PrecomposeData.strNewCompName) + "' }, \
						fld: EditText { text:'', characters:31 }, \
					}, \
					leaveOpt: RadioButton { text:'" + rd_Precompose_localize(rd_PrecomposeData.strLeaveOpt) + "', alignment:['fill','top'], value:true, helpTip:'" + rd_Precompose_localize(rd_PrecomposeData.strLeaveOptDesc) + "' }, \
					moveOpt: RadioButton { text:'" + rd_Precompose_localize(rd_PrecomposeData.strMoveOpt) + "', alignment:['fill','top'], helpTip:'" + rd_Precompose_localize(rd_PrecomposeData.strMoveOptDesc) + "' }, \
					opts: Group { \
						orientation:'column', alignment:['fill','top'], \
						batchMode: Checkbox { text:'" + rd_Precompose_localize(rd_PrecomposeData.strBatchMode) + "', alignment:['fill','top'] }, \
						batchModeLayerNames: Checkbox { text:'" + rd_Precompose_localize(rd_PrecomposeData.strBatchModeLayerName) + "', alignment:['fill','top'] }, \
						trimLayers: Checkbox { text:'" + rd_Precompose_localize(rd_PrecomposeData.strTrimLayers) + "', alignment:['fill','top'] }, \
						handles: Group { \
							orientation:'row', alignment:['left','fill'], alignChildren:['left','center'], \
							headLbl: StaticText { text:'" + rd_Precompose_localize(rd_PrecomposeData.strHeadHandle) + "', enabled:false }, \
							headVal: EditText { text:'0', characters:4, enabled:false }, \
							headUOM: StaticText { text:'" + rd_Precompose_localize(rd_PrecomposeData.strHandleUOM) + "', enabled:false }, \
							spacer: StaticText { text:'    ', alignment:['fill','center'], enabled:false }, \
							tailLbl: StaticText { text:'" + rd_Precompose_localize(rd_PrecomposeData.strTailHandle) + "', enabled:false }, \
							tailVal: EditText { text:'0', characters:4, enabled:false }, \
							tailUOM: StaticText { text:'" + rd_Precompose_localize(rd_PrecomposeData.strHandleUOM) + "', enabled:false }, \
						}, \
					}, \
					cmds: Group { \
						alignment:['fill','top'], \
						helpBtn: Button { text:'" + rd_Precompose_localize(rd_PrecomposeData.strHelp) + "', alignment:['left','top'] }, \
						okBtn: Button { text:'" + rd_Precompose_localize(rd_PrecomposeData.strOK) + "', alignment:['right','top'] }, \
						cancelBtn: Button { text:'" + rd_Precompose_localize(rd_PrecomposeData.strCancel) + "', alignment:['right','top'] }, \
					}, \
				}";
				
				pal.grp = pal.add(res);
				
				pal.grp.opts.margins.top = pal.grp.cmds.margins.top = 10;
				pal.grp.opts.handles.indent = 20;
				
				pal.grp.compName.fld.onChanging = function ()
				{
					if (this.text.length > 31)
						this.text = this.text.substr(0, 31);
				}
				pal.grp.opts.batchMode.onClick = function ()
				{
					var enableState = this.value;
					
					this.parent.batchModeLayerNames.enabled = enableState;
				}
				pal.grp.opts.batchModeLayerNames.onClick = function ()
				{
					var enableState = this.value;
					
					this.parent.parent.compName.lbl.enabled = this.parent.parent.compName.fld.enabled = !enableState;
				}
				pal.grp.opts.trimLayers.onClick = function ()
				{
					var enableState = this.value;
					
					//this.parent.handles.enabled = enableState;	// doesn't work in AE CS6
					this.parent.handles.headLbl.enabled = enableState;
					this.parent.handles.headVal.enabled = enableState;
					this.parent.handles.headUOM.enabled = enableState;
					this.parent.handles.spacer.enabled = enableState;
					this.parent.handles.tailLbl.enabled = enableState;
					this.parent.handles.tailVal.enabled = enableState;
					this.parent.handles.tailUOM.enabled = enableState;
				}
				pal.grp.opts.handles.headVal.onChange = pal.grp.opts.handles.tailVal.onChange = function ()
				{
					var value = parseFloat(this.text);
					if (isNaN(value) || (value < 0.0))
						value = 0;
					else if (value > 9999)
						value = 9999;
					this.text = value.toString();
				}
				pal.grp.cmds.helpBtn.preferredSize.width = 25;
				pal.grp.cmds.helpBtn.onClick = function () {alert(rd_PrecomposeData.scriptTitle + "\n" + rd_Precompose_localize(rd_PrecomposeData.strHelpText), rd_PrecomposeData.scriptName);}
				pal.grp.cmds.okBtn.onClick = rd_Precompose_precomp;
				
				var comp = app.project.activeItem;
				pal.grp.leaveOpt.text = rd_Precompose_localize(rd_PrecomposeData.strLeaveOpt).replace("\\'%s\\'", "'"+comp.name+"'");
				pal.grp.leaveOpt.helpTip = rd_Precompose_localize(rd_PrecomposeData.strLeaveOptDesc).replace("\\'%s\\'", "'"+comp.selectedLayers[0].name+"'");
				if (comp.selectedLayers.length == 1)
				{
					// The "Leave all attributes" option is available only if the selected layer has source
					if (comp.selectedLayers[0].source == null)
					{
						pal.grp.moveOpt.value = true;
						pal.grp.moveOpt.helpTip = rd_Precompose_localize(rd_PrecomposeData.strMoveOptDescNoSrc);
						pal.grp.leaveOpt.enabled = false;
					}
					pal.grp.compName.fld.text = comp.selectedLayers[0].name.substr(0, 31-(" Comp 1".length)) + " Comp 1";
					
					// No batch mode for a single selected layer
					pal.grp.opts.batchMode.enabled = pal.grp.opts.batchMode.value = pal.grp.opts.batchModeLayerNames.enabled = pal.grp.opts.batchModeLayerNames.value = false;
				}
				else
				{
					pal.grp.compName.fld.text = "Pre-comp 1";
					pal.grp.moveOpt.value = true;
					pal.grp.moveOpt.helpTip = rd_Precompose_localize(rd_PrecomposeData.strMoveOptDescMulti);
					pal.grp.leaveOpt.text = rd_Precompose_localize(rd_PrecomposeData.strLeaveOpt2);
					pal.grp.leaveOpt.enabled = false;
					
					// Batch mode is available for multiple selected layer, but off by default
					pal.grp.opts.batchMode.enabled = true;
					pal.grp.opts.batchMode.value = pal.grp.opts.batchModeLayerNames.value = false;
					pal.grp.opts.batchModeLayerNames.enabled = false;
				}
				
				pal.layout.layout(true);
			}
			
			return pal;
		}
		
		
		// rd_Precompose_precomp()
		// 
		// Description:
		// This function performs the actual pre-comp operation.
		// 
		// Parameters:
		// None.
		// 
		// Returns:
		// Nothing.
		//
		function rd_Precompose_precomp()
		{
			function processSelected(win)
			{
				var layerIndices = new Array(), layer, layerIn, layerOut;
				var earliest=comp.duration, latest=0;
				for (var i=0; i<comp.selectedLayers.length; i++)
				{
					layer = comp.selectedLayers[i];
					layerIndices[layerIndices.length] = layer.index;
					
					if (layer.stretch < 0)
					{
						layerIn = layer.outPoint;
						layerOut = layer.inPoint;
					}
					else
					{
						layerIn = layer.inPoint;
						layerOut = layer.outPoint;
					}
					
					if (layerIn < earliest)
						earliest = layerIn;
					if (layerOut > latest)
						latest = layerOut;
				}
				if (earliest < 0.0)
					earliest = 0.0;
				if (latest > comp.duration)
					latest = comp.duration;
				
				var precomp = comp.layers.precompose(layerIndices, compName, moveAttrs);
				var precompLayer = comp.selectedLayers[0];		// created precomp should be the single selected layer
				var totalDur = latest - earliest;
				
				// Check if need to trim the precomp
				var headHandle = 0.0;	// default amount of shifting of layers from start of pre-comp
				if (win.opts.trimLayers.value)
				{
					headHandle = parseFloat(win.opts.handles.headVal.text);
					var tailHandle = parseFloat(win.opts.handles.tailVal.text);
					totalDur = totalDur + headHandle + tailHandle;
				}
				
				// Shift pre-comped layers to start of comp
				for (var i=1; i<=precomp.numLayers; i++)
				{
					precomp.layer(i).startTime -= earliest - headHandle;
				}
				
				if (moveAttrs) {
					// Trim precomp to appropriate duration
					precomp.duration = totalDur;
				}
				
				// Shift pre-comp layer
				if (precompLayer.stretch < 0)
				{
					precompLayer.inPoint = latest;
					precompLayer.outPoint = earliest;
				}
				else
				{
					precompLayer.startTime = earliest - headHandle;
					precompLayer.inPoint = earliest;
					precompLayer.outPoint = latest;
				}
			}
			
			var compName = this.parent.parent.compName.fld.text.substr(0, 31);
			var moveAttrs = this.parent.parent.moveOpt.value;
			var batchMode = this.parent.parent.opts.batchMode.value;
			var batchModeLayerNames = this.parent.parent.opts.batchModeLayerNames.value;
			this.parent.parent.parent.close();
			
			app.beginUndoGroup(rd_PrecomposeData.scriptName);
			
			var comp = app.project.activeItem;
			
			if (batchMode)
			{
				// Save the originally selected layers, in case we are using batch mode
				var savedLayerIndices = new Array();
				for (var i=0; i<comp.selectedLayers.length; i++)
					savedLayerIndices[savedLayerIndices.length] = comp.selectedLayers[i].index;
				
				// Process each originally selected layer
				var prevLayerName;
				for (var i=0; i<savedLayerIndices.length; i++)
				{
					// First, deselect all layers
					for (var j=0; j<savedLayerIndices.length; j++)
						comp.layer(savedLayerIndices[j]).selected = false;
					
					// Then, select the next layer to process, and then process it
					comp.layer(savedLayerIndices[i]).selected = true;
					prevLayerName = comp.layer(savedLayerIndices[i]).name;
					processSelected(this.parent.parent);
					
					// Name the comp based on the layer, if desired
					if (batchModeLayerNames)
						comp.layer(savedLayerIndices[i]).source.name = prevLayerName;
				}
			}
			else
				processSelected(this.parent.parent);
			
			app.endUndoGroup();
		}
		
		
		// main:
		// 
		
		if (parseFloat(app.version) < 8)
			alert(rd_Precompose_localize(rd_PrecomposeData.strErrMinAE80), rd_PrecomposeData.scriptName);
		else
		{
			// Check that at least one layer is selected
			var comp = app.project.activeItem;
			if ((comp == null) || !(comp instanceof CompItem))
			{
				alert(rd_Precompose_localize(rd_PrecomposeData.strErrNoCompSel), rd_PrecomposeData.scriptName);
				return;
			}
			if (comp.selectedLayers.length < 1)
			{
				alert(rd_Precompose_localize(rd_PrecomposeData.strErrNoLayerSel), rd_PrecomposeData.scriptName);
				return;
			}
			
			// Build/show the user interface
			var rdpcPal = rd_Precompose_buildUI(thisObj);
			if (rdpcPal != null)
			{
				rdpcPal.center();
				rdpcPal.show();
			}
		}
	}
	
	
	rd_Precompose(this);
}