/* 

名称: 图层切片分裂
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
	function rd_Slicer(thisObj)
	{
		// Globals
		
		var rd_SlicerData = new Object();	// Store globals in an object
		rd_SlicerData.scriptName = "图层切片分裂";
		rd_SlicerData.scriptTitle = rd_SlicerData.scriptName + " v1.0";
		
		rd_SlicerData.strRows = {en: "整行:"};
		rd_SlicerData.strCols = {en: "整列:"};
		rd_SlicerData.strMargin = {en: "间距:"}
		rd_SlicerData.strRoundness = {en: "圆角:"};
		rd_SlicerData.strParentNull = {en: "创建空物体作为其父物体"};
		rd_SlicerData.strUseAlphaAdd = {en: "生成alpha通道叠加方式"};
		rd_SlicerData.strSlice = {en: "生成阵列"};
		rd_SlicerData.strHelp = {en: "帮助"}
		rd_SlicerData.strErrNoCompSel = {en: "无法执行操作。 请在“项目”面板中选择或打开一个合成，然后重试."};
		rd_SlicerData.strErrNoSingleAVLayerSel = {en: "无法执行操作。 请选择单个视频或固定图层，然后重试."};
		rd_SlicerData.strMinAE80 = {en: "此脚本需要Adobe After Effects CS3或更高版本."};
		rd_SlicerData.strHelpText = 
		{
			en: "Copyright (c) 2006-2007 redefinery (Jeffrey R. Almasol). \n" +
			"All rights reserved.\n" +
			"\n" +
			"该脚本能够将图层添加蒙版进行切割，并且是分层形式，可以将画面快速整切。\n" +
			"\n" +
			"2020.6.24 by 视效网."
		};
		
		
		
		
		// rd_Slicer_localize()
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
		function rd_Slicer_localize(strVar)
		{
			return strVar["en"];
		}
		
		
		
		
		// rd_Slicer_buildUI()
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
		function rd_Slicer_buildUI(thisObj)
		{
			function rd_Slicer_limitNum(src, minVal, maxVal)
			{
				var value = parseInt(src.text);
				
				if (isNaN(value) || (value < minVal))
					value = minVal;
				else if (value > maxVal)
					value = maxVal;
				src.text = value.toString();
			}
			
			var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_SlicerData.scriptName, undefined, {resizeable:true});
			
			if (pal != null)
			{
				var res = 
				"group { \
					orientation:'column', alignment:['fill','top'], \
					header: Group { \
						alignment:['fill','top'], \
						title: StaticText { text:'" + rd_SlicerData.scriptName + "', alignment:['fill','center'] }, \
						help: Button { text:'" + rd_Slicer_localize(rd_SlicerData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
					}, \
					r1: Group { \
						alignment:['fill','top'], \
						rowsLbl: StaticText { text:'" + rd_Slicer_localize(rd_SlicerData.strRows) + "' }, \
						rows: EditText { text:'4', characters:4 }, \
						gap: StaticText { text:'  ' }, \
						marginLbl: StaticText { text:'" + rd_Slicer_localize(rd_SlicerData.strMargin) + "' }, \
						margin: EditText { text:'0', characters:4 }, \
					}, \
					r2: Group { \
						alignment:['fill','top'], \
						colsLbl: StaticText { text:'" + rd_Slicer_localize(rd_SlicerData.strCols) + "' }, \
						cols: EditText { text:'3', characters:4 }, \
						gap: StaticText { text:'  ' }, \
						roundnessLbl: StaticText { text:'" + rd_Slicer_localize(rd_SlicerData.strRoundness) + "' }, \
						roundness: EditText { text:'0', characters:4 }, \
					}, \
					useAlphaAdd: Checkbox { text:'" + rd_Slicer_localize(rd_SlicerData.strUseAlphaAdd) + "', value:true, alignment:['left','top'] }, \
					parentToNull: Checkbox { text:'" + rd_Slicer_localize(rd_SlicerData.strParentNull) + "', value:true, alignment:['left','top'] }, \
					cmds: Group { \
						alignment:['right','top'], \
						sliceBtn: Button { text:'" + rd_Slicer_localize(rd_SlicerData.strSlice) + "' }, \
					}, \
				}";
				pal.grp = pal.add(res);
				
				// Workaround to ensure the edittext text color is black, even at darker UI brightness levels
				var winGfx = pal.graphics;
				var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0,0,0], 1);
				pal.grp.r1.rows.graphics.foregroundColor = darkColorBrush;
				pal.grp.r1.margin.graphics.foregroundColor = darkColorBrush;
				pal.grp.r2.cols.graphics.foregroundColor = darkColorBrush;
				pal.grp.r2.roundness.graphics.foregroundColor = darkColorBrush;
				
				pal.grp.r2.margins.top = -5;
				
				pal.grp.r2.colsLbl.preferredSize.width = pal.grp.r1.rowsLbl.preferredSize.width;
				pal.grp.r1.marginLbl.preferredSize.width = pal.grp.r2.roundnessLbl.preferredSize.width;
				
				pal.layout.layout(true);
				pal.grp.minimumSize = pal.grp.size;
				pal.layout.resize();
				pal.onResizing = pal.onResize = function () {this.layout.resize();}
				
				pal.grp.r1.rows.onChange = function () {rd_Slicer_limitNum(pal.grp.r1.rows, 1, 999);};
				pal.grp.r2.cols.onChange = function () {rd_Slicer_limitNum(pal.grp.r2.cols, 1, 999);};
				pal.grp.r1.margin.onChange = function () {rd_Slicer_limitNum(pal.grp.r1.margin, 0, 999);};
				pal.grp.r2.roundness.onChange = function () {rd_Slicer_limitNum(pal.grp.r2.roundness, 0, 100);};
				
				pal.grp.header.help.onClick = function () {alert(rd_SlicerData.scriptTitle + "\n" + rd_Slicer_localize(rd_SlicerData.strHelpText), rd_SlicerData.scriptName);}
				pal.grp.cmds.sliceBtn.onClick = rd_Slicer_doSliceLayer;
			}
			
			return pal;
		}
		
		
		
		
		// rd_Slicer_doSliceLayer()
		// 
		// Description:
		// This function performs the actual slicing of the selected layer.
		// 
		// Parameters:
		// None.
		// 
		// Returns:
		// Nothing.
		//
		function rd_Slicer_doSliceLayer()
		{
			// Check that a project exists
			if (app.project == null)
				return;
			
			// Get the current (active/frontmost) comp
			var comp = app.project.activeItem;
			
			if ((comp == null) || !(comp instanceof CompItem))
			{
				alert(rd_Slicer_localize(rd_SlicerData.strErrNoCompSel), rd_SlicerData.scriptName);
				return;
			}
			
			// If no single layer is selected, nothing to do
			if (comp.selectedLayers.length != 1)
			{
				alert(rd_Slicer_localize(rd_SlicerData.strErrNoSingleAVLayerSel), rd_SlicerData.scriptName);
				return;
			}
			
			var layer = comp.selectedLayers[0];
			
			// If no single AV layer is selected, nothing to do
			if (!(layer instanceof AVLayer))
			{
				alert(rd_Slicer_localize(rd_SlicerData.strErrNoSingleAVLayerSel), rd_SlicerData.scriptName);
				return;
			}
			
			var rows = parseInt(this.parent.parent.r1.rows.text);
			var cols = parseInt(this.parent.parent.r2.cols.text);
			var margin = parseInt(this.parent.parent.r1.margin.text);
			var roundness = parseInt(this.parent.parent.r2.roundness.text);
			
			var useAlphaAdd = this.parent.parent.useAlphaAdd.value;
			var parentToNull = this.parent.parent.parentToNull.value;
			
			// Slice the layer
			app.beginUndoGroup(rd_SlicerData.scriptName);
			
			var layerPos = layer.position.value;
			var layerAPt = layer.anchorPoint.value;
			var layerScale = layer.scale.value;
			var layerWidth = layer.width;
			var layerHeight = layer.height;
			
			var halfLength = (((layerWidth < layerHeight) ? (layerWidth / 2) : (layerHeight / 2)) - margin * 2) * roundness / 200;
			
			var maxCoordsStr = (" (" + rows.toString() + "," + cols.toString() + ")").length;	// Max length of the coordinates string
			
			var cellWidth = layerWidth / cols;
			var cellHeight = layerHeight / rows;
			var currX = 0;
			var currY = 0;
			var currCell, mask, s;
			
			var compAdjLayerWidth = layerWidth * layerScale[0] / 100 * layer.source.pixelAspect / comp.pixelAspect;
			var compAdjLayerHeight = layerHeight * layerScale[1] / 100;
			var compAdjOffsetX = compAdjLayerWidth / cols;
			var compAdjOffsetY = compAdjLayerHeight / rows;
			var compAdjCurrX = compAdjOffsetX / 2 - (layerAPt[0] * layerScale[0] / 100 * layer.source.pixelAspect / comp.pixelAspect - layerPos[0]);
			var compAdjCurrY = compAdjOffsetY / 2 - (layerAPt[1] * layerScale[1] / 100 - layerPos[1]);
			
			// Create null, if requested, above the selected layer
			if (parentToNull)
			{
				var parentNull = comp.layers.addNull(comp.duration);
				parentNull.name = layer.name.substr(0,31-(" Slices").length) + " Slices";
				parentNull.moveBefore(layer);
				parentNull.position.setValue(layerPos);
			}
			
			// Iterate over the rows and columns of the grid
			for (var r=1; r<=rows; r++)
			{
				for (var c=1; c<=cols; c++)
				{
					// Duplicate the layer, name it after the grid coordinates, and place the dupe just above the original layer
					currCell = layer.duplicate();
					currCell.name = layer.name.substr(0,31-maxCoordsStr) + " (" + r.toString() + "," + c.toString() + ")";
					currCell.moveBefore(layer);
					
					// Trim the cell using a mask
					mask = currCell.property("Masks").addProperty("Mask");
					if (mask != null)
					{
						s = new Shape();
						if (s != null)
						{
							if ((margin == 0) && (roundness == 0))		// Simplify the vertices for non-rounded corners
							{
								s.vertices = [ 
									[currX + margin, currY + margin],								// UL
									[currX + cellWidth - margin, currY + margin],					// UR
									[currX + cellWidth - margin, currY + cellHeight - margin],	// BR
									[currX + margin, currY + cellHeight - margin]					// BL
								];
							}
							else
							{
								s.vertices = [ 
									[currX + margin, currY + margin + halfLength],								// UL
									[currX + margin + halfLength, currY + margin],								// UL
									[currX + cellWidth - margin - halfLength, currY + margin],					// UR
									[currX + cellWidth - margin, currY + margin + halfLength],					// UR
									[currX + cellWidth - margin, currY + cellHeight - margin - halfLength],	// LR
									[currX + cellWidth - margin - halfLength, currY + cellHeight - margin],	// LR
									[currX + margin + halfLength, currY + cellHeight - margin],					// LL
									[currX + margin, currY + cellHeight - margin - halfLength]					// LL
								];
								
								s.inTangents = [
									[0, 0],				// UL
									[-halfLength/2, 0],	// UL
									[0, 0],				// UR
									[0, -halfLength/2],	// UR
									[0, 0],				// LR
									[halfLength/2, 0],	// LR
									[0, 0],				// LL
									[0, halfLength/2]		// LL
								];
								
								s.outTangents = [
									[0, -halfLength/2],	// UL
									[0, 0],				// UL
									[halfLength/2, 0],	// UR
									[0, -halfLength/2],	// UR
									[0, halfLength/2],	// LR
									[0, 0],				// LR
									[-halfLength/2, 0],	// LL
									[0, 0]					// LL
								];
							}
							s.closed = true;
							
							mask.property("maskShape").setValue(s);
						}
					}
					//$.writeln("row "+r+", col "+c+": center="+currX+","+currY);
					
					// Center the anchor point
					currCell.anchorPoint.setValue([currX + cellWidth / 2, currY + cellHeight / 2]);
					currCell.position.setValue([compAdjCurrX, compAdjCurrY]);
					
					// Change blending mode to Alpha Add, if requested
					if (useAlphaAdd)
						currCell.blendingMode = BlendingMode.ALPHA_ADD;
					
					// Attach to parent null, if requested
					if (parentToNull)
						currCell.parent = parentNull;
					
					// Move to next column position
					currX += cellWidth;
					compAdjCurrX += compAdjOffsetX;
				}
				
				// Move to first column position of next row
				currX = 0;
				currY += cellHeight;
				compAdjCurrX = compAdjOffsetX / 2 - (layerAPt[0] * layerScale[0] / 100 * layer.source.pixelAspect / comp.pixelAspect - layerPos[0]);
				compAdjCurrY += compAdjOffsetY;
			}
			
			// Mute the original layer
			layer.enabled = false;
			
			app.endUndoGroup();
		}
		
		
		
		
		// main code:
		//
		
		if (parseFloat(app.version) < 8.0)
			alert(rd_Slicer_localize(rd_SlicerData.strMinAE80), rd_SlicerData.scriptName);
		else
		{
			// Build and show the console's floating palette
			var rdsPal = rd_Slicer_buildUI(thisObj);
			if (rdsPal != null)
			{
				// Update UI values, if saved in the settings
				if (app.settings.haveSetting("redefinery", "rd_Slicer_rows"))
					rdsPal.grp.r1.rows.text = parseInt(app.settings.getSetting("redefinery", "rd_Slicer_rows")).toString();
				if (app.settings.haveSetting("redefinery", "rd_Slicer_cols"))
					rdsPal.grp.r2.cols.text = parseInt(app.settings.getSetting("redefinery", "rd_Slicer_cols")).toString();
				if (app.settings.haveSetting("redefinery", "rd_Slicer_margin"))
					rdsPal.grp.r1.margin.text = parseInt(app.settings.getSetting("redefinery", "rd_Slicer_margin")).toString();
				if (app.settings.haveSetting("redefinery", "rd_Slicer_roundness"))
					rdsPal.grp.r2.roundness.text = parseInt(app.settings.getSetting("redefinery", "rd_Slicer_roundness")).toString();
				if (app.settings.haveSetting("redefinery", "rd_Slicer_useAlphaAdd"))
					rdsPal.grp.useAlphaAdd.value = !(app.settings.getSetting("redefinery", "rd_Slicer_useAlphaAdd") == "false");
				if (app.settings.haveSetting("redefinery", "rd_Slicer_parentToNull"))
					rdsPal.grp.parentToNull.value = !(app.settings.getSetting("redefinery", "rd_Slicer_parentToNull") == "false");
				
				// Save current UI settings upon closing the palette
				rdsPal.onClose = function()
				{
					app.settings.saveSetting("redefinery", "rd_Slicer_rows", rdsPal.grp.r1.rows.text);
					app.settings.saveSetting("redefinery", "rd_Slicer_cols", rdsPal.grp.r2.cols.text);
					app.settings.saveSetting("redefinery", "rd_Slicer_margin", rdsPal.grp.r1.margin.text);
					app.settings.saveSetting("redefinery", "rd_Slicer_roundness", rdsPal.grp.r2.roundness.text);
					app.settings.saveSetting("redefinery", "rd_Slicer_useAlphaAdd", rdsPal.grp.useAlphaAdd.value);
					app.settings.saveSetting("redefinery", "rd_Slicer_parentToNull", rdsPal.grp.parentToNull.value);
				}
				
				if (rdsPal instanceof Window)
				{
					// Show the palette
					rdsPal.center();
					rdsPal.show();
				}
				else
					rdsPal.layout.layout(true);
			}
		}
	}
	
	
	rd_Slicer(this);
}
