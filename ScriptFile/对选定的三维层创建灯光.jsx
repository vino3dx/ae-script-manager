/* 

名称: Mask居中
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

var activeItem = app.project.activeItem;

if ( (activeItem == null) || !(activeItem instanceof CompItem) ) {
	
} else {
	var selectedLayers = activeItem.selectedLayers;
	var selNum = activeItem.selectedLayers.length;
	if (!(selNum == 1)) {
		if (selNum == 0) {selNum = "操作错误："} 
		alert(selNum + " 先选中图层，然后再点我");
	} else {
		mainPlane = selectedLayers[0];
		origMainPlane = null;
		planesParent=mainPlane.parent;
		
		if (!mainPlane.threeDLayer) {
			alert("不是3D图层。");
		}else{
			
			planeName = mainPlane.name;
			///////////////////////////////////////////////////////
			app.beginUndoGroup("Place Light");
			if (planesParent != null) {
				// swicheroo
				origMainPlane = mainPlane;
				mainPlane = ( mainPlane.duplicate() );
				// 'bake' parented values:
				mainPlane.parent = null;
			}
			timeNow = mainPlane.time;
			startPos = mainPlane.position.valueAtTime(timeNow, false);
			ori=mainPlane.property("orientation").valueAtTime(timeNow, false);
			rots=[mainPlane.property("X Rotation").valueAtTime(timeNow, false), mainPlane.property("Y Rotation").valueAtTime(timeNow, false), mainPlane.property("Z Rotation").valueAtTime(timeNow, false)];
			// there is undoubtedly a formula to calculate the best distance, but for now, do rough back-off ...
			scFctrX=mainPlane.property("Scale").valueAtTime(timeNow, false)[0]*.01;
			scFctrY=mainPlane.property("Scale").valueAtTime(timeNow, false)[1]*.01;
			// based on size (scale factored in) of plane
			zAdj=( (mainPlane.width*scFctrX)+(mainPlane.height*scFctrY) )/2;
			if (planesParent != null) {
				// switcheroo backeroo
				doomedLayer = mainPlane;
				mainPlane=origMainPlane;
				doomedLayer.remove();
			}
			
			///////////////////////////////////////////////////////
			newName=(planeName.substr(0,25));//truncate for new object's name
			newLight=activeItem.layers.addLight((newName + "_light"), [activeItem.width/2, activeItem.height/2]);
			newLight.autoOrient = AutoOrientType.NO_AUTO_ORIENT;
			// light gets positioned at plane's point in space, but backed off a bit in z
			newLight.property("position").setValue([startPos[0], startPos[1], (startPos[2]-zAdj)]);
			
			tempNull = activeItem.layers.addNull();
			tempNull.threeDLayer=true;
			// i don't think this makes any diff, but it's aesthetically pleasing to me (i'm insane)
			tempNull.property("Anchor Point").setValue([50, 50, 0]);
			
			// tempNull is placed at plane's point in space
			tempNull.property("position").setValue(startPos);
			// make tempNull light's parent
			newLight.parent = tempNull;
			
			// shake
			
			// rotate tempNull so that light is oriented correctly
			
			tempNull.property("orientation").setValue(ori);
			tempNull.property("X Rotation").setValue(rots[0]);
			tempNull.property("Y Rotation").setValue(rots[1]);
			tempNull.property("Z Rotation").setValue(rots[2]);
			
			// and bake
			
			doomedNullSrc=tempNull.source;
			//note: must delete layer first, then source in order to 'bake' parented values (cannot just remove source)
			newLight.parent=null;
			tempNull.remove();
			doomedNullSrc.remove();
			
			newLight.moveBefore(mainPlane);
			newLight.selected = true;
			app.endUndoGroup();
			///////////////////////////////////////////////////////
		}
	}
}
