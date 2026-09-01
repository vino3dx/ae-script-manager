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
	//
	function rd_Movement(thisObj)
	{
		// Globals
		
		var rd_MovementData = new Object();	// Store globals in an object
		rd_MovementData.scriptName = "时间轴精确定位";
		rd_MovementData.scriptTitle = rd_MovementData.scriptName + " v2.0";
		
		rd_MovementData.numFaves = 7;			// Number of favorite buttons
		rd_MovementData.minCompSecs = 0;		// Minimum and maximum number of seconds that we can jump to for a comp
		rd_MovementData.maxCompSecs = 10800;
		
		rd_MovementData.strRew = {en: "<<"};
		rd_MovementData.strPrev = {en: "<"};
		rd_MovementData.strNext = {en: ">"};
		rd_MovementData.strFwd = {en: ">>"};
		rd_MovementData.strFavorites = {en: "收藏夹"};
		rd_MovementData.strTimeSet = {en: "v"};
		rd_MovementData.strHelp = {en: "?"};
		rd_MovementData.strErrNoCompSel = {en: "无法执行操作。 请在“项目”窗口中选择或打开一个合成，然后重试."};
		rd_MovementData.strMinAE80 = {en: "此脚本需要Adobe After Effects CS3或更高版本."};
//		rd_MovementData.strHelpText = 
		{
			en: "Copyright (c) 2006-2007 redefinery (Jeffrey R. Almasol). \n" +
			"All rights reserved.\n" +
			"\n" +
			"This script displays a palette with controls for jumping to different times in the composition. There are buttons for jumping a specific number of frames forward or back from the current time, as well as 7 favorite buttons for capturing different times (set from the current time) and jumping to them easily.\n" +
			"\n" +
			"Change the frame offsets by entering new values in any of the four fields.\n" +
			"\n" +
			"For the favorites buttons, captured times are in seconds. Also, although you can capture negative time values, After Effects restricts the minimum time value to 0 seconds (start of the composition); the maximum time is 10,800 seconds.\n" +
			"\n" +
			"Your frame offsets and captured time favorites are saved as settings for use in subsequent sessions.\n" +
			"\n" +
			"Note: This version of the script requires After Effects CS3 or later. It can be used as a dockable panel by placing the script in a ScriptUI Panels subfolder of the Scripts folder, and then choosing this script from the Window menu.\n" +
			"\n" +
			"Originally requested by Scott Hudziak at DIGITALKITCHEN.\n"
		};
		
		
		
		
		// rd_Movement_localize()
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
		function rd_Movement_localize(strVar)
		{
			return strVar["en"];
		}
		
		
		
		
		// rd_Movement_buildUI()
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
		function rd_Movement_buildUI(thisObj)
		{
			var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_MovementData.scriptName, undefined, {resizeable:true});
			
			if (pal != null)
			{
				var res = 
				"group { \
					orientation:'column', alignment:['fill','top'], \
					header: Group { \
						alignment:['fill','top'], \
						title: StaticText { text:'" + rd_MovementData.scriptName + "', alignment:['fill','center'] }, \
						help: Button { text:'" + rd_Movement_localize(rd_MovementData.strHelp) +"', maximumSize:[0,0], alignment:['right','center'] }, \
					}, \
					flds: Group { \
						alignment:['fill','top'], \
						rewVal: EditText { text:'10', alignment:['fill','top'], justify:'center' }, \
						prevVal: EditText { text:'1', alignment:['fill','top'], justify:'center' }, \
						nextVal: EditText { text:'1', alignment:['fill','top'], justify:'center' }, \
						fwdVal: EditText { text:'10', alignment:['fill','top'], justify:'center' }, \
					}, \
					btns: Group { \
						alignment:['fill','top'], \
						rew: Button { text:'" + rd_Movement_localize(rd_MovementData.strRew) + "', alignment:['fill','top'], preferredSize:[30,20] }, \
						prev: Button { text:'" + rd_Movement_localize(rd_MovementData.strPrev) + "', alignment:['fill','top'], preferredSize:[30,20] }, \
						next: Button { text:'" + rd_Movement_localize(rd_MovementData.strNext) + "', alignment:['fill','top'], preferredSize:[30,20] }, \
						fwd: Button { text:'" + rd_Movement_localize(rd_MovementData.strFwd) + "', alignment:['fill','top'], preferredSize:[30,20] }, \
					}, \
					sep: Group { \
						orientation:'stacked', alignment:['fill','top'], \
						label: Group { \
							lbl: StaticText { text:'" + rd_Movement_localize(rd_MovementData.strFavorites) + "', alignment:['center','center'] }, \
						}, \
						rule: Panel { \
							height: 2, alignment:['fill','center'], \
						}, \
					}, \
					faveValBtns: Group { \
						alignment:['fill','top'], ";
				for (var i=0; i<rd_MovementData.numFaves; i++)
					res += "valBtn"+i.toString()+": Button { text:'" + rd_Movement_localize(rd_MovementData.strTimeSet) + "', alignment:['fill','top'], preferredSize:[25,14] }, ";
				res += " \
					}, \
					faveBtns: Group { \
						alignment:['fill','top'], ";
				for (var i=0; i<rd_MovementData.numFaves; i++)
					res += "btn"+i.toString()+": Button { text:'" + (i+1).toString() + "', alignment:['fill','top'], preferredSize:[25,20] }, ";
				res +=	" \
					}, \
				}";
				pal.grp = pal.add(res);
				
				pal.grp.btns.margins.top = -(pal.grp.spacing - 2);
				pal.grp.sep.label.margins.left = pal.grp.sep.label.margins.right = 10;
				pal.grp.faveBtns.margins.top = -(pal.grp.spacing - 2);
				
				pal.grp.flds.rewVal.onChange = rd_Movement_doValidatePosNum;
				pal.grp.btns.rew.onClick = function() {rd_Movement_doJumpFrames(-this.parent.parent.flds.rewVal.text);}
				pal.grp.flds.prevVal.onChange = rd_Movement_doValidatePosNum;
				pal.grp.btns.prev.onClick = function() {rd_Movement_doJumpFrames(-this.parent.parent.flds.prevVal.text);}
				pal.grp.flds.nextVal.onChange = rd_Movement_doValidatePosNum;
				pal.grp.btns.next.onClick = function() {rd_Movement_doJumpFrames(this.parent.parent.flds.nextVal.text);}
				pal.grp.flds.fwdVal.onChange = rd_Movement_doValidatePosNum;
				pal.grp.btns.fwd.onClick = function() {rd_Movement_doJumpFrames(this.parent.parent.flds.fwdVal.text);}
				
				for (var i=0; i<rd_MovementData.numFaves; i++)
				{
					eval("pal.grp.faveBtns.btn" + i + ".stateId = " + (i+1) + ";");
					eval("pal.grp.faveBtns.btn" + i + ".enabled = false;");
					eval("pal.grp.faveBtns.btn" + i + ".onClick = function() {rd_Movement_doGoToFave(parseInt(this.stateId), pal);}");
					
					eval("pal.grp.faveValBtns.valBtn" + i + ".stateId = " + (i+1) + ";");
					eval("pal.grp.faveValBtns.valBtn" + i + ".time = undefined;");
					eval("pal.grp.faveValBtns.valBtn" + i + ".onClick = function() {rd_Movement_doSetFave(parseInt(this.stateId), pal);}");
				}
				
				pal.grp.btns.rew.preferredSize.width = pal.grp.flds.rewVal.preferredSize.width;
				pal.grp.btns.prev.preferredSize.width = pal.grp.flds.prevVal.preferredSize.width;
				pal.grp.btns.next.preferredSize.width = pal.grp.flds.nextVal.preferredSize.width;
				pal.grp.btns.fwd.preferredSize.width = pal.grp.flds.fwdVal.preferredSize.width;
				
				// Workaround to ensure the edittext text color is black, even at darker UI brightness levels
				var winGfx = pal.graphics;
				var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0,0,0], 1);
				pal.grp.flds.rewVal.graphics.foregroundColor = darkColorBrush;
				pal.grp.flds.prevVal.graphics.foregroundColor = darkColorBrush;
				pal.grp.flds.nextVal.graphics.foregroundColor = darkColorBrush;
				pal.grp.flds.fwdVal.graphics.foregroundColor = darkColorBrush;
				
				pal.layout.layout(true);
				pal.grp.minimumSize = pal.grp.size;
				pal.layout.resize();
				pal.onResizing = pal.onResize = function () {this.layout.resize();}
				
				pal.grp.header.help.onClick = function () {alert(rd_MovementData.scriptTitle + "\n" + rd_Movement_localize(rd_MovementData.strHelpText), rd_MovementData.scriptName);}
			}
			
			return pal;
		}
		
		
		
		
		// rd_Movement_doValidatePosNum()
		// 
		// Description:
		// This callback function assures that the entered value is a
		// positive number.
		// 
		// Parameters:
		// None.
		// 
		// Returns:
		// Nothing.
		//
		function rd_Movement_doValidatePosNum()
		{
			var enteredValue = this.text;
			
			// If not a number or less than 0, reset to 1
			if (isNaN(enteredValue) || (enteredValue <= 0))
				this.text = "1";
			else
				this.text = parseInt(enteredValue).toString();
		}
		
		
		
		
		// rd_Movement_doJumpFrames()
		// 
		// Description:
		// This function moves the current-time indicator (CTI) by the
		// specified number of frames.
		// 
		// Parameters:
		//   frames - Number of frames to jump.
		// 
		// Returns:
		// Nothing.
		//
		function rd_Movement_doJumpFrames(offset)
		{
			// Check if offseting time
			offset = parseFloat(offset);
			if (offset == 0)
				return;
			
			// Check that a project exists
			if (app.project == null)
				return;
			
			// Get the current (active/frontmost) comp
			var comp = app.project.activeItem;
			
			if ((comp == null) || !(comp instanceof CompItem))
			{
				alert(rd_Movement_localize(rd_MovementData.strErrNoCompSel), rd_MovementData.scriptName);
				return;
			}
			
			// Jump to the new time
			app.beginUndoGroup(rd_MovementData.scriptName);
			
			var newTime = comp.time + offset * comp.frameDuration;
			if (newTime < rd_MovementData.minCompSecs)			// Clip time value to valid range used by Composition time attribute
				newTime = rd_MovementData.minCompSecs;
			else if (newTime > rd_MovementData.maxCompSecs)
				newTime = rd_MovementData.maxCompSecs;
			comp.time = newTime;
			
			app.endUndoGroup();
		}
		
		
		
		
		// rd_Movement_doSetFave()
		// 
		// Description:
		// This function captures the current time (in seconds) to the specified favorite button.
		// 
		// Parameters:
		//   faveNum - The selected favorite to use.
		//   pal - The palette (Window object) itself.
		// 
		// Returns:
		// Nothing.
		//
		function rd_Movement_doSetFave(faveNum, pal)
		{
			// Check that a project exists
			if (app.project == null)
				return;
			
			// Get the current (active/frontmost) comp
			var comp = app.project.activeItem;
			
			if ((comp == null) || !(comp instanceof CompItem))
			{
				alert(rd_Movement_localize(rd_MovementData.strErrNoCompSel), rd_MovementData.scriptName);
				return;
			}
			
			// Capture the current time (in seconds)
			eval("pal.grp.faveValBtns.valBtn" + (faveNum-1) + ".time = comp.time;");
			
			// Enable the "set" button
			eval("pal.grp.faveBtns.btn" + (faveNum-1) + ".enabled = true;");
			eval("pal.grp.faveBtns.btn" + (faveNum-1) + ".helpTip = comp.time.toString() + ' seconds';");
		}
		
		
		
		
		// rd_Movement_doGoToFave()
		// 
		// Description:
		// This function jumps to the time set for the selected favorite button.
		// 
		// Parameters:
		//   faveNum - The selected favorite to use.
		//   pal - The palette (Window object) itself.
		// 
		// Returns:
		// Nothing.
		//
		function rd_Movement_doGoToFave(faveNum, pal)
		{
			// Check that a project exists
			if (app.project == null)
				return;
			
			// Get the current (active/frontmost) comp
			var comp = app.project.activeItem;
			
			if ((comp == null) || !(comp instanceof CompItem))
			{
				alert(rd_Movement_localize(rd_MovementData.strErrNoCompSel), rd_MovementData.scriptName);
				return;
			}
			
			// Check that the specified favorite button has a value
			eval("var time = pal.grp.faveValBtns.valBtn" + (faveNum-1) + ".time;");
			if (time == undefined)
			{
				alert("not set", rd_MovementData.scriptName);
				return;
			}
			
			// Jump to the time associated with the specified button
			app.beginUndoGroup(rd_MovementData.scriptName);
			
			var newTime = parseFloat(time);
			if (newTime < rd_MovementData.minCompSecs)			// Clip time value to valid range used by Composition time attribute
				newTime = rd_MovementData.minCompSecs;
			else if (newTime > rd_MovementData.maxCompSecs)
				newTime = rd_MovementData.maxCompSecs;
			comp.time = newTime;
			
			app.endUndoGroup();
		}
		
		
		
		
		// main code:
		//
		
		// Prerequisites check
		if (parseFloat(app.version) < 8.0)
			alert(rd_Movement_localize(rd_MovementData.strMinAE80), rd_MovementData.scriptName);
		else
		{
			// Build and show the console's floating palette
			var rdmPal = rd_Movement_buildUI(thisObj);
			if (rdmPal != null)
			{
				// Update UI values, if saved in the settings
				if (app.settings.haveSetting("redefinery", "rd_Movement_rewValue"))
					rdmPal.grp.flds.rewVal.text = app.settings.getSetting("redefinery", "rd_Movement_rewValue").toString();
				if (app.settings.haveSetting("redefinery", "rd_Movement_prevValue"))
					rdmPal.grp.flds.prevVal.text = app.settings.getSetting("redefinery", "rd_Movement_prevValue").toString();
				if (app.settings.haveSetting("redefinery", "rd_Movement_nextValue"))
					rdmPal.grp.flds.nextVal.text = app.settings.getSetting("redefinery", "rd_Movement_nextValue").toString();
				if (app.settings.haveSetting("redefinery", "rd_Movement_fwdValue"))
					rdmPal.grp.flds.fwdVal.text = app.settings.getSetting("redefinery", "rd_Movement_fwdValue").toString();
				var faveVal;
				for (var i=0; i<rd_MovementData.numFaves; i++)
				{
					if (app.settings.haveSetting("redefinery", "rd_Movement_fave_"+(i+1)))
					{
						faveVal = app.settings.getSetting("redefinery", "rd_Movement_fave_"+(i+1).toString()).toString();
						if (faveVal != "undefined")
						{
							eval("rdmPal.grp.faveBtns.btn"+i+".enabled = true;");
							eval("rdmPal.grp.faveBtns.btn"+i+".helpTip = '" + parseFloat(faveVal) + " seconds';");
							eval("rdmPal.grp.faveValBtns.valBtn"+i+".time = " + parseFloat(faveVal) + ";");
						}
						else
							eval("rdmPal.grp.faveValBtns.valBtn"+i+".time = undefined;");
					}
				}
				
				// Save current UI settings upon closing the palette
				rdmPal.onClose = function()
				{
					app.settings.saveSetting("redefinery", "rd_Movement_rewValue", rdmPal.grp.flds.rewVal.text);
					app.settings.saveSetting("redefinery", "rd_Movement_prevValue", rdmPal.grp.flds.prevVal.text);
					app.settings.saveSetting("redefinery", "rd_Movement_nextValue", rdmPal.grp.flds.nextVal.text);
					app.settings.saveSetting("redefinery", "rd_Movement_fwdValue", rdmPal.grp.flds.fwdVal.text);
					
					var faveVal, faveBtnTime;
					for (var i=0; i<rd_MovementData.numFaves; i++)
					{
						eval("faveBtnTime = rdmPal.grp.faveValBtns.valBtn"+i+".time;");
						app.settings.saveSetting("redefinery", "rd_Movement_fave_"+(i+1), (faveBtnTime != undefined) ? faveBtnTime.toString() : "undefined");
					}
				}
				
				if (rdmPal instanceof Window)
				{
					// Show the palette
					rdmPal.center();
					rdmPal.show();
				}
				else
					rdmPal.layout.layout(true);
			}
		}
	}
	
	
	rd_Movement(this);
}
