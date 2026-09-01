/* 

名称: 时间轴层位置微调
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
	function rd_Scooter(thisObj)
	{
		// Globals
		
		var rd_ScooterData = new Object();	// Store globals in an object
		rd_ScooterData.scriptName = "时间轴层位置微调";
		rd_ScooterData.scriptTitle = rd_ScooterData.scriptName + " v1.0";
		
		rd_ScooterData.strAffectPnl = {en: "设置"};
		rd_ScooterData.strLayerSrc = {en: "图层素材源"};
		rd_ScooterData.strLayerInOut = {en: "图层出入点"};
		rd_ScooterData.strLayerMarkers = {en: "图层的标记"};
		rd_ScooterData.strKfs = {en: "关键帧:"};
		rd_ScooterData.strKfsNone = {en: "无"};
		rd_ScooterData.strKfsSel = {en: "选中"};
		rd_ScooterData.strKfsAll = {en: "所有"};
		rd_ScooterData.strRew = {en: "<<"};
		rd_ScooterData.strPrev = {en: "<"};
		rd_ScooterData.strNext = {en: ">"};
		rd_ScooterData.strFwd = {en: ">>"};
		rd_ScooterData.strHelp = {en: "说明"};
		rd_ScooterData.strErrNoWorkToDo = {en: "由于未选择任何选项，因此无法执行任何操作。"};
		rd_ScooterData.strErrNoCompSel = {en: "无法执行操作。 请在“项目”面板中选择或打开一个合成，然后重试。"};
		rd_ScooterData.strErrNoLayerSel = {en: "无法执行操作。 请选择至少一层，然后重试。"};
		rd_ScooterData.strMinAE80 = {en: "该脚本需要Adobe After Effects CS3或更高版本。"};
		rd_ScooterData.strHelpText = 
		{
			en: "Copyright (c) 2005-2007 redefinery (Jeffrey R. Almasol). \n" +
			"All rights reserved.\n" +
			"\n" +
			"该脚本包含用于滑动和滑动各种图层设置的控件，例如图层素材源，内/外范围，标记和关键帧。 您可以使用这些设置的不同组合来更强大地控制图层编辑操作。\n" +
			"\n" +
			"注意：如果选择“关键帧=选定”选项，则脚本可能需要一段时间才能完成，具体取决于关键帧的数量和所选设置。 另外，此选项仅在第一个选定图层上起作用。\n" +
			"\n" +
			"您可以使用四个导航按钮。 边框偏移出现在每个按钮的上方，但是您可以将其更改为任何正数。 这些偏移量将保存为设置以供后续会话使用。\n" +
			"\n" +
			"                                                                             视效网汉化 2020.6.25.\n"
		};
		
		
		
		
		// rd_Scooter_localize()
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
		function rd_Scooter_localize(strVar)
		{
			return strVar["en"];
		}
		
		
		
		
		// rd_Scooter_buildUI()
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
		function rd_Scooter_buildUI(thisObj)
		{
			var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", rd_ScooterData.scriptName, undefined, {resizeable:true});
			
			if (pal != null)
			{
				var res = 
				"group { \
					orientation:'column', alignment:['fill','top'], \
					header: Group { \
						alignment:['fill','top'], \
						title: StaticText { text:'" + rd_ScooterData.scriptName + "', alignment:['fill','center'] }, \
						help: Button { text:'" + rd_Scooter_localize(rd_ScooterData.strHelp) +"', maximumSize:[50,25], alignment:['right','center'] }, \
					}, \
					affectPnl: Panel { \
						orientation:'row', text:'" + rd_Scooter_localize(rd_ScooterData.strAffectPnl) + "', alignment:['fill','top'], \
						c1: Group { \
							orientation:'column', alignment:['left','top'], alignChildren:['fill','top'], \
							layerSrc: Checkbox { text:'" + rd_Scooter_localize(rd_ScooterData.strLayerSrc) + "', value:true }, \
							layerInOut: Checkbox { text:'" + rd_Scooter_localize(rd_ScooterData.strLayerInOut) + "', value:true }, \
							layerMarkers: Checkbox { text:'" + rd_Scooter_localize(rd_ScooterData.strLayerMarkers) + "', value:true }, \
						}, \
						c2: Group { \
							orientation:'column', alignment:['right','top'], alignChildren:['right','top'], \
							kfs: StaticText { text:'" + rd_Scooter_localize(rd_ScooterData.strKfs) + "', alignment:['right','top'] }, \
						}, \
						c3: Group { \
							orientation:'column', alignChildren:['left','top'], \
							kfsNone: RadioButton { text:'" + rd_Scooter_localize(rd_ScooterData.strKfsNone) + "' }, \
							kfsSel: RadioButton { text:'" + rd_Scooter_localize(rd_ScooterData.strKfsSel) + "' }, \
							kfsAll: RadioButton { text:'" + rd_Scooter_localize(rd_ScooterData.strKfsAll) + "', value:true }, \
						}, \
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
						rew: Button { text:'" + rd_Scooter_localize(rd_ScooterData.strRew) + "', alignment:['fill','top'], preferredSize:[30,20] }, \
						prev: Button { text:'" + rd_Scooter_localize(rd_ScooterData.strPrev) + "', alignment:['fill','top'], preferredSize:[30,20] }, \
						next: Button { text:'" + rd_Scooter_localize(rd_ScooterData.strNext) + "', alignment:['fill','top'], preferredSize:[30,20] }, \
						fwd: Button { text:'" + rd_Scooter_localize(rd_ScooterData.strFwd) + "', alignment:['fill','top'], preferredSize:[30,20] }, \
					}, \
				}";
				pal.grp = pal.add(res);
//						shiftBtn: Button { text:'" + rd_Scooter_localize(rd_ScooterData.strShift) + "' }, \
				pal.grp.affectPnl.c2.margins.left += 10;
				
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
				
				pal.grp.btns.rew.preferredSize.width = pal.grp.flds.rewVal.preferredSize.width;
				pal.grp.btns.prev.preferredSize.width = pal.grp.flds.prevVal.preferredSize.width;
				pal.grp.btns.next.preferredSize.width = pal.grp.flds.nextVal.preferredSize.width;
				pal.grp.btns.fwd.preferredSize.width = pal.grp.flds.fwdVal.preferredSize.width;
				
				pal.grp.flds.rewVal.onChange = rd_Scooter_doValidatePosNum;
				pal.grp.flds.prevVal.onChange = rd_Scooter_doValidatePosNum;
				pal.grp.flds.nextVal.onChange = rd_Scooter_doValidatePosNum;
				pal.grp.flds.fwdVal.onChange = rd_Scooter_doValidatePosNum;
				
				pal.grp.header.help.onClick = function () {alert(rd_ScooterData.scriptTitle + "\n" + rd_Scooter_localize(rd_ScooterData.strHelpText), rd_ScooterData.scriptName);}
				pal.grp.btns.rew.onClick = function() {rd_Scooter_doScoot(-this.parent.parent.flds.rewVal.text, this.parent.parent);}
				pal.grp.btns.prev.onClick = function() {rd_Scooter_doScoot(-this.parent.parent.flds.prevVal.text, this.parent.parent);}
				pal.grp.btns.next.onClick = function() {rd_Scooter_doScoot(this.parent.parent.flds.nextVal.text, this.parent.parent);}
				pal.grp.btns.fwd.onClick = function() {rd_Scooter_doScoot(this.parent.parent.flds.fwdVal.text, this.parent.parent);}
			}
			
			return pal;
		}
		
		
		
		
		// rd_Scooter_doValidatePosNum()
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
		function rd_Scooter_doValidatePosNum()
		{
			var enteredValue = this.text;
			
			// If not a number or less than 0, reset to 1
			if (isNaN(enteredValue) || (enteredValue <= 0))
				this.text = "1";
		}
		
		
		
		
		// rd_Scooter_scootLayerMarkers()
		// 
		// Description:
		// This function shifts the specified layer's markers by the specified distance (in seconds).
		// 
		// Parameters:
		//   layer - Layer object containing markers.
		//   offset - Time in seconds to offset the layer's markers.
		// 
		// Returns:
		// None.
		//
		function rd_Scooter_scootLayerMarkers(layer, offset)
		{
			var markerProps = layer.property("Marker");
			var marker;

			// Loop through the layer's markers in the direction such that new
			// markers will not affect the indices of existing markers
			if (offset > 0)
			{
				for (var i=markerProps.numKeys; i>=1; i--)
				{
					markerProps.setValueAtTime(markerProps.keyTime(i)+offset, markerProps.keyValue(i));
					markerProps.removeKey(i);
				}
			}
			else
			{
				var newTime, newValue;

				for (var i=1; i<=markerProps.numKeys; i++)
				{
					newTime = markerProps.keyTime(i) + offset;
					newValue = markerProps.keyValue(i)
					markerProps.setValueAtTime(newTime, newValue);
					markerProps.removeKey(i+1);
				}
			}
		}
		
		
		
		
		function rd_Scooter_shiftKeyToNewTime(prop, keyToCopy, offset, keyToRemove)
		{
	//		var newTime = prop.keyTime(keyToCopy) + offset;
			//var newValue = prop.keyValue(keyToCopy);
	//		var newKeyIndex, inInterp, outInterp;
			
			// Create the new keyframe
			//prop.setValueAtTime(newTime, newValue);
			
	//		$.writeln("    in interp : "+getPropInterpType(prop.keyInInterpolationType(k)));
	//		$.writeln("    out interp: "+getPropInterpType(prop.keyOutInterpolationType(k)));
	//		if (prop.propertyValueType == PropertyValueType.TwoD_SPATIAL)
	//		{
	//			spatialTangent = prop.keyInSpatialTangent(k);
	//			$.writeln("    in spatial tangent : "+spatialTangent[0]+", "+spatialTangent[1]);
	//			spatialTangent = prop.keyOutSpatialTangent(k);
	//			$.writeln("    out spatial tangent: "+spatialTangent[0]+", "+spatialTangent[1]);
	//			$.writeln("    roving: "+prop.keyRoving(k));
	//			$.writeln("    spatial auto bezier: "+prop.keySpatialAutoBezier(k));
	//			$.writeln("    spatial continuous : "+prop.keySpatialContinuous(k));
	//		}
	//		else if (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL)
	//		{
	//			spatialTangent = prop.keyInSpatialTangent(k);
	//			$.writeln("    in spatial tangent : "+spatialTangent[0]+", "+spatialTangent[1]+", "+spatialTangent[2]);
	//			spatialTangent = prop.keyOutSpatialTangent(k);
	//			$.writeln("    out spatial tangent: "+spatialTangent[0]+", "+spatialTangent[1]+", "+spatialTangent[2]);
	//			$.writeln("    roving: "+prop.keyRoving(k));
	//			$.writeln("    spatial auto bezier: "+prop.keySpatialAutoBezier(k));
	//			$.writeln("    spatial continuous : "+prop.keySpatialContinuous(k));
	//		}
	//		eases = prop.keyInTemporalEase(k);
	//		for (e=0; e<eases.length; e++)
	//			$.writeln("    in temporal  ease# "+(e+1)+": speed="+eases[e].speed+" infl="+eases[e].influence);
	//		eases = prop.keyOutTemporalEase(k);
	//		for (e=0; e<eases.length; e++)
	//			$.writeln("    out temporal ease# "+(e+1)+": speed="+eases[e].speed+" infl="+eases[e].influence);
	//		$.writeln("    temporal auto bezier: "+prop.keyTemporalAutoBezier(k));
	//		$.writeln("    temporal continuous : "+prop.keyTemporalContinuous(k));
			
			// Remember the key's settings before creating the new setting, just in case creating the new key affects keyToCopy's settings
			var inInterp = prop.keyInInterpolationType(keyToCopy);
			var outInterp = prop.keyOutInterpolationType(keyToCopy);
			
	//		$.writeln("shifting key#"+keyToCopy+" of prop '"+prop.name+"'");
			
			if ((inInterp == KeyframeInterpolationType.BEZIER) && (outInterp == KeyframeInterpolationType.BEZIER))
			{
				var tempAutoBezier = prop.keyTemporalAutoBezier(keyToCopy);
				var tempContBezier = prop.keyTemporalContinuous(keyToCopy);
			}
			if (outInterp != KeyframeInterpolationType.HOLD)
			{
				var inTempEase = prop.keyInTemporalEase(keyToCopy);
				var outTempEase = prop.keyOutTemporalEase(keyToCopy);
			}
			if ((prop.propertyValueType == PropertyValueType.TwoD_SPATIAL) || (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL))
			{
				var spatAutoBezier = prop.keySpatialAutoBezier(keyToCopy);
				var spatContBezier = prop.keySpatialContinuous(keyToCopy);
				var inSpatTangent = prop.keyInSpatialTangent(keyToCopy);
				var outSpatTangent = prop.keyOutSpatialTangent(keyToCopy);
				var roving = prop.keyRoving(keyToCopy);
			}
			
			// Create the new keyframe
			var newTime = prop.keyTime(keyToCopy) + offset;
	//		$.writeln("adding new key...");
			var newKeyIndex = prop.addKey(newTime);
	//		$.writeln("setting new key's value...");
			prop.setValueAtKey(newKeyIndex, prop.keyValue(keyToCopy));
			
			if (outInterp != KeyframeInterpolationType.HOLD)
			{
	//			$.writeln("setting temp ease...");
				prop.setTemporalEaseAtKey(newKeyIndex, inTempEase, outTempEase);
			}
			
			// Copy over the keyframe settings
	//		$.writeln("setting interp...");
			prop.setInterpolationTypeAtKey(newKeyIndex, inInterp, outInterp);
			
			if ((inInterp == KeyframeInterpolationType.BEZIER) && (outInterp == KeyframeInterpolationType.BEZIER) && tempContBezier)
			{
	//			$.writeln("setting temp cont...");
				prop.setTemporalContinuousAtKey(newKeyIndex, tempContBezier);
	//			$.writeln("setting temp auto bez...");
				prop.setTemporalAutoBezierAtKey(newKeyIndex, tempAutoBezier);		// Implies Continuous, so do after it
			}
			
			if ((prop.propertyValueType == PropertyValueType.TwoD_SPATIAL) || (prop.propertyValueType == PropertyValueType.ThreeD_SPATIAL))
			{
	//			$.writeln("setting spat cont...");
				prop.setSpatialContinuousAtKey(newKeyIndex, spatContBezier);
	//			$.writeln("setting spat auto bez...");
				prop.setSpatialAutoBezierAtKey(newKeyIndex, spatAutoBezier);		// Implies Continuous, so do after it
				
	//			$.writeln("setting spat tangents...");
				prop.setSpatialTangentsAtKey(newKeyIndex, inSpatTangent, outSpatTangent);
				
	//			$.writeln("setting roving...");
				prop.setRovingAtKey(newKeyIndex, roving);
			}
			
			// Remove the old keyframe
	//		$.writeln("removing key...");
			prop.removeKey(keyToRemove);
		}
		
		
		
		
		// rd_Scooter_scootAllPropGroupKeys()
		// 
		// Description:
		// This function shifts the specified layer's keyframes (all except markers) by the specified distance (in seconds).
		// 
		// Parameters:
		//   propGroup - PropertyGroup object (initially, the Layer object) containing keyframes.
		//   offset - Time in seconds to offset the layer's keyframes.
		// 
		// Returns:
		// None.
		//
		function rd_Scooter_scootAllPropGroupKeys(propGroup, offset)
		{
			var prop, newTime, newValue, keyIndex;
			
			// Iterate over the specified property group's properties
			for (var i=1; i<=propGroup.numProperties; i++)
			{
				var keyTimes = new Array();
				
				prop = propGroup.property(i);
				if (prop.propertyType == PropertyType.PROPERTY)			// Found a property
				{
					if (prop.matchName == "ADBE Marker")				// Skip markers; they're processed separately
						continue;
					if (!prop.isTimeVarying)							// Skip properties that aren't keyframed
						continue;
					
					// Loop through the property's keyframes in the direction such that new
					// keyframes will not affect the indices of existing keyframes
					if (offset > 0)
					{
						for (var j=prop.numKeys; j>=1; j--)
							rd_Scooter_shiftKeyToNewTime(prop, j, offset, j);
					}
					else
					{
						for (var j=1; j<=prop.numKeys; j++)
							rd_Scooter_shiftKeyToNewTime(prop, j, offset, j+1);
					}
				}
				else if (prop.propertyType == PropertyType.INDEXED_GROUP)	// Found an indexed group, so check its nested properties
					rd_Scooter_scootAllPropGroupKeys(prop, offset);
				else if (prop.propertyType == PropertyType.NAMED_GROUP)	// Found a named group, so check its nested properties
					rd_Scooter_scootAllPropGroupKeys(prop, offset);
			}
		}
		
		
		
		
		// rd_Scooter_getSelectedPropGroupKeys()
		// 
		// Description:
		// This function retrieves the selected or unselected properties and keyframes (no markers) of the specified property group.
		// 
		// Parameters:
		//   propGroup - PropertyGroup object (initially, the Layer object) containing keyframes.
		//   whichKeys - Value controlling which keys to retrieve (0 = unselected, 1 = selected)
		// 
		// Returns:
		// Array of PropInfo objects representing properties and their selected or unselected key times.
		//
		function rd_Scooter_getSelectedPropGroupKeys(propGroup, whichKeys)
		{
			var props = new Array();
			var prop, propInfo;
			
			// Iterate over the specified property group's properties
			for (var i=1; i<=propGroup.numProperties; i++)
			{
				prop = propGroup.property(i);
				if (prop.propertyType == PropertyType.PROPERTY)			// Found a property
				{
					if (prop.matchName == "ADBE Marker")				// Skip markers; they're processed separately
						continue;
					if (!prop.isTimeVarying)							// Skip properties that aren't keyframed
						continue;
					
					propInfo = new Object;
					propInfo.prop = prop;
					propInfo.keyTimes = new Array();
					
					for (var j=1; j<=prop.numKeys; j++)
						if (((whichKeys == 0) && !prop.keySelected(j)) || ((whichKeys == 1) && prop.keySelected(j)))
							propInfo.keyTimes[propInfo.keyTimes.length] = prop.keyTime(j);
					
					// If there were keys to save, add the property and its keys to the props array
					if (propInfo.keyTimes.length > 0)
						props[props.length] = propInfo;
				}
				else if (prop.propertyType == PropertyType.INDEXED_GROUP)	// Found an indexed group, so check its nested properties
					props = props.concat(rd_Scooter_getSelectedPropGroupKeys(prop, whichKeys));
				else if (prop.propertyType == PropertyType.NAMED_GROUP)	// Found a named group, so check its nested properties
					props = props.concat(rd_Scooter_getSelectedPropGroupKeys(prop, whichKeys));
			}
			
			return props;
		}
		
		
		
		
		// rd_Scooter_scootSelectedPropGroupKeys()
		// 
		// Description:
		// This function shifts the specified layer's keyframes (selected or unselected, except markers) 
		// by the specified distance (in seconds).
		// 
		// Parameters:
		//   propGroup - PropertyGroup object (initially, the Layer object) containing keyframes.
		//   offset - Time in seconds to offset the layer's keyframes.
		//   whichKeys - Value controlling which keys to offset (0 = unselected, 1 = selected)
		// 
		// Returns:
		// None.
		//
		function rd_Scooter_scootSelectedPropGroupKeys(propGroup, offset, whichKeys)
		{
			var props = rd_Scooter_getSelectedPropGroupKeys(propGroup, whichKeys);
			var prop, propKeyTimes, keyIndex;
			
			for (var i=0; i<props.length; i++)
			{
				prop = props[i].prop;
				propKeyTimes = props[i].keyTimes;
				
				
				// Loop through the property's keyframes in the direction such that new
				// keyframes will not affect the indices of existing keyframes
				if (offset > 0)
				{
					for (var j=propKeyTimes.length-1; j>=0; j--)
					{
						keyIndex = prop.nearestKeyIndex(propKeyTimes[j]);
						rd_Scooter_shiftKeyToNewTime(prop, keyIndex, offset, keyIndex);
					}
				}
				else
				{
					for (var j=0; j<propKeyTimes.length; j++)
					{
						keyIndex = prop.nearestKeyIndex(propKeyTimes[j]);
						rd_Scooter_shiftKeyToNewTime(prop, keyIndex, offset, keyIndex+1);
					}
				}
			}
		}
		
		
		
		
		// rd_Scooter_doScoot()
		// 
		// Description:
		// This function performs the actual "scooting" operation.
		// 
		// Parameters:
		//   scootDist - Amount of offset, in seconds.
		//   pal - The palette (Window object) itself.
		// 
		// Returns:
		// Nothing.
		//
		function rd_Scooter_doScoot(scootDist, pal)
		{
			// Check if any work (scooting, options) to be done
			if (scootDist == 0)
				return;
			
			var layerSrc = pal.affectPnl.c1.layerSrc.value;
			var layerInOut = pal.affectPnl.c1.layerInOut.value;
			var layerMarkers = pal.affectPnl.c1.layerMarkers.value;
			var kfsNone = pal.affectPnl.c3.kfsNone.value, kfsSelected = pal.affectPnl.c3.kfsSel.value, kfsAll = pal.affectPnl.c3.kfsAll.value;
			
			if (!layerSrc && !layerInOut && !layerMarkers && kfsNone)
			{
				alert(rd_Scooter_localize(rd_ScooterData.strErrNoWorkToDo), rd_ScooterData.scriptName);
				return;
			}
			
			// Check that a project exists
			if (app.project == null)
				return;
			
			// Get the current (active/frontmost) comp
			var comp = app.project.activeItem;
			
			if ((comp == null) || !(comp instanceof CompItem))
			{
				alert(rd_Scooter_localize(rd_ScooterData.strErrNoCompSel), rd_ScooterData.scriptName);
				return;
			}
			
			// If no layers are selected, nothing to do
			if (comp.selectedLayers.length == 0)
			{
				alert(rd_Scooter_localize(rd_ScooterData.strErrNoLayerSel), rd_ScooterData.scriptName);
				return;
			}
			
			// Process each selected layer
			app.beginUndoGroup(rd_ScooterData.scriptName);
			
			var layers = comp.selectedLayers, layer;
			var offset = scootDist * comp.frameDuration, startTime, stretch;
			
			for (var i=0; i<layers.length; i++)
			{
				layer = layers[i];
				stretch = layer.stretch / 100;
				
				if (layerSrc)						// Moving layer source?
				{
					layer.startTime += offset;
					if (!layerInOut)
					{
						layer.inPoint -= offset;
						
						// Calculate the outPoint, compensating for the stretch value and startTime. Ugh!
						startTime = layer.inPoint - ((layer.inPoint - layer.startTime) / stretch);
						layer.outPoint = layer.outPoint - startTime * stretch;
					}
					
					// If not moving all keyframes, adjust keyframes accordingly
					// Note: Keyframes need to be moved before markers; otherwise, the selected keys get unselected
					if (kfsSelected)
						rd_Scooter_scootSelectedPropGroupKeys(layer, -offset, 0);
					else if (kfsNone)
						rd_Scooter_scootAllPropGroupKeys(layer, -offset);
					
					// If moving layer source, but not markers, adjust markers accordingly
					if (!layerMarkers)
						rd_Scooter_scootLayerMarkers(layer, -offset)
				}
				else if (layerInOut) 				// Moving layer in/out?
				{
					layer.inPoint += offset;
					
					// Calculate the outPoint, compensating for the stretch value and startTime. Ugh!
					startTime = layer.inPoint - ((layer.inPoint - layer.startTime) / stretch);
					layer.outPoint = layer.outPoint - startTime * stretch;
				}
				
				// If moving all or some keyframes, adjust accordingly
				// Note: Keyframes need to be moved before markers; otherwise, the selected keys get unselected
				if (!layerSrc)
				{
					if (kfsSelected)
						rd_Scooter_scootSelectedPropGroupKeys(layer, offset, 1);
					else if (kfsAll)
						rd_Scooter_scootAllPropGroupKeys(layer, offset);
				}
				
				if (layerMarkers)					// Moving layer markers?
				{
					// If moving markers, but not layer source, adjust markers accordingly
					if (!layerSrc)
						rd_Scooter_scootLayerMarkers(layer, offset)
				}
			}
			
			app.endUndoGroup();
		}
		
		
		
		
		// main code:
		//
		
		// Prerequisites check
		if (parseFloat(app.version) < 8.0)
			alert(rd_Scooter_localize(rd_ScooterData.strMinAE80), rd_ScooterData.scriptName);
		else
		{
			// Build and show the console's floating palette
			var rdscPal = rd_Scooter_buildUI(thisObj);
			if (rdscPal != null)
			{
				// Update UI values, if saved in the settings
				if (app.settings.haveSetting("redefinery", "rd_Scooter_layerSrc"))
					rdscPal.grp.affectPnl.c1.layerSrc.value = (app.settings.getSetting("redefinery", "rd_Scooter_layerSrc") == "false") ? false : true;
				if (app.settings.haveSetting("redefinery", "rd_Scooter_layerInOut"))
					rdscPal.grp.affectPnl.c1.layerInOut.value = (app.settings.getSetting("redefinery", "rd_Scooter_layerInOut") == "false") ? false : true;
				if (app.settings.haveSetting("redefinery", "rd_Scooter_layerMarkers"))
					rdscPal.grp.affectPnl.c1.layerMarkers.value = (app.settings.getSetting("redefinery", "rd_Scooter_layerMarkers") == "false") ? false : true;
				
				if (app.settings.haveSetting("redefinery", "rd_Scooter_kfsNone"))
					rdscPal.grp.affectPnl.c3.kfsNone.value = (app.settings.getSetting("redefinery", "rd_Scooter_kfsNone") == "false") ? false : true;
				if (app.settings.haveSetting("redefinery", "rd_Scooter_kfsSel"))
					rdscPal.grp.affectPnl.c3.kfsSel.value = (app.settings.getSetting("redefinery", "rd_Scooter_kfsSel") == "false") ? false : true;
				if (app.settings.haveSetting("redefinery", "rd_Scooter_kfsAll"))
					rdscPal.grp.affectPnl.c3.kfsAll.value = (app.settings.getSetting("redefinery", "rd_Scooter_kfsAll") == "false") ? false : true;
				
				if (app.settings.haveSetting("redefinery", "rd_Scooter_rewValue"))
					rdscPal.grp.flds.rewVal.text = app.settings.getSetting("redefinery", "rd_Scooter_rewValue").toString();
				if (app.settings.haveSetting("redefinery", "rd_Scooter_prevValue"))
					rdscPal.grp.flds.prevVal.text = app.settings.getSetting("redefinery", "rd_Scooter_prevValue").toString();
				if (app.settings.haveSetting("redefinery", "rd_Scooter_nextValue"))
					rdscPal.grp.flds.nextVal.text = app.settings.getSetting("redefinery", "rd_Scooter_nextValue").toString();
				if (app.settings.haveSetting("redefinery", "rd_Scooter_fwdValue"))
					rdscPal.grp.flds.fwdVal.text = app.settings.getSetting("redefinery", "rd_Scooter_fwdValue").toString();
				
				// Save current UI settings upon closing the palette
				rdscPal.onClose = function()
				{
					app.settings.saveSetting("redefinery", "rd_Scooter_layerSrc", rdscPal.grp.affectPnl.c1.layerSrc.value);
					app.settings.saveSetting("redefinery", "rd_Scooter_layerInOut", rdscPal.grp.affectPnl.c1.layerInOut.value);
					app.settings.saveSetting("redefinery", "rd_Scooter_layerMarkers", rdscPal.grp.affectPnl.c1.layerMarkers.value);
					
					app.settings.saveSetting("redefinery", "rd_Scooter_kfsNone", rdscPal.grp.affectPnl.c3.kfsNone.value);
					app.settings.saveSetting("redefinery", "rd_Scooter_kfsSel", rdscPal.grp.affectPnl.c3.kfsSel.value);
					app.settings.saveSetting("redefinery", "rd_Scooter_kfsAll", rdscPal.grp.affectPnl.c3.kfsAll.value);
					
					app.settings.saveSetting("redefinery", "rd_Scooter_rewValue", rdscPal.grp.flds.rewVal.text);
					app.settings.saveSetting("redefinery", "rd_Scooter_prevValue", rdscPal.grp.flds.prevVal.text);
					app.settings.saveSetting("redefinery", "rd_Scooter_nextValue", rdscPal.grp.flds.nextVal.text);
					app.settings.saveSetting("redefinery", "rd_Scooter_fwdValue", rdscPal.grp.flds.fwdVal.text);
				}
				
				if (rdscPal instanceof Window)
				{
					// Show the palette
					rdscPal.center();
					rdscPal.show();
				}
				else
					rdscPal.layout.layout(true);
			}
		}
	}
	
	
	rd_Scooter(this);
}
