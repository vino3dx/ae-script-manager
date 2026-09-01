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


// This class represents the main class of the script 
function CenterMasks()
{
	// Variable used to keep track of 'this' reference
	var centerMasks = this;
	
	// Create an instance of the utils class to use its functions
	var utils = new CenterMasksUtils();

	// Script infos
	this.scriptTitle = "蒙版居中";
							  
	
	// Errors
	this.requirementErr = {en:"This script requires After Effects CS4 or later.", fr:"Ce script nécessite After Effects CS4 ou supérieur."};	
	this.noCompErr = {en:"Select at least one mask.", fr:"Sélectionnez au moins un masque."};
	this.noLayerErr = {en:"Select at least one mask.", fr:"Sélectionnez au moins un masque."};
	this.noMaskErr = {en:"Select at least one mask.", fr:"Sélectionnez au moins un masque."};
	
	// UI strings 
	this.aboutBtnName = "选中蒙版点↓";
	this.runBtnName = {en:"立即居中", fr:"Centrer"};
	
	// Creates and displays the script interface
	this.buildUI = function (thisObj)
	{
		// dockable panel or palette
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", this.scriptTitle, undefined, {resizeable:true});
		
		// resource specifications
		var res =
		"group { orientation:'column', alignment:['fill','fill'], alignChildren:['right','top'], \
			gr1: Group { \
				aboutBtn: Button { text:'" + this.aboutBtnName + "', preferredSize:[100,20] } \
			}, \
			gr2: Group { orientation:'row', alignment:['fill','top'], \
				runBtn: Button { text:'" + utils.loc(this.runBtnName) + "', alignment:['fill','center'] } \
			} \
		}"; 
		pal.gr = pal.add(res);
		
		// event callbacks
		pal.onResizing = pal.onResize = function () 
		{
			this.layout.resize();
		};
				
		pal.gr.gr1.aboutBtn.onClick = function () 
		{ 
			utils.createAboutDlg(centerMasks.scriptAbout, centerMasks.scriptUsage); 
		};
		
		pal.gr.gr2.runBtn.onClick = function ()
		{
			centerMasks.repositionMasks();	
		};

		// show user interface
		if (pal instanceof Window)
		{
			pal.center();
			pal.show();
		}
		else
		{
			pal.layout.layout(true);
		}	   
	};

	// Determines whether the active item is a composition  
	this.checkActiveItem = function () 
	{
		return !(app.project.activeItem instanceof CompItem);
	};
	
	// Functional part of the script: reposition every masks of the selected masks around the center of their containing layer
	this.repositionMasks = function ()
	{
		try
		{
			var comp = app.project.activeItem;
			var err = this.noCompErr;
			if (this.checkActiveItem(comp)) throw(err);
		   
			var selLayers = comp.selectedLayers;
			var err = this.noLayerErr;
			if (selLayers.length < 1) throw(err);
			   
			var numSelMasks = 0;
			
			app.beginUndoGroup(this.scriptTitle);
			
			for (var i = 0; i < selLayers.length; i++) 
			{
				var layer = comp.selectedLayers[i];
				
				for (var j = 1; j <= layer.Masks.numProperties; j++) 
				{
					var mask = layer.Masks.property(j);
					if (mask.selected) 
					{ 
						numSelMasks++;
						
						var maskShape = mask.maskShape; 
						var shape = maskShape.valueAtTime(comp.time, false);
						var verts = shape.vertices;
						var layerCenter = [layer.width/2, layer.height/2];								
						
						var x = 0;
						var y = 0;
						for (var k = 0; k < verts.length; k++) 
						{
							x += verts[k][0];
							y += verts[k][1];
						}					
						var maskCenter = [x/verts.length, y/verts.length];					
						var delta = layerCenter - maskCenter;								
						
						var newShape = new Shape();
						var newVerts = new Array();
						for (var k = 0; k < verts.length; k++) 
						{
							newVerts.push(verts[k] + delta);
						}						
						newShape.vertices = newVerts;
						newShape.inTangents = shape.inTangents;
						newShape.outTangents = shape.outTangents;
						
						maskShape.numKeys ? maskShape.setValueAtTime(comp.time, newShape) : maskShape.setValue(newShape);
					}
				}
			}
			
			app.endUndoGroup();			
			
			var err = this.noMaskErr;
			if (numSelMasks < 1) throw(err);
		}
		catch(err)
		{
			utils.throwErr(err);
		}				
	};
	
	// Runs the script  
	this.run = function (thisObj) 
	{
		if (parseFloat(app.version) < parseFloat(this.scriptMinSupportVersion))
		{
			utils.throwErr(this.requirementErr);
		}
		else
		{
			this.buildUI(thisObj);
		}	
	};
}


// This class provides some utility functions
function CenterMasksUtils()
{
	// Variable used to keep track of 'this' reference
	var utils = this;
	
	// String localization function: english and french languages are supported
	this.loc = function (str)
	{
		return app.language == Language.FRENCH ? str.fr : str.en;
	};

	// Displays a window containg a localized error message
	this.throwErr = function (err)
	{
		var wndTitle = $.fileName.substring($.fileName.lastIndexOf("/")+1, $.fileName.lastIndexOf("."));
		Window.alert("Script error:\r" + this.loc(err), wndTitle, true);
	};			

}


// Creates an instance of the main class and run it
new CenterMasks().run(this);
