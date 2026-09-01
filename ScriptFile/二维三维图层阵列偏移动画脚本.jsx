/* 

名称: 二维三维图层阵列偏移动画
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
	var currentComp;
	var compName;
	var compLayers;
	
	var win = ( this instanceof Panel) ? this : new Window("dialog", "图层阵列效果偏移动画批量复制控制脚本", "x:300,y:300,width:350,height:125");
	win.grp1 = win.add('group', [25,15,355,130], 'Title of Comp'); 
	win.grp1.titleSt = win.grp1.add('statictext', "x:15,y:5,width:150,height:20", '输入复制图层数量:');
	win.grp1.number_layers = win.grp1.add('edittext', "x:15,y:25,width:120,height:25", "改我填数");
	win.grp1.titleSt = win.grp1.add('statictext', "x:180,y:20,width:150,height:20", '三维层模式:');		
	win.grp1.threeDLayer = win.grp1.add('checkbox', "x:270,y:22,width:15,height:15");
	win.grp1.buildBtn = win.grp1.add('button', "x:15,y:60,width:120,height:30",	'开启阵列', {name:'ok'});
	win.grp1.buildBtn.onClick = makeChecks;
		
	if (!(win instanceof Panel))
	{
		win.grp1.cancelBtn = win.grp1.add('button', "x:200,y:60,width:100,height:30", 'Cancel', {name:'cancel'});
		win.show();
	}
}

function makeChecks() {
	currentComp = app.project.activeItem;
	if (currentComp != undefined)
	{
		if (!checkDuplicateComps(currentComp.name))
		{
			if (currentComp.selectedLayers.length == 1)
			{
				if (check_Number(win.grp1.number_layers, "Number of Layers"))
				{
					app.beginUndoGroup("Layer Repeater");
					make_repeater();
					app.endUndoGroup();
				}
			} else
				alert("You must select exactly 1 layer");
		} else
			alert("You can not have more than one comp named \""+currentComp.name+"\"");
	} else
		alert("You must have your comp window active for the comp you want to repeat layers in.");
}

function checkDuplicateComps(name)
{
	var allItems = app.project.items;
	var count = 0;
	for (i=1;i<=allItems.length;i++)
	{
		if (name == allItems[i].name)
			count++
		if (count > 1)
			return 1;
	}
	return 0;
}

function check_Number(field, error_string) {
	if (isNaN(field.text)) {
		alert(error_string + " must be a number");
		field.text = 1;
		return 0;
	} else if(field.text < 1) {
		alert(error_string + " must be greater than 0");
		field.text = 1;
		return 0;
	}
	return 1;
}
	
function make_repeater() {
		
	if (!(win instanceof Panel))
		win.close();
	
	compName = currentComp.name;
	compLayers = currentComp.layers;
	
	var selectedLayer = currentComp.selectedLayers[0];
	var selected_layer_name = selectedLayer.name;
	var selected_layer_anchor_point = selectedLayer.property("Transform").property("Anchor Point").value;
	var selected_layer_position = selectedLayer.property("Transform").property("Position").value;
	var selected_layer_rotation = {};
	selected_layer_rotation[0] = selectedLayer.property("Transform").property("X Rotation").value;
	selected_layer_rotation[1] = selectedLayer.property("Transform").property("Y Rotation").value;
	selected_layer_rotation[2] = selectedLayer.property("Transform").property("Rotation").value;
	var selected_layer_scale = selectedLayer.property("Transform").property("Scale").value;
	var selected_layer_opacity = selectedLayer.property("Transform").property("Opacity").value;
	
    // add selection to have 2d/3d repeater
	var threeDRepeater = win.grp1.threeDLayer.value;
    
    if (threeDRepeater)
        selectedLayer.threeDLayer = true;
	
	var precompose_layers = new Array();
	precompose_layers[0] = selectedLayer.index;
	
	var num_layers = win.grp1.number_layers.text;
	var original_layer_name = selected_layer_name.substring(0,20);
	var repeater_layer_name = original_layer_name + "-Repeater";
	var repeater_comp = compLayers.precompose(precompose_layers, repeater_layer_name, true);
	var repeater_comp_layers = repeater_comp.layers;
	var duplicate_layer = repeater_comp_layers[1];

	for (i=1;  i<num_layers; i++) {
		duplicate_layer.duplicate();
	}

	var repeater_layer = currentComp.selectedLayers[0];
	
	// set collapse transformations to true, so camera movements in the layer_repeater comp will get sent to all the layers
	repeater_layer.collapseTransformation = true;
	if (threeDRepeater)
		repeater_layer.threeDLayer = true;
	repeater_comp_layers = repeater_comp.layers;
	var controlNull = currentComp.layers.addNull();

	controlNull_name = "Layer Repeater Controls-"+original_layer_name;
	controlNull.name = controlNull_name.substring(0,31);
	
	//add expression effects
	if (repeater_layer("ADBE Effect Parade") != null) { 
	// Always best to check if it's safe before adding: 
		
		if (repeater_layer("ADBE Effect Parade").canAddProperty("ADBE Slider Control")) { 
			
			var temp_number_visible = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_number_visible.name = "Number Visible";				
			
			var number_offset = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			number_offset.name = "Number Offset";				
			
			var temp_anchor_point_X = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_anchor_point_X.name = "Anchor Point X";

			var temp_anchor_point_Y = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_anchor_point_Y.name = "Anchor Point Y";
			
			if (threeDRepeater)
			{
				var temp_anchor_point_Z = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
				temp_anchor_point_Z.name = "Anchor Point Z";
			}
				
			var temp_position_X = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_position_X.name = "Position X";

			var temp_position_X_offset = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_position_X_offset.name = "Position X Offset";	
			
			var temp_position_Y = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_position_Y.name = "Position Y";

			var temp_position_Y_offset = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_position_Y_offset.name = "Position Y Offset";
			
			if (threeDRepeater)
			{
				var temp_position_Z = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
				temp_position_Z.name = "Position Z";

				var temp_position_Z_offset= controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
				temp_position_Z_offset.name = "Position Z Offset";
						
				var temp_rotation_X = controlNull("ADBE Effect Parade").addProperty("ADBE Angle Control"); 
				temp_rotation_X.name = "Rotation X";			
			
				var temp_rotation_X_offset = controlNull("ADBE Effect Parade").addProperty("ADBE Angle Control"); 
				temp_rotation_X_offset.name = "Rotation X Offset";
			
				var temp_rotation_Y = controlNull("ADBE Effect Parade").addProperty("ADBE Angle Control"); 
				temp_rotation_Y.name = "Rotation Y";			
			
				var temp_rotation_Y_offset = controlNull("ADBE Effect Parade").addProperty("ADBE Angle Control"); 
				temp_rotation_Y_offset.name = "Rotation Y Offset";
				
			}
			
			var temp_rotation_Z = controlNull("ADBE Effect Parade").addProperty("ADBE Angle Control"); 
			temp_rotation_Z.name = "Rotation Z";			
			
			var temp_rotation_Z_offset = controlNull("ADBE Effect Parade").addProperty("ADBE Angle Control"); 
			temp_rotation_Z_offset.name = "Rotation Z Offset";
			
			var temp_scale_X = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_scale_X.name = "Scale X";

			var temp_scale_X_offset = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_scale_X_offset.name = "Scale X Offset";
			
			var temp_scale_Y = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_scale_Y.name = "Scale Y";

			var temp_scale_Y_offset = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_scale_Y_offset.name = "Scale Y Offset";
			
			if (threeDRepeater)
			{
				var temp_scale_Z = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
				temp_scale_Z.name = "Scale Z";

				var temp_scale_Z_offset= controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
				temp_scale_Z_offset.name = "Scale Z Offset";
			}
			
			var temp_opacity_begin_end = controlNull("ADBE Effect Parade").addProperty("ADBE Checkbox Control");
			temp_opacity_begin_end.name = "Opacity Begin-End";
			
			var temp_opacity_begin = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_opacity_begin.name = "Opacity Begin";
			
			var temp_opacity_end = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_opacity_end.name = "Opacity End";

			var temp_opacity = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_opacity.name = "Opacity";

			var temp_opacity_offset = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_opacity_offset.name = "Opacity Offset";
			
			var temp_frame_offset = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_frame_offset.name = "Frame Offset";
			
			var temp_random_frame_amount = controlNull("ADBE Effect Parade").addProperty("ADBE Slider Control"); 
			temp_random_frame_amount.name = "Random Frame Amount";

			/*
				NOTE: can't set all values here, because making more than one property at a time deletes the variable of the previous property;
				search for effects again below
			*/
		}
	}

	var number_visible;
	var number_offset;
	var anchor_point_X;
	var anchor_point_Y;
	var anchor_point_Z;	
	var position_X;
	var position_X_offset;
	var position_Y;
	var position_Y_offset;
	var position_Z;
	var position_Z_offset;
	var rotation_X;
	var rotation_X_offset;
	var rotation_Y;
	var rotation_Y_offset;
	var rotation_Z;
	var rotation_Z_offset;
	var scale_X;	
	var scale_X_offset;
	var scale_Y;	
	var scale_Y_offset;
	var scale_Z;	
	var scale_Z_offset;
	var opacity_begin_end;
	var opacity_begin;
	var opacity_end;
	var opacity;
	var opacity_offset;		
	var frame_offset;
	var random_frame_amount;

	for (var i=1; i <= controlNull.numProperties; ++i) {

		var AAA = controlNull.property(i);
		if (controlNull.property(i).matchName == "ADBE Effect Parade") {
			
			currentEffects = controlNull.property(i);
			
			for (var j=1; j <= currentEffects.numProperties; ++j) {
				
				if (currentEffects.property(j).name == "Number Visible")
					number_visible = currentEffects.property(j);
				if (currentEffects.property(j).name == "Number Offset")
					number_offset = currentEffects.property(j);				
				if (currentEffects.property(j).name == "Anchor Point X")
					anchor_point_X = currentEffects.property(j);
				if (currentEffects.property(j).name == "Anchor Point Y")
					anchor_point_Y = currentEffects.property(j);	
				if (threeDRepeater)
				{
					if (currentEffects.property(j).name == "Anchor Point Z")
						anchor_point_Z = currentEffects.property(j);									
				}
				if (currentEffects.property(j).name == "Position X")
					position_X = currentEffects.property(j);
				if (currentEffects.property(j).name == "Position X Offset")
					position_X_offset = currentEffects.property(j);
				if (currentEffects.property(j).name == "Position Y")
					position_Y = currentEffects.property(j);
				if (currentEffects.property(j).name == "Position Y Offset")
					position_Y_offset = currentEffects.property(j);

				if (threeDRepeater)
				{					
					if (currentEffects.property(j).name == "Position Z")
						position_Z = currentEffects.property(j);					
					if (currentEffects.property(j).name == "Position Z Offset")
						position_Z_offset = currentEffects.property(j);
					if (currentEffects.property(j).name == "Rotation X")
						rotation_X = currentEffects.property(j);
					if (currentEffects.property(j).name == "Rotation X Offset")
						rotation_X_offset = currentEffects.property(j);
					if (currentEffects.property(j).name == "Rotation Y")
						rotation_Y = currentEffects.property(j);
					if (currentEffects.property(j).name == "Rotation Y Offset")
						rotation_Y_offset = currentEffects.property(j);
					if (currentEffects.property(j).name == "Scale Z")
						scale_Z = currentEffects.property(j);
					if (currentEffects.property(j).name == "Scale Z Offset")
						scale_Z_offset = currentEffects.property(j);
				}
				if (currentEffects.property(j).name == "Rotation Z")
					rotation_Z = currentEffects.property(j);			
				if (currentEffects.property(j).name == "Rotation Z Offset")
					rotation_Z_offset = currentEffects.property(j);
				if (currentEffects.property(j).name == "Scale X")
					scale_X = currentEffects.property(j);
				if (currentEffects.property(j).name == "Scale X Offset")
					scale_X_offset = currentEffects.property(j);
				if (currentEffects.property(j).name == "Scale Y")
					scale_Y = currentEffects.property(j);
				if (currentEffects.property(j).name == "Scale Y Offset")
					scale_Y_offset = currentEffects.property(j);					
				if (currentEffects.property(j).name == "Opacity Begin-End")
					opacity_begin_end = currentEffects.property(j);
				if (currentEffects.property(j).name == "Opacity Begin")
					opacity_begin = currentEffects.property(j);
				if (currentEffects.property(j).name == "Opacity End")
					opacity_end = currentEffects.property(j);				
				if (currentEffects.property(j).name == "Opacity")
					opacity = currentEffects.property(j);				
				if (currentEffects.property(j).name == "Opacity Offset")
					opacity_offset = currentEffects.property(j);
				if (currentEffects.property(j).name == "Frame Offset")
					frame_offset = currentEffects.property(j);		
				if (currentEffects.property(j).name == "Random Frame Amount")
					random_frame_amount = currentEffects.property(j);	
			}
		}
	}

	var number_visible_MN = number_visible.property(1).matchName;
	var number_offset_MN = number_offset.property(1).matchName;
	var anchor_point_X_MN = anchor_point_X.property(1).matchName;
	var anchor_point_Y_MN = anchor_point_Y.property(1).matchName;

	if (threeDRepeater)
	{	
		var anchor_point_Z_MN = anchor_point_Z.property(1).matchName;
		var position_Z_MN = position_Z.property(1).matchName;
		var position_Z_offset_MN = position_Z_offset.property(1).matchName;
		var rotation_X_MN = rotation_X.property(1).matchName;
		var rotation_X_offset_MN = rotation_X_offset.property(1).matchName;
		var rotation_Y_MN = rotation_Y.property(1).matchName;
		var rotation_Y_offset_MN = rotation_Y_offset.property(1).matchName;
		var scale_Z_MN = scale_Z.property(1).matchName;
		var scale_Z_offset_MN = scale_Z_offset.property(1).matchName;
	}
	
	var position_X_MN = position_X.property(1).matchName;
	var position_X_offset_MN = position_X_offset.property(1).matchName;
	var position_Y_MN = position_Y.property(1).matchName;
	var position_Y_offset_MN= position_Y_offset.property(1).matchName;
	var rotation_Z_MN = rotation_Z.property(1).matchName;
	var rotation_Z_offset_MN = rotation_Z_offset.property(1).matchName;
	var scale_X_MN = scale_X.property(1).matchName;
	var scale_X_offset_MN = scale_X_offset.property(1).matchName;
	var scale_Y_MN = scale_Y.property(1).matchName;
	var scale_Y_offset_MN = scale_Y_offset.property(1).matchName;
	var opacity_begin_end_MN = opacity_begin_end.property(1).matchName;
	var opacity_begin_MN = opacity_begin.property(1).matchName;
	var opacity_end_MN = opacity_end.property(1).matchName;
	var opacity_MN = opacity.property(1).matchName;
	var opacity_offset_MN = opacity_offset.property(1).matchName;
	var frame_offset_MN = frame_offset.property(1).matchName;
	var random_frame_amount_MN = random_frame_amount.property(1).matchName;

	number_visible.property(1).setValue(num_layers);	
	number_offset.property(1).setValue("0");
	anchor_point_X.property(1).setValue(selected_layer_anchor_point[0]);
	anchor_point_Y.property(1).setValue(selected_layer_anchor_point[1]);
	if (threeDRepeater)
	{
		anchor_point_Z.property(1).setValue(selected_layer_anchor_point[2]);	
	}
	position_X_offset.property(1).setValue("0");
	position_X.property(1).setValue(selected_layer_position[0]);
	position_Y_offset.property(1).setValue("0");
	position_Y.property(1).setValue(selected_layer_position[1]);
	if (threeDRepeater)
	{		
		position_Z.property(1).setValue(selected_layer_position[2]);		
		position_Z_offset.property(1).setValue("0");
		rotation_X.property(1).setValue(selected_layer_rotation[0]);		
		rotation_X_offset.property(1).setValue("0");
		rotation_Y.property(1).setValue(selected_layer_rotation[1]);			
		rotation_Y_offset.property(1).setValue("0");
		scale_Z.property(1).setValue(selected_layer_scale[2]);		
		scale_Z_offset.property(1).setValue("100");
	}
	rotation_Z.property(1).setValue(selected_layer_rotation[2]);			
	rotation_Z_offset.property(1).setValue("0");
	scale_X.property(1).setValue(selected_layer_scale[0]);		
	scale_X_offset.property(1).setValue("100");
	scale_Y.property(1).setValue(selected_layer_scale[1]);	
	scale_Y_offset.property(1).setValue("100");
	opacity_begin_end.property(1).setValue("1");
	opacity_begin.property(1).setValue("100");
	opacity_end.property(1).setValue("100");	
	opacity.property(1).setValue(selected_layer_opacity);
	opacity_offset.property(1).setValue("100");
	frame_offset.property(1).setValue("0");
	random_frame_amount.property(1).setValue("0");
	
	//make our match name variables so the effects can be referenced in any language

	//make our expressions
	for (var i=1;i<=num_layers;i++) {
		var current_layer = repeater_comp_layers[i];
		
		// we need to find out how many digits our number is, to make sure our layer name does not go over 31 (necessary for AFX < CS5.5)
		var num_layers_digits = Math.floor(Math.log(num_layers)/2.302585092994046+1);
		
		//max layer name size is 31
		//we subtract the number of digits plus "-"
		//technically, this limits our amount of layers to 10^28, but I think we'll be ok
		var current_layer_name = current_layer.name.substring(0,(30-num_layers_digits));
		current_layer_name = current_layer_name + "-" + i;
		current_layer.name = current_layer_name;
		
		for (var j=1; j <= current_layer.numProperties; j++) {
			
			var current_property = current_layer.property(j);

			if (current_property.matchName == "ADBE Transform Group") {
				
				var anchor_point_property= current_property(1); //anchor point
				var position_property = current_property.Position;
				if (threeDRepeater)
				{	
					var rotation_X_property = current_property.xRotation;
					var rotation_Y_property = current_property.yRotation;
				}
				var rotation_Z_property = current_property.Rotation;
				var scale_property = current_property.Scale;
				var opacity_property= current_property.Opacity;
				
				if (anchor_point_property.canSetExpression) {
					
					var anchor_point_expression = 
					"frame = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Frame Offset\")(\""+frame_offset_MN+"\")*(index-1);\n" +	
					"seedRandom(index, 1);\n" +
					"random_frame_amount = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Random Frame Amount\")(\""+random_frame_amount_MN+"\");\n" +
					"random_frame_addition = random(random_frame_amount*2)-random_frame_amount;\n" +
					"frame+= random_frame_addition;\n" +
					"time_offset = framesToTime(frame, fps = 1.0 / comp(\"" +  compName+ "\").frameDuration);\n"+
					"newTime = time-time_offset;\n" +
					"anchor_point_X = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Anchor Point X\")(\""+anchor_point_X_MN+"\").valueAtTime(newTime);\n" +
					"anchor_point_Y = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Anchor Point Y\")(\""+anchor_point_Y_MN+"\").valueAtTime(newTime);\n";
					if (threeDRepeater)
					{
						anchor_point_expression += "anchor_point_Z = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Anchor Point Z\")(\""+anchor_point_Z_MN+"\").valueAtTime(newTime);\n" +
																"[anchor_point_X, anchor_point_Y, anchor_point_Z]";
					}
					else
					{
						anchor_point_expression += "[anchor_point_X, anchor_point_Y]";
					}
			
					anchor_point_property.expression=anchor_point_expression;
					anchor_point_property.expressionEnabled=true;
				}
				
				if (position_property.canSetExpression) {

					var position_expression = 
					"frame = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Frame Offset\")(\""+frame_offset_MN+"\")*(index-1);\n" +	
					"seedRandom(index, 1);\n" +
					"random_frame_amount = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Random Frame Amount\")(\""+random_frame_amount_MN+"\");\n" +
					"random_frame_addition = random(random_frame_amount*2)-random_frame_amount;\n" +
					"frame+= random_frame_addition;\n" +
					"time_offset = framesToTime(frame, fps = 1.0 / comp(\"" +  compName+ "\").frameDuration);\n"+
					"newTime = time-time_offset;\n" +
					"X_offset = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Position X Offset\")(\""+position_X_offset_MN+"\").valueAtTime(newTime)*(index-1);\n" +
					"Y_offset = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Position Y Offset\")(\""+position_Y_offset_MN+"\").valueAtTime(newTime)*(index-1);\n";
					if (threeDRepeater)
					{
						position_expression += "Z_offset = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Position Z Offset\")(\""+position_Z_offset_MN+"\").valueAtTime(newTime)*(index-1);\n";
					}
					position_expression += "baseX = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Position X\")(\""+position_X_MN+"\").valueAtTime(newTime);\n" +
													"baseY = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Position Y\")(\""+position_Y_MN+"\").valueAtTime(newTime);\n";
					if (threeDRepeater)
					{
						position_expression += "baseZ= comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Position Z\")(\""+position_Z_MN+"\").valueAtTime(newTime);\n" +
														"[baseX+X_offset, baseY+Y_offset, baseZ+Z_offset]";
					} else
					{
						position_expression += "[baseX+X_offset, baseY+Y_offset]";
					}
					
					position_property.expression=position_expression;
					position_property.expressionEnabled=true;
				}
				if (threeDRepeater)
				{
					if (rotation_X_property.canSetExpression) {
					
						var rotation_expression = 
						"frame = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Frame Offset\")(\""+frame_offset_MN+"\")*(index-1);\n" +	
					"seedRandom(index, 1);\n" +
					"random_frame_amount = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Random Frame Amount\")(\""+random_frame_amount_MN+"\");\n" +
					"random_frame_addition = random(random_frame_amount*2)-random_frame_amount;\n" +
					"frame+= random_frame_addition;\n" +
					"time_offset = framesToTime(frame, fps = 1.0 / comp(\"" +  compName+ "\").frameDuration);\n"+
					"newTime = time-time_offset;\n" +
						"X_offset = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Rotation X Offset\")(\""+rotation_X_offset_MN+"\").valueAtTime(newTime)*(index-1);\n" +
						"baseX = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Rotation X\")(\""+rotation_X_MN+"\").valueAtTime(newTime);\n" +
						"[baseX+X_offset]";					

						rotation_X_property.expression=rotation_expression;
						rotation_X_property.expressionEnabled=true;
					}
				
					if (rotation_Y_property.canSetExpression) {
					
						var rotation_expression = 
						"frame = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Frame Offset\")(\""+frame_offset_MN+"\")*(index-1);\n" +	
					"seedRandom(index, 1);\n" +
					"random_frame_amount = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Random Frame Amount\")(\""+random_frame_amount_MN+"\");\n" +
					"random_frame_addition = random(random_frame_amount*2)-random_frame_amount;\n" +
					"frame+= random_frame_addition;\n" +
					"time_offset = framesToTime(frame, fps = 1.0 / comp(\"" +  compName+ "\").frameDuration);\n"+
					"newTime = time-time_offset;\n" +
						"Y_offset = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Rotation Y Offset\")(\""+rotation_Y_offset_MN+"\").valueAtTime(newTime)*(index-1);\n" +
						"baseY = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Rotation Y\")(\""+rotation_Y_MN+"\").valueAtTime(newTime);\n" +
						"[baseY+Y_offset]";					

						rotation_Y_property.expression=rotation_expression;
						rotation_Y_property.expressionEnabled=true;
					}
				}
			
				if (rotation_Z_property.canSetExpression) {
					
					var rotation_expression = 
					"frame = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Frame Offset\")(\""+frame_offset_MN+"\")*(index-1);\n" +	
					"seedRandom(index, 1);\n" +
					"random_frame_amount = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Random Frame Amount\")(\""+random_frame_amount_MN+"\");\n" +
					"random_frame_addition = random(random_frame_amount*2)-random_frame_amount;\n" +
					"frame+= random_frame_addition;\n" +
					"time_offset = framesToTime(frame, fps = 1.0 / comp(\"" +  compName+ "\").frameDuration);\n"+
					"newTime = time-time_offset;\n" +
					"Z_offset = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Rotation Z Offset\")(\""+rotation_Z_offset_MN+"\").valueAtTime(newTime)*(index-1);\n" +
					"baseZ= comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Rotation Z\")(\""+rotation_Z_MN+"\").valueAtTime(newTime);\n" +
					"[baseZ+Z_offset]";					

					rotation_Z_property.expression=rotation_expression;
					rotation_Z_property.expressionEnabled=true;
				}
			
				if (scale_property.canSetExpression) {
					
					var scale_expression = 
					"frame = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Frame Offset\")(\""+frame_offset_MN+"\")*(index-1);\n" +	
					"seedRandom(index, 1);\n" +
					"random_frame_amount = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Random Frame Amount\")(\""+random_frame_amount_MN+"\");\n" +
					"random_frame_addition = random(random_frame_amount*2)-random_frame_amount;\n" +
					"frame+= random_frame_addition;\n" +
					"time_offset = framesToTime(frame, fps = 1.0 / comp(\"" +  compName+ "\").frameDuration);\n"+
					"newTime = time-time_offset;\n" +
					
					"scaleX_offset = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Scale X Offset\")(\""+scale_X_offset_MN+"\").valueAtTime(newTime)/100;\n" + 
					"scaleY_offset = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Scale Y Offset\")(\""+scale_Y_offset_MN+"\").valueAtTime(newTime)/100;\n";
					if (threeDRepeater)
					{
						scale_expression += "scaleZ_offset = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Scale Z Offset\")(\""+scale_Z_offset_MN+"\").valueAtTime(newTime)/100;\n";
					}		
				
					scale_expression += "scaleBaseX = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Scale X\")(\""+scale_X_MN+"\").valueAtTime(newTime);\n" +
												"scaleBaseY = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Scale Y\")(\""+scale_Y_MN+"\").valueAtTime(newTime);\n";
					if (threeDRepeater)
					{
						scale_expression += "scaleBaseZ = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Scale Z\")(\""+scale_Z_MN+"\").valueAtTime(newTime);\n";
					}
				
					scale_expression +=
						"tempX = scaleBaseX;\n" +
						"tempY = scaleBaseY;\n";
					if (threeDRepeater)
						scale_expression += "tempZ = scaleBaseZ;\n";
					
					scale_expression +=
						"for (j=0;j<(index-1);j++) {\n" +
							"\tnewtempX = tempX*scaleX_offset;\n" +
							"\ttempX = newtempX;\n" +
							"\tnewtempY = tempY*scaleY_offset;\n" +
							"\ttempY = newtempY;\n";
					if (threeDRepeater)
					{
						scale_expression +=
							"\tnewtempZ = tempZ*scaleZ_offset;\n" +
							"\ttempZ = newtempZ;\n";
					}
					scale_expression += "}\n";
					if (!threeDRepeater)
						scale_expression += "[tempX, tempY]";
					else
						scale_expression += "[tempX, tempY, tempZ]";
										
					scale_property.expression=scale_expression;
					scale_property.expressionEnabled=true;

				}
				if (opacity_property.canSetExpression) {
					

					var opacity_expression = 
					"frame = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Frame Offset\")(\""+frame_offset_MN+"\")*(index-1);\n" +	
					"seedRandom(index, 1);\n" +
					"random_frame_amount = comp(\"" +  compName+ "\").layer(\""+controlNull.name+"\").effect(\"Random Frame Amount\")(\""+random_frame_amount_MN+"\");\n" +
					"random_frame_addition = random(random_frame_amount*2)-random_frame_amount;\n" +
					"frame+= random_frame_addition;\n" +
					"time_offset = framesToTime(frame, fps = 1.0 / comp(\"" +  compName+ "\").frameDuration);\n"+
					"newTime = time-time_offset;\n" +
					"layer_number = index;" +
					"number_visible = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Number Visible\")(\""+number_visible_MN+"\");\n" + 
					"number_offset = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Number Offset\")(\""+number_offset_MN+"\");\n" + 
					"opacity_begin_end = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Opacity Begin-End\")(\""+opacity_begin_end_MN+"\");\n" + 
					"opacity_begin = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Opacity Begin\")(\""+opacity_begin_MN+"\");\n" + 
					"opacity_end = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Opacity End\")(\""+opacity_end_MN+"\");\n" + 
					"first_number = number_offset;\n" +
					"last_number = number_offset + number_visible;\n" +
					"number_difference = layer_number-first_number;\n" +
					"if (layer_number-1 < first_number || layer_number > last_number)\n" +
						"\ttemp=0;\n" +
					"else {\n" +
						"\t if (opacity_begin_end==1) {\n" +
							"\t\t if (number_visible > 1) {\n" +
								"\t\t\t opacity_difference = (opacity_end-opacity_begin)/(number_visible-1);\n" +					
								"\t\t\t opacityOffset = opacity_difference;\n" +
							"\t\t } else\n" +
								"\t\t\t opacityOffset = 0\n" +
							"\t\t temp = opacity_begin;\n" +
						"\t }\n" +
						"\t else {\n" +
							"\t\t opacityOffset = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Opacity Offset\")(\""+opacity_offset_MN+"\").valueAtTime(newTime)/100;\n" + 
							"\t\t opacityBase = comp(\"" + compName + "\").layer(\""+controlNull.name+"\").effect(\"Opacity\")(\""+opacity_MN+"\").valueAtTime(newTime);\n" +
							"\t\t if (opacityOffset < 0)\n" +
								"\t\t\t opacityOffset=0;\n" +
							"\t\t else if (opacityOffset > 100)\n" +
								"\t\t\t opacityOffset = 100;\n" +
							"\t\t if (opacityBase < 0)\n" +
								"\t\t\t opacityBase=0;\n" +
							"\t\t else if (opacityBase > 100)\n" +
								"\t\t\t opacityBase = 100;\n" +
							"\t\t temp = opacityBase;\n" +
						"\t }\n" +
						"\t for (j=0;j<number_difference-1;j++) {\n" +
							"\t\t if (opacity_begin_end==1)\n" +
								"\t\t\t newtemp = temp+opacityOffset;\n" +
							"\t\t else\n" +
								"\t\t\t newtemp = temp*opacityOffset;\n" +
							"\t\t temp=newtemp;\n" +
						"\t}\n" +
					"}\n" +
					"temp";
					
					opacity_property.expression=opacity_expression;
					opacity_property.expressionEnabled=true;
				}
			}
		}
	}
}
