/* 

名称: 将图层按设定偏移
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
	function 将图层按设定偏移(thisObj) {

		var SL_Data = new Object();
		
		SL_Data.helpWindow;	
		
		SL_Data.mainDropDown = '["偏移选择图层", "交错选择图层"]';
		SL_Data.frameSecDropDown = '["帧", "秒"]';
		
		SL_Data.scriptName = "将图层按设定偏移图层排列脚本";
		SL_Data.scriptVersion = "v2.2";
		SL_Data.scriptTitle = SL_Data.scriptName + " " + SL_Data.scriptVersion;

		SL_Data.strHelpBtn1 = "更多资源分享";
		SL_Data.strHelpBtn1Url = "https://wanvfx.com";
		SL_Data.strHelpBtn2= "更多新东西分享";
		SL_Data.strHelpBtn2Url = "http://wanvfx.com"
		
		SL_Data.winProgramFiles = Folder.commonFiles.parent.fsName;
		SL_Data.winBrowserCmd = SL_Data.winProgramFiles + "\\Internet Explorer\\iexplore.exe";		// You can change the browser to use on windows here, use double slashes
		SL_Data.macBrowserCmdStart = "arch -i386 osascript -e 'open location \"";
		SL_Data.macBrowserCmdEnd = "\"'";
		SL_Data.strErrScriptAccess = "This script requires the scripting security preference to be set.\n" +
			"Go to the \"General\" panel of the application preferences and make sure " + 
			"\"Allow Scripts to Write Files and Access Network\" is checked.";	
		
		SL_Data.strHelp = "?";		
		SL_Data.strHelpHeader = SL_Data.scriptTitle + " © 2015-2020 视效网";
		SL_Data.strHelpText = "" +
			"这个脚本可用来在同一时间偏移或者交错图层.使用方法, 选择一些图层, 选择你需要的选项然后点击应用按钮.\n\n" +		
			"偏移选择图层:\n\n" +
			"在相同的时间选择所有层，你可以通过一个固定的时间内偏移图层," +
			" 或者选择图层在出入点跳转到当前时间标记.\n\n" +
			"交错选择图层:\n\n" +
			"在同一时间交错选择图层, 通过一个固定的时间（帧或者秒）来偏移每一个图层." +
			" 图层可以从当前时间标记交错, 或者偏移可以添加到每一个图层的当前时间."+
			" 顺序排序选择图层.\n\n\n" +
			"注意:这个脚本需要After Effects CS3或以上版本.";
		SL_Data.strHelpText2 = " 它可以作为一个可停靠面板，只需要你把脚本放置到Scripts脚本文件夹下的ScriptUI Panels文件夹即可，打开AE，在window下就可以看到这个脚本了 .";

			
			
			
		

		function 将图层按设定偏移_buildUI(thisObj) {
			var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "将图层按设定偏移", undefined, {resizeable:true});

			if (pal != null) {
				var res =
				"group { \
					orientation: 'column' ,alignment:['left','top'], \
					header: Group { \
						alignment:['fill', 'top'], \
						dropdown: DropDownList { properties:{items:"+SL_Data.mainDropDown+"}, alignment:['left','center'] }, \
					}, \
					allGroups: Group { orientation: 'stack', alignment:['fill','top'], \
						shift: Group { orientation: 'column', alignment:['left','top'], alignChildren:['left','center'], \
							shiftIn: RadioButton { text: '时间标记入点'}, \
							shiftOut: RadioButton { text: '时间标记出点'}, \
							timeOffset: Group { \
								orientation: 'row', alignment:['left','top'], alignChildren:['left','center'],\
								shiftTimeRB: RadioButton { text: '偏移'}, \
								timeET: EditText { text:'100' }, \
								frameSecDropdown: DropDownList { properties:{items:"+SL_Data.frameSecDropDown+"}, alignment:['left','center'] }, \
							}, \
						}, \
						stagger: Group { orientation: 'column', alignment:['left','center'], alignChildren:['left','center'],\
							curTime: RadioButton { text: '从当前时间标记'}, \
							origIn: RadioButton { text: '添加到已存在图层时间'}, \
							timeOffset: Group { \
								orientation: 'row', alignment:['left','top'], alignChildren:['left','center'],\
								timeST: StaticText { text: '数量:'}, \
								timeET: EditText { text:'100' }, \
								frameSecDropdown: DropDownList { properties:{items:"+SL_Data.frameSecDropDown+"}, alignment:['left','center'] }, \
							}, \
						}, \
					}, \
					footer: Group { alignment:['fill', 'top'], \
						about: Button { text:'说明', maximumSize:[40,25], alignment:['right','center'] }, \
						apply: Button { text:'应用', alignment:['right','center'] }, \
					}, \
				}";			

				pal.grp = pal.add(res);
			
				pal.grp.header.dropdown.selection = 0;
				pal.grp.header.dropdown.onChange = onDropDownListChange;
				
				pal.grp.allGroups.shift.timeOffset.shiftTimeRB.value = true;
				pal.grp.allGroups.shift.timeOffset.frameSecDropdown.selection = 0;
				
				pal.grp.allGroups.stagger.visible = false;		
				pal.grp.allGroups.stagger.curTime.value = true;
				pal.grp.allGroups.stagger.timeOffset.frameSecDropdown.selection = 0;

				pal.grp.allGroups.shift.shiftIn.onClick = onShiftClick;
				pal.grp.allGroups.shift.shiftOut.onClick = onShiftClick;
				pal.grp.allGroups.shift.timeOffset.shiftTimeRB.onClick = onShiftClick;
				pal.grp.allGroups.shift.timeOffset.timeET.onChange = onTextInputChange;
				pal.grp.allGroups.stagger.timeOffset.timeET.onChange = onTextInputChange;
				pal.grp.footer.apply.onClick = onApplyButtonClick;
				
				pal.grp.footer.about.onClick = function () {
					if (SL_Data.helpWindow instanceof Window) SL_Data.helpWindow.show();
					else helpWindow();
				}
		
				pal.layout.layout(true);
				pal.layout.resize();
				pal.onResizing = pal.onResize = function () {this.layout.resize();}
				
				pal.grp.allGroups.shift.timeOffset.timeET.text = "10";
				pal.grp.allGroups.stagger.timeOffset.timeET.text = "10";

				// workaround for CS3 to ensure the UI colors are correct at different brightness levels
				if (Math.floor(parseFloat(app.version)) == 8) {
					var winGfx = pal.graphics;	
					var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0,0,0], 1);
					pal.grp.header.dropdown.graphics.foregroundColor = darkColorBrush;
					pal.grp.allGroups.shift.timeOffset.frameSecDropdown.graphics.foregroundColor = darkColorBrush;
					pal.grp.allGroups.stagger.timeOffset.frameSecDropdown.graphics.foregroundColor = darkColorBrush;
					pal.grp.allGroups.shift.timeOffset.timeET.graphics.foregroundColor = darkColorBrush;
					pal.grp.allGroups.stagger.timeOffset.timeET.graphics.foregroundColor = darkColorBrush;
				}
		
			}		
			return pal;
		}
	
		function onDropDownListChange() {    // the drop down list was changed

			if (this.selection.index == 0) { 							// if shift is selected
				ptshiftPal.grp.allGroups.stagger.visible = false; 	// hide stagger
				ptshiftPal.grp.allGroups.shift.visible = true;		  // and show shift

			} else {				// if stagger is selected
				ptshiftPal.grp.allGroups.shift.visible = false; 		// hide shift
				ptshiftPal.grp.allGroups.stagger.visible = true;	  // show stagger
			}
		}
	
							
		function onShiftClick() {   // one of the shift radio buttons were pressed
			if (this.text == "Shift") {
				ptshiftPal.grp.allGroups.shift.shiftIn.value = false;
				ptshiftPal.grp.allGroups.shift.shiftOut.value = false;
			} else {
				ptshiftPal.grp.allGroups.shift.timeOffset.shiftTimeRB.value = false;
			}
		}
		
	
		function onTextInputChange() {
			if (isNaN(parseFloat(this.text))) {
				this.text = "10";
			} else { 
				this.text = parseFloat(this.text);
			}
		}
	

		function onApplyButtonClick() {
			// make sure the text input can be parsed into a number
			if (ptshiftPal.grp.header.dropdown.selection.index == 0) {
				// in CS3 the text input onChange isn't triggered between changing text and hitting apply, so need to ensure the numbers parse
				if (isNaN(parseFloat(ptshiftPal.grp.allGroups.shift.timeOffset.timeET.text))) {
					ptshiftPal.grp.allGroups.shift.timeOffset.timeET.text = "10";
				} else {
					ptshiftPal.grp.allGroups.shift.timeOffset.timeET.text = parseFloat(ptshiftPal.grp.allGroups.shift.timeOffset.timeET.text);
					shiftLayers();
				}
			} else {
				if (isNaN(parseFloat(ptshiftPal.grp.allGroups.stagger.timeOffset.timeET.text))) {
					ptshiftPal.grp.allGroups.stagger.timeOffset.timeET.text = "10";
				} else {
					ptshiftPal.grp.allGroups.stagger.timeOffset.timeET.text = parseFloat(ptshiftPal.grp.allGroups.stagger.timeOffset.timeET.text);
					staggerLayers();
				}
			}
		}
	
	
	

		function shiftLayers()
		{
			var activeItem = app.project.activeItem; 		        	// make sure a comp is selected
			if (activeItem == null || !(activeItem instanceof CompItem)){
				alert("You need at least one layer selected.");
			} else {

				var selectedLayers = activeItem.selectedLayers; 		// make sure at least one layer is selected
				if (activeItem.selectedLayers.length == 0 ) {
					alert("You need at least one layer selected.");
				} else {

					if (ptshiftPal.grp.allGroups.shift.shiftIn.value == true) {
						earliestInPoint = selectedLayers[0].inPoint; 		// find earliest in point
						for (i = 1; i < selectedLayers.length; ++i) { 		// skip first layer as we don't need to check it.
							currentLayer = selectedLayers[i];
							if (currentLayer.inPoint < earliestInPoint) {
								earliestInPoint = currentLayer.inPoint;
							}
						}
						timeDifference = activeItem.time - earliestInPoint; 	// timeDifference between earliest start time and current time
						
					} else if (ptshiftPal.grp.allGroups.shift.shiftOut.value == true) {
						latestOutPoint = selectedLayers[0].outPoint; 			// find latest out point
						for (i = 1; i < selectedLayers.length; ++i) { 			// skip first layer as we don't need to check it.
							currentLayer = selectedLayers[i];
							if (currentLayer.outPoint > latestOutPoint) {
								latestOutPoint = currentLayer.outPoint;
							}
						}
						latestOutPoint = latestOutPoint - activeItem.frameDuration;	// offset result by one frame
						timeDifference = activeItem.time - latestOutPoint;                 // timeDifference between earliest start time and current time
						
					} else if (ptshiftPal.grp.allGroups.shift.timeOffset.shiftTimeRB.value == true) {
						if (ptshiftPal.grp.allGroups.shift.timeOffset.frameSecDropdown.selection == 0) {
							timeDifference = parseFloat(ptshiftPal.grp.allGroups.shift.timeOffset.timeET.text) * activeItem.frameDuration;
						} else {
							timeDifference = parseFloat(ptshiftPal.grp.allGroups.shift.timeOffset.timeET.text);
						}
					}

					app.beginUndoGroup("Shift Selected Layers");			
					for (i = 0; i < selectedLayers.length; ++i) {  			// shift the layers
						currentLayer = selectedLayers[i];
						currentLayer.startTime += timeDifference;
					}				
					app.endUndoGroup();
				}
			}
		}

	
	
		function staggerLayers() {
			var activeItem = app.project.activeItem; 			// make sure a comp is selected
			if (activeItem == null || !(activeItem instanceof CompItem)) {
				alert("You need to select two or more layers.");
			} else {
				
				var selectedLayers = activeItem.selectedLayers; 				// make sure at least two layers are selected
				if (activeItem.selectedLayers.length < 2 ) {
					alert("You need to select two or more layers.");
				} else {
					
					app.beginUndoGroup("Stagger Selected Layers");
					if (ptshiftPal.grp.allGroups.stagger.timeOffset.frameSecDropdown.selection == 0) {  	// if necessary, convert stagger amount in frames to secondss
						var staggerAmount = parseFloat(ptshiftPal.grp.allGroups.stagger.timeOffset.timeET.text) * activeItem.frameDuration;
					} else {
						var staggerAmount = parseFloat(ptshiftPal.grp.allGroups.stagger.timeOffset.timeET.text);
					}

					if (ptshiftPal.grp.allGroups.stagger.curTime.value == true) {
						for (i = 0; i < selectedLayers.length; ++i) {  						// stagger time marker
							currentLayer = selectedLayers[i];
							currentLayer.startTime = activeItem.time + (i * staggerAmount);
						}
					
					} else {
						for (i = 0; i < selectedLayers.length; ++i) { 						// stagger layer in-points.
							currentLayer = selectedLayers[i];
							currentLayer.startTime += (i * staggerAmount);
						}
					}
					app.endUndoGroup();
				}
			}
		}
	
	
		function helpWindow() {

			SL_Data.helpWindow = new Window (
			"palette { \
				orientation: 'column' , text:'"+SL_Data.scriptName+"', \
				headerST: StaticText { text:'"+SL_Data.strHelpHeader+"', alignment:['left','top'] }, \
				helpET: EditText { text:'', alignment:['fill','fill'], properties:{multiline:true}}, \
				buttons: Group{ orientation: 'row', alignment:['fill','bottom'], \
					helpBtn1: Button { text:'"+SL_Data.strHelpBtn1+"', alignment:['fill','center'] }, \
					helpBtn2: Button { text:'"+SL_Data.strHelpBtn2+"', alignment:['fill','center'] }, \
				}, \
			}");

			var win = SL_Data.helpWindow;
			
			if (ptshiftPal instanceof Window) win.helpET.text = SL_Data.strHelpText + SL_Data.strHelpText2;
			else win.helpET.text = SL_Data.strHelpText;
			
			win.buttons.helpBtn1.preferredSize.height = win.buttons.helpBtn2.preferredSize.height = win.buttons.helpBtn2.preferredSize.height * 1.5;

			win.buttons.helpBtn1.onClick = function() {
				if (isSecurityPrefSet()) openURL(SL_Data.strHelpBtn1Url);
				else alert(SL_Data.strErrScriptAccess, SL_Data.scriptName);
			};
		
			win.buttons.helpBtn2.onClick = function() {
				if (isSecurityPrefSet()) openURL(SL_Data.strHelpBtn2Url);
				else alert(SL_Data.strErrScriptAccess, SL_Data.scriptName);
			};	
		
			win.layout.layout(true);
			win.size = [500,420];
			win.show();	// DISPLAY THE WINDOW
		}
		
	
	
	
		
		function openURL(url)  { // This function opens a URL in a browser - Copyright (c) 2006-2007 redefinery (Jeffrey R. Almasol). All rights reserved.
			if ($.os.indexOf("Windows") != -1) {
				system.callSystem("cmd /c \""+SL_Data.winBrowserCmd + "\" " + url);
			} else {
				system.callSystem(SL_Data.macBrowserCmdStart + url + SL_Data.macBrowserCmdEnd);
			}
		}
		
		
		
		function isSecurityPrefSet(){
			var securitySetting = app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY");
			return (securitySetting == 1);
		}
	
	


		if (parseFloat(app.version) < 8 ) {
			alert("This script requires After Effects CS3 or greater");
		} else  {
			
			var ptshiftPal = 将图层按设定偏移_buildUI(thisObj);
			if (ptshiftPal != null) {
				if (ptshiftPal instanceof Window) {
					ptshiftPal.center();
					ptshiftPal.show();
				}
			}
		}
	}

	将图层按设定偏移(this);
}