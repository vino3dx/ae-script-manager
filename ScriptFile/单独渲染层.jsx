/* 

名称: 单独渲染层
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
	//
	function rd_RenderLayers(thisObj)
	{
		// Globals

		var rd_RenderLayersData = new Object();	// Store globals in an object
		rd_RenderLayersData.scriptName = "单独渲染选中的图层";
		rd_RenderLayersData.scriptTitle = rd_RenderLayersData.scriptName + " v2.1";
		
		rd_RenderLayersData.strLayerRange = {en: "渲染区域:"};
		rd_RenderLayersData.strLayerRangeOpts = {en: '["工作区域，快捷键B~N", "整个合成的工作区域", "工作区域范围内，该图层的长度为渲染区域"]'};
		rd_RenderLayersData.strKeepInRender = {en: "保持渲染:"};
		rd_RenderLayersData.strKeepInUnsel = {en: "未选中图层"};
		rd_RenderLayersData.strKeepInAdjust = {en: "调整层"};
		rd_RenderLayersData.strKeepInActiveCam = {en: "激活相机"};
		rd_RenderLayersData.strKeepInLights = {en: "灯光"};
		rd_RenderLayersData.strRSTemplate = {en: "渲染设置模板:"};
		rd_RenderLayersData.strOMTemplate = {en: "输出组件模版:"};
		rd_RenderLayersData.strRefresh = {en: "刷新"};
		rd_RenderLayersData.strOutFolder = {en: "输出文件夹:"};
		rd_RenderLayersData.strOutFolderBrowse = {en: "浏览..."};
		rd_RenderLayersData.strOutName = {en: "输出名称模版:"}
		rd_RenderLayersData.strQueueOnly = {en: "仅序列"};
		rd_RenderLayersData.strRender = {en: "渲染"};
		rd_RenderLayersData.strHelp = {en: "说明"};
		rd_RenderLayersData.strErrNoCompSel = {en: "无法进行操作。请在项目面板中选择或打开一个单独的合成，然后再试一次。"};
		rd_RenderLayersData.strErrNoLayerSel = {en: "无法进行操作。请选择至少一个图层，然后再试一次。"};
		rd_RenderLayersData.strMinAE80 = {en: "该脚本需要安装Adobe After Effects CS3或更高版本。"};
		rd_RenderLayersData.strHelpText = 
		{
			en: "Copyright (c) 2006-2008 redefinery (Jeffrey R. Almasol). \n" +
			"All rights reserved.   \n" +

			"\n" +
			"视效网wanvfx.com从大神基础上汉化\n" +

			"\n" +
			"我只是个搬运工。\n" +

			"\n" +
			"声明：这个脚本是根据原脚本基础上开发的，所以不提供任何形式的保障，因使用该脚本导致出现的任何问题，作者〖视效网〗远方，均不承担任何赔偿责任。\n" +
			
			"\n" +
			"换句话说，我只是汉化了这个脚本，毕竟对于我这个英语盲人来说，看英语就是天书，阿波次的一点不懂。最开始纯粹方便自己，独乐乐不如众乐乐，所以顺便分享了。\n" +
			
			"\n" +
			"2020年6月"
		};
		
		
		
		
		// rd_RenderLayers_localize()
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
		function rd_RenderLayers_localize(strVar)
		{
			return strVar["en"];
		}
		
		
		
		
		// rd_RenderLayers_buildUI()
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
		function rd_RenderLayers_buildUI(thisObj)
		{
			var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_RenderLayersData.scriptName, undefined, {resizeable:true});
			
			if (pal != null)
			{
				var res = 
				"group { \
					orientation:'column', alignment:['fill','top'], \
					header: Group { \
						alignment:['fill','top'], \
						title: StaticText { text:'" + rd_RenderLayersData.scriptName + "', alignment:['fill','center'] }, \
						help: Button { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
					}, \
					r1: Group { \
						alignment:['fill','top'], \
						layerRange: StaticText { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strLayerRange) + "' }, \
						layerRangeList: DropDownList { properties:{items:" + rd_RenderLayers_localize(rd_RenderLayersData.strLayerRangeOpts) + "}, alignment:['fill','top'] }, \
					}, \
					r2: Group { \
						alignment:['fill','top'], \
						keepInRender: StaticText { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strKeepInRender) + "' }, \
						keepInUnsel: Checkbox { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strKeepInUnsel) + "', value:false }, \
						keepInAdjust: Checkbox { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strKeepInAdjust) + "', value:true }, \
					}, \
					r3: Group { \
						alignment:['fill','top'], \
						keepInActiveCam: Checkbox { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strKeepInActiveCam) + "', value:true }, \
						keepInLights: Checkbox { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strKeepInLights) + "', value:true }, \
					}, \
					r4: Group { \
						alignment:['fill','top'], \
						r4left: Group { \
							orientation:'column', alignment:['fill','center'], \
							r4top: Group { \
								alignment:['fill','top'], \
								rsTpl: StaticText { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strRSTemplate) + "' }, \
								rsTplList: DropDownList { alignment:['fill','top'], alignment:['fill','top'] }, \
							}, \
							r4btm: Group { \
								alignment:['fill','top'], \
								omTpl: StaticText { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strOMTemplate) + "' }, \
								omTplList: DropDownList { alignment:['fill','top'], alignment:['fill','top'] }, \
							}, \
						}, \
						refresh: Button { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strRefresh) + "', alignment:['right','center'] \ }, \
					}, \
					r5: Group { \
						alignment:['fill','top'], \
						outFolder: StaticText { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strOutFolder) + "' }, \
						outFolderName: EditText { text:'', characters:20, alignment:['fill','top'] }, \
						outFolderBrowse: Button { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strOutFolderBrowse) + "', alignment:['right','top'] }, \
					}, \
					r6: Group { \
						alignment:['fill','top'], \
						outName: StaticText { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strOutName) + "' }, \
						outNameTpl: EditText { text:'[compName]_[layerName].[fileExtension]', characters:20, alignment:['fill','top'] }, \
					}, \
					cmds: Group { \
						alignment:['right','top'], \
						queueOnlyBtn: Button { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strQueueOnly) + "' }, \
						renderBtn: Button { text:'" + rd_RenderLayers_localize(rd_RenderLayersData.strRender) + "' }, \
					}, \
				}";
				pal.grp = pal.add(res);
				
				// Workaround to ensure the edittext text color is black, even at darker UI brightness levels
				var winGfx = pal.graphics;
				var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0,0,0], 1);
				pal.grp.r1.layerRangeList.graphics.foregroundColor = darkColorBrush;
				pal.grp.r4.r4left.r4top.rsTplList.graphics.foregroundColor = darkColorBrush;
				pal.grp.r4.r4left.r4btm.omTplList.graphics.foregroundColor = darkColorBrush;
				pal.grp.r5.outFolderName.graphics.foregroundColor = darkColorBrush;
				pal.grp.r6.outNameTpl.graphics.foregroundColor = darkColorBrush;
				
				pal.grp.r1.layerRange.preferredSize.width = 
					pal.grp.r2.keepInRender.preferredSize.width = 
					pal.grp.r4.r4left.r4btm.omTpl.preferredSize.width = 
					pal.grp.r5.outFolder.preferredSize.width = 
					pal.grp.r6.outName.preferredSize.width = 
					pal.grp.r4.r4left.r4top.rsTpl.preferredSize.width;
				pal.grp.r3.margins.left = pal.grp.r4.r4left.r4top.rsTpl.preferredSize.width + pal.grp.r2.spacing;
				
				pal.grp.r3.keepInActiveCam.preferredSize.width = pal.grp.r2.keepInUnsel.preferredSize.width;
				
				pal.grp.r4.r4left.r4btm.margins.top -= 5;
				pal.grp.cmds.margins.top += 5;
				
				pal.layout.layout(true);
				pal.grp.minimumSize = pal.grp.size;
				pal.layout.resize();
				pal.onResizing = pal.onResize = function () {this.layout.resize();}
				
				pal.grp.r1.layerRangeList.selection = 0;
				pal.grp.r1.layerRangeList.onChange = function ()
				{
					// Enable the Queue Only button only if using Work Area
					this.parent.parent.cmds.queueOnlyBtn.enabled = (this.selection == 0);
				}
				
				pal.grp.r4.refresh.onClick = function ()
				{
					rd_RenderLayers_doRefreshTemplates(this.parent.parent.parent);
				}
				pal.grp.r5.outFolderBrowse.onClick = function ()
				{
					var defaultFolder = this.parent.outFolderName.text;
					if ($.os.indexOf("Windows") != -1)				// On Windows, escape backslashes first
						defaultFolder = defaultFolder.replace("\\", "\\\\");
					
					var folder = Folder.selectDialog("Output To Folder", defaultFolder);
					if (folder != null)
						this.parent.outFolderName.text = folder.fsName;
				}
				
				pal.grp.header.help.onClick = function () {alert(rd_RenderLayersData.scriptTitle + "\n" + rd_RenderLayers_localize(rd_RenderLayersData.strHelpText), rd_RenderLayersData.scriptName);}
				pal.grp.cmds.queueOnlyBtn.onClick = function () {rd_RenderLayers_doRenderLayers(this.parent.parent, false);}
				pal.grp.cmds.renderBtn.onClick = function () {rd_RenderLayers_doRenderLayers(this.parent.parent, true);}
				
				pal.grp.cmds.margins.top += 5;
			}
			
			return pal;
		}
		
		
		
		
		// rd_RenderLayers_doRefreshTemplates()
		// 
		// Description:
		// This callback function rescans the render settings and output module templates,
		// updating the user interface.
		// 
		// Parameters:
		//   pal - Window object representing the palette.
		// 
		// Returns:
		// Nothing.
		// 
		function rd_RenderLayers_doRefreshTemplates(pal)
		{
			var activeComp = app.project.activeItem;
			
			if ((activeComp == null) || !(activeComp instanceof CompItem))
			{
				alert(rd_RenderLayers_localize(rd_RenderLayersData.strErrNoCompSel));
				return;
			}
			
			pal.grp.r4.r4left.r4top.rsTplList.selection = null;
			pal.grp.r4.r4left.r4top.rsTplList.removeAll();

			pal.grp.r4.r4left.r4btm.omTplList.selection = null;
			pal.grp.r4.r4left.r4btm.omTplList.removeAll();
			
			// Get the list of render settings and output module templates
			// (Need to add a dummy comp to the render queue to do this)
			var rqi = app.project.renderQueue.items.add(activeComp);
			var om = rqi.outputModule(1);								// Assumes at least one output module
			
			for (var i=0; i<rqi.templates.length; i++)
				if (rqi.templates[i].indexOf("_HIDDEN") != 0)			// Don't add hidden templates, like for X-Factor
					pal.grp.r4.r4left.r4top.rsTplList.add("item", rqi.templates[i]);
			for (var i=0; i<om.templates.length; i++)
				if (om.templates[i].indexOf("_HIDDEN") != 0)			// Don't add hidden templates, like for X-Factor
					pal.grp.r4.r4left.r4btm.omTplList.add("item", om.templates[i]);
			
			if (rqi.templates.length > 0)								// Select the first template in the list, if there is at least one
				pal.grp.r4.r4left.r4top.rsTplList.selection = 0;
			if (om.templates.length > 0)
				pal.grp.r4.r4left.r4btm.omTplList.selection = 0;
			
			rqi.remove();												// Remove the temp render queue item
		}
		
		
		
		
		// rd_RenderLayers_doRenderLayers()
		// 
		// Description:
		// This callback function performs the main operation of rendering each selected
		// layer.
		// 
		// Parameters:
		//   groupObj - Group object containing the controls in the panel.
		//   doRender - Boolean controlling if we should actually render or just add to the render queue.
		// 
		// Returns:
		// Nothing.
		//
		function rd_RenderLayers_doRenderLayers(groupObj, doRender)
		{
			var layerRange = groupObj.r1.layerRangeList.selection.index;
			var keepUnselLayers = groupObj.r2.keepInUnsel.value;
			var keepAdjLayers = groupObj.r2.keepInAdjust.value;
			var keepActiveCam = groupObj.r3.keepInActiveCam.value;
			var keepLights = groupObj.r3.keepInLights.value;
			var rsTpl = groupObj.r4.r4left.r4top.rsTplList.selection;
			var omTpl = groupObj.r4.r4left.r4btm.omTplList.selection;
			var outFolder = groupObj.r5.outFolderName.text;
			var outName = groupObj.r6.outNameTpl.text;
			
			// Encapsulate all operations into a single undo event
			app.beginUndoGroup(rd_RenderLayersData.scriptName);
			
			var comp = app.project.activeItem;
			
			// Confirm that we still have selected layers in the current comp
			if ((comp == null) || !(comp instanceof CompItem))
			{
				alert(rd_RenderLayers_localize(rd_RenderLayersData.strErrNoCompSel));
				return;
			}
			else if (comp.selectedLayers.length == 0)
			{
				alert(rd_RenderLayers_localize(rd_RenderLayersData.strErrNoLayerSel));
				return;
			}
			
			// Remember the on/off/selected states of the layers in the comp
			var layerStates = new Array();
			var selectedLayerIndices = new Array();
			var layer, state, layerIndex;
			
			for (var i=1; i<=comp.numLayers; i++)
			{
				layer = comp.layer(i);
				state = "";
				
				if (layer.hasVideo && layer.enabled)
					state += "v";
				if (layer.hasAudio && layer.audioEnabled)
					state += "a";
				if ((layer.property("zoom") != null) && layer.enabled)		// Camera layers (c = visible)
					state += "c";
				if ((layer.property("intensity") != null) && layer.enabled)	// Light layers (l = visible)
					state += "l";
				if (layer.adjustmentLayer && layer.enabled)					// Adjustment layers (j = visible)
					state += "j";
				if (layer.selected)
				{
					state += "s";
					selectedLayerIndices[selectedLayerIndices.length] = layer.index;
				}
				
				layerStates[layerStates.length] = state;
			}
			
			// Turn off any unselected layers, if not needing them for the render
			var noPrevCams = true;								// Switch to false once we encounter the first (active) camera
			
			if (!keepUnselLayers)
			{
				for (var i=0; i<layerStates.length; i++)
					if (layerStates[i].indexOf("s") == -1)		// Check if not selected
					{
						layer = comp.layer(i+1);
						
						// Skip turning off the active camera, lights, or adjustment layers, if enabled and requested to do so
						if ((layer.property("zoom") != null) && layer.enabled)
						{
							if (keepActiveCam && noPrevCams)
								continue;
							
							noPrevCams = false;					// Keep track of topmost cam
						}
						else if ((layer.property("intensity") != null) && layer.enabled && keepLights)
							continue;
						else if (layer.adjustmentLayer && layer.enabled && keepAdjLayers)
							continue;
						
						layer.enabled = false;
						layer.audioEnabled = false;
					}
			}
			
			// Turn off all selected layers (in preparation for the per-layer rendering to come)
			for (var i=0; i<selectedLayerIndices.length; i++)
			{
				comp.layer(selectedLayerIndices[i]).enabled = false;
				comp.layer(selectedLayerIndices[i]).audioEnabled = false;
			}
			
			// Remember the states of all renderable render queue items; turning off any that are to render
			var rq = app.project.renderQueue;
			var rqiStates = new Array();
			
			for (var i=1; i<=rq.numItems; i++)
				if (rq.item(i).render && (rq.item(i).status == RQItemStatus.QUEUED))
				{
					rqiStates[rqiStates.length] = i;
					rq.item(i).render = false;
				}
			
			// Remember the current work area, in case it gets reset during rendering
			var workAreaStart = comp.workAreaStart;
			var workAreaDuration = comp.workAreaDuration;
			
			// Set the work area to the full comp (if needed)
			if (layerRange == 1)								// Entire Composition
			{
				comp.workAreaStart = 0;
				comp.workAreaDuration = comp.duration - 0.001;	// Seems to need some slop to avoid workAreaDuration range errors...odd
			}
			
			// Process each selected layer
			var rqi, om, outFName;
			var rangeIn, rangeOut;
			
			for (var i=0; i<selectedLayerIndices.length; i++)
			{
				layerIndex = selectedLayerIndices[i];
				layer = comp.layer(layerIndex);
				
				// If layer is out of range of the comp, skip it
				if (layer.stretch > 0)
				{
					if ((layer.outPoint < 0) || (layer.inPoint > comp.duration))
						continue;
				}
				else
				{
					if ((layer.inPoint < 0) || (layer.outPoint > comp.duration))
						continue;
				}
				
				// Enable the current layer
				if (layerStates[layerIndex-1].indexOf("v") != -1)
					layer.enabled = true;
				if (layerStates[layerIndex-1].indexOf("a") != -1)
					layer.audioEnabled = true;
				
				// Set the comp work area to the layer range (if needed)
				if (layerRange == 2)							// Layer In/Out Range
				{
					if (layer.stretch > 0)
					{
						rangeIn = (layer.inPoint < 0) ? 0 : layer.inPoint;
						rangeOut = (layer.outPoint > comp.duration) ? comp.duration : layer.outPoint;
					}
					else
					{
						rangeIn = (layer.outPoint < 0) ? 0 : layer.outPoint;
						rangeOut = (layer.inPoint > comp.duration) ? comp.duration : layer.inPoint;
					}
					
					comp.workAreaStart = 0;						// Set to min size first, then resize -- to avoid problems setting range
					comp.workAreaDuration = comp.frameDuration;
	/*
	$.writeln(rangeIn+" to "+rangeOut+" (dur: "+(rangeOut-rangeIn)+")");
	$.writeln("  comp: 0 to "+comp.duration);
	$.writeln("  workAreaStart="+comp.workAreaStart+", workAreaDuration="+comp.workAreaDuration+", frameDuration="+comp.frameDuration);
	$.writeln("  workAreaDiff-rangeDiff="+(workAreaDuration-(rangeOut-rangeIn)));
	*/
					
					comp.workAreaStart = rangeIn;
					comp.workAreaDuration = parseInt((rangeOut - rangeIn) * 1000) / 1000;
				}
				
				
				// Add comp to the render queue
				rqi = rq.items.add(comp);
				
				// Set templates and output file name
				rqi.applyTemplate(rsTpl);
				om = rqi.outputModule(1);
				om.applyTemplate(omTpl);
				
				outFName = outName;
				outFName = outFName.replace("[layerName]", layer.name);
				outFName = outFName.replace("[layerNumber]", layer.index);
				om.file = new File(outFolder + "/" + outFName);
				
				// Render (if actually clicked Render)
				if (doRender)
					app.project.renderQueue.render();
				
				// Remove render queue item
				//rqi.remove();
				
				// Disable the current layer
				layer.enabled = false;
				layer.audioEnabled = false;
			}
			
			// Restore the work area (if modified)
			if (layerRange != 0)								// Entire Composition or Layer In/Out Range
			{
				comp.workAreaStart = 0;							// Set to max size first, then shrink down -- to avoid problems setting range
	//			comp.workAreaDuration = parseInt(comp.frameDuration * 1000) / 1000;
				
				comp.workAreaStart = workAreaStart;
				comp.workAreaDuration = workAreaDuration;
			}
			
			// Restore any forceably unqueued render queue items
			for (var i=0; i<rqiStates.length; i++)
				rq.item(rqiStates[i]).render = true;
			
			// Restore any selected layers
			for (var i=0; i<selectedLayerIndices.length; i++)
			{
				layerIndex = selectedLayerIndices[i];
				if (layerStates[layerIndex-1].indexOf("v") != -1)
					comp.layer(layerIndex).enabled = true;
				if (layerStates[layerIndex-1].indexOf("a") != -1)
					comp.layer(layerIndex).audioEnabled = true;
			}
			
			// Restore any unselected layers, if previously turned off
			if (!keepUnselLayers)
			{
				for (var i=0; i<layerStates.length; i++)
					if (layerStates[i].indexOf("s") == -1)		// Check if not selected
					{
						layer = comp.layer(i+1);
						
						if ((layerStates[i].indexOf("v") != -1) || (layerStates[i].indexOf("c") != -1) || (layerStates[i].indexOf("l") != -1) || (layerStates[i].indexOf("j") != -1))
							layer.enabled = true;
						if (layerStates[i].indexOf("a") != -1)
							layer.audioEnabled = true;
					}
			}
			
			app.endUndoGroup();
			
			// Purge the undo cache to work around an issue with changing a layer or undoing after a render
			app.purge(PurgeTarget.UNDO_CACHES);
		}
		
		
		
		
		// main code:
		//
		
		// Prerequisites check
		if (parseFloat(app.version) < 8.0)
			alert(rd_RenderLayers_localize(rd_RenderLayersData.strMinAE80), rd_RenderLayersData.scriptName);
		else
		{
			var activeComp = app.project.activeItem;
			
			// Don't show the palette if no comp is active
			if ((activeComp == null) || !(activeComp instanceof CompItem))
				alert(rd_RenderLayers_localize(rd_RenderLayersData.strErrNoCompSel));
			else if (activeComp.selectedLayers.length == 0)
				alert(rd_RenderLayers_localize(rd_RenderLayersData.strErrNoLayerSel));
			else
			{
				// Build and show the palette
				var rdrlPal  = rd_RenderLayers_buildUI(thisObj);
				if (rdrlPal != null)
				{
					// Get the list of render settings and output module templates
					rd_RenderLayers_doRefreshTemplates(rdrlPal);
					
					if (rdrlPal instanceof Window)
					{
						// Show the palette
						rdrlPal.center();
						rdrlPal.show();
					}
					else
						rdrlPal.layout.layout(true);
				}
			}
		}
	}
	
	
	rd_RenderLayers(this);
}
