/* 

名称: 图层排序
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
	function rd_KindaSorta(thisObj)
	{
		// Globals
		
		var rd_KindaSortaData = new Object();	// Store globals in an object
		rd_KindaSortaData.scriptName = "图层排序";
		rd_KindaSortaData.scriptTitle = rd_KindaSortaData.scriptName + " v1.2";
		
		rd_KindaSortaData.strAffect = {en: "影响:"};
		rd_KindaSortaData.strAffectOpts = {en: '["合成中的所有层", "合成中选择的层"]'};
		rd_KindaSortaData.strOrderBy = {en: "顺序选择:"};
		rd_KindaSortaData.strOrderByOpts = {en: '["随机排序", "选择的顺序", "入点", "出点", "层名字", "层Z轴位置"]'};
		rd_KindaSortaData.strReversed = {en: "反转排序"};
		rd_KindaSortaData.strSort = {en: "确定"};
		rd_KindaSortaData.strHelp = {en: "帮助"}
		rd_KindaSortaData.strErrNoCompSel = {en: "Cannot perform operation. Please select or open a single composition in the Project panel, and try again."};
		rd_KindaSortaData.strErrNoLayerSel = {en: "Cannot perform operation. Please select at least one layer, and try again."};
		rd_KindaSortaData.strMinAE80 = {en: "This script requires Adobe After Effects CS3 or later."};
		rd_KindaSortaData.strHelpText = 
		{
			en: "脚本使用方法自行摸索，超简单的。 \n" +
			"by视效网.2020.6.24."
		};
		
		
		
		
		// rd_KindaSorta_localize()
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
		function rd_KindaSorta_localize(strVar)
		{
			return strVar["en"];
		}
		
		
		
		
		// rd_KindaSorta_buildUI()
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
		function rd_KindaSorta_buildUI(thisObj)
		{
			var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_KindaSortaData.scriptName, undefined, {resizeable:true});
			
			if (pal != null)
			{
				var res = 
				"group { \
					orientation:'column', alignment:['fill','top'], \
					header: Group { \
						alignment:['fill','top'], \
						title: StaticText { text:'" + rd_KindaSortaData.scriptName + "', alignment:['fill','center'] }, \
						help: Button { text:'" + rd_KindaSorta_localize(rd_KindaSortaData.strHelp) +"', maximumSize:[30,20], alignment:['right','center'] }, \
					}, \
					r1: Group { \
						alignment:['fill','top'], \
						affect: StaticText { text:'" + rd_KindaSorta_localize(rd_KindaSortaData.strAffect) + "' }, \
						affectOpts: DropDownList { properties:{items:" + rd_KindaSorta_localize(rd_KindaSortaData.strAffectOpts) + "}, alignment:['fill','top'] }, \
					}, \
					r2: Group { \
						alignment:['fill','top'], \
						orderBy: StaticText { text:'" + rd_KindaSorta_localize(rd_KindaSortaData.strOrderBy) + "' }, \
						orderByOpts: DropDownList { properties:{items:" + rd_KindaSorta_localize(rd_KindaSortaData.strOrderByOpts) + "}, alignment:['fill','top'] }, \
					}, \
					r3: Group { \
						alignment:['left','top'], \
						reverse: Checkbox { text:'" + rd_KindaSorta_localize(rd_KindaSortaData.strReversed) + "' }, \
					}, \
					cmds: Group { \
						alignment:['right','top'], \
						sortBtn: Button { text:'" + rd_KindaSorta_localize(rd_KindaSortaData.strSort) + "' }, \
					}, \
				}";
				pal.grp = pal.add(res);
				
				// Workaround to ensure the edittext text color is black, even at darker UI brightness levels
				var winGfx = pal.graphics;
				var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0,0,0], 1);
				pal.grp.r1.affectOpts.graphics.foregroundColor = darkColorBrush;
				pal.grp.r2.orderByOpts.graphics.foregroundColor = darkColorBrush;
				
				pal.grp.r1.affect.preferredSize.width = pal.grp.r2.orderBy.preferredSize.width;
				pal.grp.r3.indent = pal.grp.r2.orderBy.preferredSize.width + pal.grp.r2.spacing;
				pal.grp.r3.margins.top -= 5;
				
				pal.layout.layout(true);
				pal.grp.minimumSize = pal.grp.size;
				pal.layout.resize();
				pal.onResizing = pal.onResize = function () {this.layout.resize();}
				
				pal.grp.r1.affectOpts.selection = 0;
				pal.grp.r2.orderByOpts.selection = 1;
				
				pal.grp.r2.orderByOpts.onChange = function ()
				{
					if (this.selection.index == 0)
					{
						// If using Random Order, disable Reversed order option
						this.parent.parent.r3.reverse.value = false;
						this.parent.parent.r3.reverse.enabled = false;
					}
					else
					{
						this.parent.parent.r3.reverse.enabled = true;
						if (this.selection.index == 1)
						{
							// If using Selected Order, switch Affect to Selected Layers in Comp
							this.parent.parent.r1.affectOpts.selection = 1;
						}
					}
				}
				
				pal.grp.header.help.onClick = function () {alert(rd_KindaSortaData.scriptTitle + "\n" + rd_KindaSorta_localize(rd_KindaSortaData.strHelpText), rd_KindaSortaData.scriptName);}
				pal.grp.cmds.sortBtn.onClick = rd_KindaSorta_doKindaSorta;
			}
			
			return pal;
		}
		
		
		
		
		// rd_KindaSorta_doKindaSorta()
		// 
		// Description:
		// This function performs the actual sorting.
		// 
		// Parameters:
		// None.
		// 
		// Returns:
		// Nothing.
		//
		function rd_KindaSorta_doKindaSorta()
		{
			function rd_KindaSorta_sortByInPoint(a, b)
			{
				var aIn = (a.stretch < 0) ? a.outPoint : a.inPoint;
				var bIn = (b.stretch < 0) ? b.outPoint : b.inPoint;
				return (aIn - bIn);
			}
			
			function rd_KindaSorta_sortByOutPoint(a, b)
			{
				var aOut = (a.stretch < 0) ? a.inPoint : a.outPoint;
				var bOut = (b.stretch < 0) ? b.inPoint : b.outPoint;
				return (aOut - bOut);
			}
			
			function rd_KindaSorta_sortByLayerName(a, b)
			{
				if (a.name < b.name)
					return -1;
				else if (a.name > b.name)
					return 1;
				else
					return 0;
			}
			
			function rd_KindaSorta_sortByLayerZPos(a, b)
			{
				if (a.position.value[2] < b.position.value[2])
					return -1;
				else if (a.position.value[2] > b.position.value[2])
					return 1;
				else
					return 0;
			}
			
			// Check that a project exists
			if (app.project == null)
				return;
			
			// Get the current (active/frontmost) comp
			var comp = app.project.activeItem;
			
			if ((comp == null) || !(comp instanceof CompItem))
			{
				alert(rd_KindaSorta_localize(rd_KindaSortaData.strErrNoCompSel), rd_KindaSortaData.scriptName);
				return;
			}
			
			var affect = this.parent.parent.r1.affectOpts.selection.index;
			var orderBy = this.parent.parent.r2.orderByOpts.selection.index;
			var reverse = this.parent.parent.r3.reverse.value;
			
			// If no layers are selected (and using selected layers), nothing to do
			if ((affect == 1) && (comp.selectedLayers.length == 0))
			{
				alert(rd_KindaSorta_localize(rd_KindaSortaData.strErrNoLayerSel), rd_KindaSortaData.scriptName);
				return;
			}
			
			// Determine layers to process
			var layers = new Array();
			if (affect == 0)			// All Layers in Comp
			{
				// Assign layers to a 0-based array
				for (var i=1; i<=comp.numLayers; i++)
					layers[layers.length] = comp.layer(i);
			}
			else if (affect == 1)		// Selected Layers in Comp
			{
				if (orderBy != 1)		// if not using Selected Order for reordering, capture from top to bottom
				{
					// Capture selected layers from top to bottom
					for (var i=1; i<=comp.numLayers; i++)
						if (comp.layer(i).selected)
							layers[layers.length] = comp.layer(i);
				}
				else							// otherwise, capture selected order directly
				{
					for (var i=0; i<comp.selectedLayers.length; i++)
						layers[layers.length] = comp.selectedLayers[i];
				}
			}
			
			// Sort the layers
			app.beginUndoGroup(rd_KindaSortaData.scriptName);
			
			if (orderBy == 0)			// Random Order
			{
				var lIndex;
				for (var i=0; i<layers.length; i++)
				{
					do {
						lIndex = 1 + Math.round(Math.random() * (comp.numLayers - 1));
					} while (lIndex == layers[i].index);
					if (Math.random() > 0.5)
						layers[i].moveBefore(comp.layer(lIndex));
					else
						layers[i].moveAfter(comp.layer(lIndex));
				}
			}
			else
			{
				if (orderBy == 1)	// Selected Order
				{
				}
				else if (orderBy == 2)	// In Point
				{
					layers.sort(rd_KindaSorta_sortByInPoint);
				}
				else if (orderBy == 3)	// Out Point
				{
					layers.sort(rd_KindaSorta_sortByOutPoint);
				}
				else if (orderBy == 4)	// Layer Name
				{
					layers.sort(rd_KindaSorta_sortByLayerName);
				}
				else if (orderBy == 5)	// Layer Z Position
				{
					layers.sort(rd_KindaSorta_sortByLayerZPos);
				}
				
				// Reverse layers?
				if (reverse)
				{
					for (var i=0; i<layers.length; i++)
						layers[i].moveToBeginning();
				}
				else
				{
					for (var i=layers.length-1; i>=0; i--)
						layers[i].moveToBeginning();
				}
			}
			
			app.endUndoGroup();
		}
		
		
		
		
		// main code:
		//
		
		// Prerequisites check
		if (parseFloat(app.version) < 8.0)
			alert(rd_KindaSorta_localize(rd_KindaSortaData.strMinAE80), rd_KindaSortaData.scriptName);
		else
		{
			// Build and show the console's floating palette
			var rdksPal = rd_KindaSorta_buildUI(thisObj);
			if (rdksPal != null)
			{
				// Update UI values, if saved in the settings
				if (app.settings.haveSetting("redefinery", "rd_KindaSorta_affectOpts"))
					rdksPal.grp.r1.affectOpts.selection = parseInt(app.settings.getSetting("redefinery", "rd_KindaSorta_affectOpts"));
				if (app.settings.haveSetting("redefinery", "rd_KindaSorta_orderByOpts"))
					rdksPal.grp.r2.orderByOpts.selection = parseInt(app.settings.getSetting("redefinery", "rd_KindaSorta_orderByOpts"));
				if (app.settings.haveSetting("redefinery", "rd_KindaSorta_reverse"))
					rdksPal.grp.r3.reverse.value = !(app.settings.getSetting("redefinery", "rd_KindaSorta_reverse") == "false");
				if (rdksPal.grp.r2.orderByOpts.selection.index == 0)
				{
					// If using Random Order, disable Reversed order option
					rdksPal.grp.r3.reverse.value = false;
					rdksPal.grp.r3.reverse.enabled = false;
				}
				else if (rdksPal.grp.r2.orderByOpts.selection == 1)
				{
					// If using Selected Order, switch Affect to Selected Layers in Comp
					rdksPal.grp.r1.affectOpts.selection = 1;
				}
				
				// Save current UI settings upon closing the palette
				rdksPal.onClose = function()
				{
					app.settings.saveSetting("redefinery", "rd_KindaSorta_affectOpts", rdksPal.grp.r1.affectOpts.selection.index);
					app.settings.saveSetting("redefinery", "rd_KindaSorta_orderByOpts", rdksPal.grp.r2.orderByOpts.selection.index);
					app.settings.saveSetting("redefinery", "rd_KindaSorta_reverse", rdksPal.grp.r3.reverse.value);
				}
				
				if (rdksPal instanceof Window)
				{
					// Show the palette
					rdksPal.center();
					rdksPal.show();
				}
				else
					rdksPal.layout.layout(true);
			}
		}
	}
	
	
	rd_KindaSorta(this);
}
