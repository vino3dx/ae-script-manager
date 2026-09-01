/* 

插件原名称：抱歉，百度搜索的，来源网址失效，不能确认
修改: 视效网www.wanvfx.com

名称: 三维图层分布
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
function DistributeLayers()
{
	// Variable used to keep track of 'this' reference
	var distributeLayers = this;
	
	// Create an instance of the utils class to use its functions
	var utils = new DistributeLayersUtils();

	// Script infos
	this.scriptMinSupportVersion = "9.0";
	this.scriptName = "DistributeLayers.jsx";	
	this.scriptVersion = "2.2";
	this.scriptTitle = "分布层";
	this.scriptCopyright = "Copyright (c) 2011 Charles Bordenave";
	this.scriptHomepage = "http://www.aescripts.com";
	this.scriptDescription = {en: "该脚本允许您在3D空间中分布选定的图层。\\r\\r除了偏移位置，您还可以偏移旋转，缩放，不透明度并添加一些随机性。\\r\\r因子变量参数允许层之间的非线性偏移。", fr:"Ce script permet de distribuer les calques dans l\\'espace 3D.\\r\\rEn plus de pouvoir décaler la position, vous pouvez décaler la rotation, l\\'échelle, l\\'opacité et ajouter de l\\'aléatoire.\\r\\rLe paramètre Facteur permet d\\'obtenir un décalage non-linéaire entre les calques."};
	this.scriptAbout = {en:this.scriptName + ", v" + this.scriptVersion + "\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription), 
						fr:this.scriptName + ", v" + this.scriptVersion + "\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription)};		
	this.scriptUsage = {en:	"\u25BA 在After Effects CS4或更高版本中，运行脚本\\r" +
							"\u25BA 选择至少两个图层\\r" +
							"\u25BA 在脚本界面中选择一个属性\\r" +
							"\u25BA 拖动滑块或编辑文本字段以实时查看更改",
						fr:	"\u25BA Dans After Effects CS4 ou supérieur, exécuter le script \\r" +
							"\u25BA Sélectionner au moins deux calques \\r" +
							"\u25BA Sélectionner une propriété dans l\\\'interface du script \\r" +
							"\u25BA Déplacer les curseurs ou modifier les champs de texte pour voir les changements en temps réel"};
	 
	// Errors
	this.requirementErr = {en:"This script requires After Effects CS4 or later.", fr:"Ce script nécessite After Effects CS4 ou supérieur."};	
	this.noCompErr = {en:"A comp must be active.", fr:"Une composition doit être active."};
	this.noLayersErr = {en:"Select at least two layers.", fr:"Sélectionnez au moins deux calques."};
	this.duringProcessErr = {en:"An error occurred while accessing transform properties of selected layers.", fr:"Une erreur s'est produite lors de l'accès aux propriétés de transformation des calques sélectionnés."};

	// UI strings 
	this.aboutBtnName = "?";
	this.runBtnName = {en:"Run", fr:"Exécuter"};
	
	// Creates and displays the script interface
	this.buildUI = function (thisObj)
	{
		// dockable panel or palette
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", this.scriptTitle, undefined, {resizeable:true});

		// resource specifications
		var res =
		"group { orientation:'column', alignment:['fill','top'], alignChildren:['right','top'], \
			gr1: Group { alignment:['fill','fill'], \
				aboutBtn: Button { text:' ', preferredSize:[0,0], alignment:['right','center']} \
			}, \
			pnl: Panel { type:'tabbedpanel', alignment:['fill','fill'], \
				pnl1: Panel { type:'tab', text:'位置', orientation:'row', alignment:['fill','fill'], alignChildren:['right','top'], \
					gr1: Group { orientation:'column', alignment:['left','top'], alignChildren:['right','center'], \
						xOffsetSt: StaticText { text:'X 偏移量:', preferredSize:[-1,25] }, \
						yOffsetSt: StaticText { text:'Y 偏移量:', preferredSize:[-1,25] }, \
						zOffsetSt: StaticText { text:'Z 偏移量:' } \
					}, \
					gr2: Group { orientation:'column', alignment:['fill','top'], \
						gr21: Group { orientation:'row', alignment:['fill','top'], \
							xOffsetScl: Scrollbar { minvalue:-100, alignment:['fill','center'] }, \
							xOffsetEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr22: Group { orientation:'row', alignment:['fill','top'], \
							yOffsetScl: Scrollbar { minvalue:-100, alignment:['fill','center'] }, \
							yOffsetEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr23: Group { orientation:'row', alignment:['fill','top'], \
							zOffsetScl: Scrollbar { minvalue:-100, alignment:['fill','center'] }, \
							zOffsetEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr24: Group { alignment:'fill', alignChildren:['left','top'], \
							sliderRangeBtn: Button { text:'滑块范围' } \
						} \
					} \
				}, \
				pnl2: Panel { type:'tab', text:'旋转', orientation:'row', alignment:['fill','fill'], alignChildren:['right','top'], \
					gr1: Group { orientation:'column', alignment:['left','top'], alignChildren:['right','top'], \
						xRotationSt: StaticText { text:'X 旋转度:', preferredSize:[-1,25] }, \
						yRotationSt: StaticText { text:'Y 旋转度:', preferredSize:[-1,25] }, \
						zRotationSt: StaticText { text:'Z 旋转度:' } \
					}, \
					gr2: Group { orientation:'column', alignment:['fill','top'], \
						gr21: Group { orientation:'row', alignment:['fill','top'], \
							xRotationScl: Scrollbar { minvalue:-100, alignment:['fill','center'] }, \
							xRotationEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr22: Group { orientation:'row', alignment:['fill','top'], \
							yRotationScl: Scrollbar { minvalue:-100, alignment:['fill','center'] }, \
							yRotationEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr23: Group { orientation:'row', alignment:['fill','top'], \
							zRotationScl: Scrollbar { minvalue:-100, alignment:['fill','center'] }, \
							zRotationEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr24: Group { alignment:'fill', alignChildren:['left','top'], \
							sliderRangeBtn: Button { text:'滑块范围' } \
						} \
					} \
				}, \
				pnl3: Panel { type:'tab', text:'缩放/透明度', orientation:'row', alignment:['fill','fill'], alignChildren:['right','top'], \
					gr1: Group { orientation:'column', alignment:['left','top'], alignChildren:['right','top'], \
						xScaleSt: StaticText { text:'X 缩放偏移:', preferredSize:[-1,25] }, \
						yScaleSt: StaticText { text:'Y 缩放偏移:', preferredSize:[-1,25] }, \
						opacitySt: StaticText { text:'透明度偏移:', preferredSize:[-1,20] }, \
						fooSt: StaticText { visible:false, text:'foo:' } \
					}, \
					gr2: Group { orientation:'column', alignment:['fill','top'], \
						gr21: Group { orientation:'row', alignment:['fill','top'], \
							xScaleScl: Scrollbar { minvalue:-100, alignment:['fill','center'] }, \
							xScaleEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr22: Group { orientation:'row', alignment:['fill','top'], \
							yScaleScl: Scrollbar { minvalue:-100, alignment:['fill','center'] }, \
							yScaleEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr23: Group { orientation:'row', alignment:['fill','top'], \
							opacityScl: Scrollbar { minvalue:0, maxvalue:100, alignment:['fill','center'] }, \
							opacityEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr24: Group { alignment:'fill', alignChildren:['left','top'], \
							sliderRangeBtn: Button { text:'滑块范围' } \
						} \
					} \
				}, \
				pnl4: Panel { type:'tab', text:'矩阵/位置', orientation:'row', alignment:['fill','fill'], alignChildren:['right','top'], \
					gr1: Group { orientation:'column', alignment:['left','top'], alignChildren:['right','top'], \
						xRandomSt: StaticText { text:'X 随机:', preferredSize:[-1,25] }, \
						yRandomSt: StaticText { text:'Y 随机:', preferredSize:[-1,25] }, \
						zRandomSt: StaticText { text:'Z 随机:' } \
					}, \
					gr2: Group { orientation:'column', alignment:['fill','top'], \
						gr21: Group { orientation:'row', alignment:['fill','top'], \
							xRandomScl: Scrollbar { alignment:['fill','center'] }, \
							xRandomEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr22: Group { orientation:'row', alignment:['fill','top'], \
							yRandomScl: Scrollbar { alignment:['fill','center'] }, \
							yRandomEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr23: Group { orientation:'row', alignment:['fill','top'], \
							zRandomScl: Scrollbar { alignment:['fill','center'] }, \
							zRandomEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr24: Group { alignment:'fill', alignChildren:['left','top'], \
							sliderRangeBtn: Button { text:'滑块范围' } \
						} \
					} \
				}, \
				pnl5: Panel { type:'tab', text:'矩阵/旋转', orientation:'row', alignment:['fill','fill'], alignChildren:['right','top'], \
					gr1: Group { orientation:'column', alignment:['left','top'], alignChildren:['right','top'], \
						xRandomSt: StaticText { text:'X 随机:', preferredSize:[-1,25] }, \
						yRandomSt: StaticText { text:'Y 随机:', preferredSize:[-1,25] }, \
						zRandomSt: StaticText { text:'Z 随机:' } \
					}, \
					gr2: Group { orientation:'column', alignment:['fill','top'], \
						gr21: Group { orientation:'row', alignment:['fill','top'], \
							xRandomScl: Scrollbar { alignment:['fill','center'] }, \
							xRandomEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr22: Group { orientation:'row', alignment:['fill','top'], \
							yRandomScl: Scrollbar { alignment:['fill','center'] }, \
							yRandomEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr23: Group { orientation:'row', alignment:['fill','top'], \
							zRandomScl: Scrollbar { alignment:['fill','center'] }, \
							zRandomEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr24: Group { alignment:'fill', alignChildren:['left','top'], \
							sliderRangeBtn: Button { text:'滑块范围' } \
						} \
					} \
				}, \
				pnl6: Panel { type:'tab', text:'矩阵/透明度', orientation:'row', alignment:['fill','fill'], alignChildren:['right','top'], \
					gr1: Group { orientation:'column', alignment:['left','top'], alignChildren:['right','top'], \
						xRandomSt: StaticText { text:'X 随机:', preferredSize:[-1,25] }, \
						yRandomSt: StaticText { text:'Y 随机:', preferredSize:[-1,25] }, \
						opacityRandomSt: StaticText { text:'透明度随机:', preferredSize:[-1,20] }, \
						fooSt: StaticText { visible:false, text:'foo:' } \
					}, \
					gr2: Group { orientation:'column', alignment:['fill','top'], \
						gr21: Group { orientation:'row', alignment:['fill','top'], \
							xRandomScl: Scrollbar { minvalue:-100, alignment:['fill','center'] }, \
							xRandomEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr22: Group { orientation:'row', alignment:['fill','top'], \
							yRandomScl: Scrollbar { minvalue:-100, alignment:['fill','center'] }, \
							yRandomEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr23: Group { orientation:'row', alignment:['fill','top'], \
							opacityRandomScl: Scrollbar { minvalue:0, maxvalue:100, alignment:['fill','center'] }, \
							opacityRandomEt: EditText { text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr24: Group { alignment:'fill', alignChildren:['left','top'], \
							sliderRangeBtn: Button { text:'滑块范围' } \
						} \
					} \
					gr3: Group { orientation:'column', \
						fooEt: EditText { visible:false, preferredSize:[-1,5] }, \
						uniformCb: Checkbox { text:'统一', value:true } \
					} \
				}, \
				pnl7: Panel { type:'tab', text:'因子变量', orientation:'row', alignment:['fill','fill'], alignChildren:['right','top'], \
					gr1: Group { orientation:'column', alignment:['left','top'], alignChildren:['right','center'], \
						factorSt: StaticText { text:'因子变量:', preferredSize:[-1,25] }, \
						fooSt: StaticText { visible:false, text:'Offset:', preferredSize:[-1,20] }, \
						fooSt: StaticText { visible:false, text:'Z Random:' } \
					}, \
					gr2: Group { orientation:'column', alignment:['fill','top'], \
						gr21: Group { orientation:'row', alignment:['fill','top'], \
							factorScl: Scrollbar { minvalue:0.75, maxvalue:1.5, value:1.0, stepdelta:0.01, jumpdelta:0.05, alignment:['fill','center'] }, \
							factorEt: EditText { text:'1.0', characters:5, alignment:['right','center'] } \
						}, \
						gr22: Group { orientation:'row', alignment:['fill','top'], \
							fooScl: Scrollbar { visible:false, alignment:['fill','center'] }, \
							fooEt: EditText { visible:false, text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr23: Group { orientation:'row', alignment:['fill','top'], \
							fooScl: Scrollbar { visible:false, minvalue:-100, alignment:['fill','center'] }, \
							fooEt: EditText { visible:false, text:'0', characters:5, alignment:['right','center'] } \
						}, \
						gr24: Group { alignment:'fill', alignChildren:['left','top'], \
							sliderRangeBtn: Button { text:'滑块范围' } \
						} \
					} \
				} \
			} \
		}"; 
		pal.gr = pal.add(res);
				
		pal.layout.layout(true);
		pal.gr.minimumSize = pal.gr.size;
		
		// event callbacks
		pal.onResizing = pal.onResize = function () 
		{
			this.layout.resize();
		};
				
		pal.gr.gr1.aboutBtn.onClick = function () 
		{ 
			utils.createAboutDlg(distributeLayers.scriptAbout, distributeLayers.scriptUsage); 
		};
		
		pal.gr.pnl.pnl1.gr2.gr21.xOffsetScl.onChange = pal.gr.pnl.pnl1.gr2.gr21.xOffsetScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.xOffsetEt.text = this.value;
			distributeLayers.offsetPosition(pal);
		};		

		pal.gr.pnl.pnl1.gr2.gr21.xOffsetEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.xOffsetScl.value = parseInt(this.text);
			distributeLayers.offsetPosition(pal);			
		};	
		
		pal.gr.pnl.pnl1.gr2.gr22.yOffsetScl.onChange = pal.gr.pnl.pnl1.gr2.gr22.yOffsetScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.yOffsetEt.text = this.value;
			distributeLayers.offsetPosition(pal);
		};

		pal.gr.pnl.pnl1.gr2.gr22.yOffsetEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.yOffsetScl.value = parseInt(this.text);
			distributeLayers.offsetPosition(pal);			
		};
		
		pal.gr.pnl.pnl1.gr2.gr23.zOffsetScl.onChange = pal.gr.pnl.pnl1.gr2.gr23.zOffsetScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.zOffsetEt.text = this.value;
			distributeLayers.offsetPosition(pal);
		};

		pal.gr.pnl.pnl1.gr2.gr23.zOffsetEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.zOffsetScl.value = parseInt(this.text);
			distributeLayers.offsetPosition(pal);			
		};

		pal.gr.pnl.pnl1.gr2.gr24.sliderRangeBtn.onClick = function () 
		{
			var minVal = parseInt(prompt("Minimum value:", pal.gr.pnl.pnl1.gr2.gr21.xOffsetScl.minvalue, "滑块范围"));
			var maxVal = parseInt(prompt("Maximum value:", pal.gr.pnl.pnl1.gr2.gr21.xOffsetScl.maxvalue, "滑块范围"));
			if (isNaN(minVal)) minVal = pal.gr.pnl.pnl1.gr2.gr21.xOffsetScl.minvalue;
			if (isNaN(maxVal)) maxVal = pal.gr.pnl.pnl1.gr2.gr21.xOffsetScl.maxvalue;
						
			pal.gr.pnl.pnl1.gr2.gr21.xOffsetScl.minvalue = 
			pal.gr.pnl.pnl1.gr2.gr22.yOffsetScl.minvalue = 
			pal.gr.pnl.pnl1.gr2.gr23.zOffsetScl.minvalue = minVal;
			
			pal.gr.pnl.pnl1.gr2.gr21.xOffsetScl.maxvalue = 
			pal.gr.pnl.pnl1.gr2.gr22.yOffsetScl.maxvalue = 
			pal.gr.pnl.pnl1.gr2.gr23.zOffsetScl.maxvalue = maxVal;
		};
		
		pal.gr.pnl.pnl2.gr2.gr21.xRotationScl.onChange = pal.gr.pnl.pnl2.gr2.gr21.xRotationScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.xRotationEt.text = this.value;
			distributeLayers.offsetRotation(pal, "x");
		};

		pal.gr.pnl.pnl2.gr2.gr21.xRotationEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.xRotationScl.value = parseInt(this.text);
			distributeLayers.offsetRotation(pal, "x");			
		};

		pal.gr.pnl.pnl2.gr2.gr22.yRotationScl.onChange = pal.gr.pnl.pnl2.gr2.gr22.yRotationScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.yRotationEt.text = this.value;
			distributeLayers.offsetRotation(pal, "y");
		};

		pal.gr.pnl.pnl2.gr2.gr22.yRotationEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.yRotationScl.value = parseInt(this.text);
			distributeLayers.offsetRotation(pal, "y");			
		};
		
		pal.gr.pnl.pnl2.gr2.gr23.zRotationScl.onChange = pal.gr.pnl.pnl2.gr2.gr23.zRotationScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.zRotationEt.text = this.value;
			distributeLayers.offsetRotation(pal, "z");
		};

		pal.gr.pnl.pnl2.gr2.gr23.zRotationEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.zRotationScl.value = parseInt(this.text);
			distributeLayers.offsetRotation(pal, "z");			
		};		
 
		pal.gr.pnl.pnl2.gr2.gr24.sliderRangeBtn.onClick = function () 
		{
			var minVal = parseInt(prompt("Minimum value:", pal.gr.pnl.pnl2.gr2.gr21.xRotationScl.minvalue, "滑块范围"));
			var maxVal = parseInt(prompt("Maximum value:", pal.gr.pnl.pnl2.gr2.gr21.xRotationScl.maxvalue, "滑块范围"));
			if (isNaN(minVal)) minVal = pal.gr.pnl.pnl2.gr2.gr21.xRotationScl.minvalue;
			if (isNaN(maxVal)) maxVal = pal.gr.pnl.pnl2.gr2.gr21.xRotationScl.maxvalue;
						
			pal.gr.pnl.pnl2.gr2.gr21.xRotationScl.minvalue = 
			pal.gr.pnl.pnl2.gr2.gr22.yRotationScl.minvalue = 
			pal.gr.pnl.pnl2.gr2.gr23.zRotationScl.minvalue = minVal;
			
			pal.gr.pnl.pnl2.gr2.gr21.xRotationScl.maxvalue = 
			pal.gr.pnl.pnl2.gr2.gr22.yRotationScl.maxvalue = 
			pal.gr.pnl.pnl2.gr2.gr23.zRotationScl.maxvalue = maxVal;
		};

		pal.gr.pnl.pnl3.gr2.gr21.xScaleScl.onChange = pal.gr.pnl.pnl3.gr2.gr21.xScaleScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.xScaleEt.text = this.value;
			distributeLayers.offsetScale(pal);
		};

		pal.gr.pnl.pnl3.gr2.gr21.xScaleEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.xScaleScl.value = parseInt(this.text);
			distributeLayers.offsetScale(pal);			
		};
		
		pal.gr.pnl.pnl3.gr2.gr22.yScaleScl.onChange = pal.gr.pnl.pnl3.gr2.gr22.yScaleScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.yScaleEt.text = this.value;
			distributeLayers.offsetScale(pal);
		};

		pal.gr.pnl.pnl3.gr2.gr22.yScaleEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.yScaleScl.value = parseInt(this.text);
			distributeLayers.offsetScale(pal);			
		};		
		
		pal.gr.pnl.pnl3.gr2.gr23.opacityScl.onChange = pal.gr.pnl.pnl3.gr2.gr23.opacityScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.opacityEt.text = this.value;
			distributeLayers.offsetOpacity(pal);
		};

		pal.gr.pnl.pnl3.gr2.gr23.opacityEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			else if (parseFloat(this.text) < 0) this.text = 0;
			else if (parseFloat(this.text) > 100) this.text = 100;
			this.parent.opacityScl.value = parseInt(this.text);
			distributeLayers.offsetOpacity(pal);			
		};		

		pal.gr.pnl.pnl3.gr2.gr24.sliderRangeBtn.onClick = function () 
		{
			var minVal = parseInt(prompt("Minimum value:", pal.gr.pnl.pnl3.gr2.gr21.xScaleScl.minvalue, "滑块范围"));
			var maxVal = parseInt(prompt("Maximum value:", pal.gr.pnl.pnl3.gr2.gr21.xScaleScl.maxvalue, "滑块范围"));
			if (isNaN(minVal)) minVal = pal.gr.pnl.pnl3.gr2.gr21.xScaleScl.minvalue;
			if (isNaN(maxVal)) maxVal = pal.gr.pnl.pnl3.gr2.gr21.xScaleScl.maxvalue;			
			
			pal.gr.pnl.pnl3.gr2.gr21.xScaleScl.minvalue = 
			pal.gr.pnl.pnl3.gr2.gr22.yScaleScl.minvalue = minVal;			 
			pal.gr.pnl.pnl3.gr2.gr23.opacityScl.minvalue = Math.max(0,minVal);
			
			pal.gr.pnl.pnl3.gr2.gr21.xScaleScl.maxvalue =
			pal.gr.pnl.pnl3.gr2.gr22.yScaleScl.maxvalue = maxVal; 
			pal.gr.pnl.pnl3.gr2.gr23.opacityScl.maxvalue = Math.min(100,maxVal);
		};
						
		pal.gr.pnl.pnl4.gr2.gr21.xRandomScl.onChange = pal.gr.pnl.pnl4.gr2.gr21.xRandomScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.xRandomEt.text = this.value;
			distributeLayers.offsetPositionRandom(pal);
		};

		pal.gr.pnl.pnl4.gr2.gr21.xRandomEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.xRandomScl.value = parseInt(this.text);
			distributeLayers.offsetPositionRandom(pal);			
		};
		
		pal.gr.pnl.pnl4.gr2.gr22.yRandomScl.onChange = pal.gr.pnl.pnl4.gr2.gr22.yRandomScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.yRandomEt.text = this.value;
			distributeLayers.offsetPositionRandom(pal);
		};

		pal.gr.pnl.pnl4.gr2.gr22.yRandomEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.yRandomScl.value = parseInt(this.text);
			distributeLayers.offsetPositionRandom(pal);			
		};		 

		pal.gr.pnl.pnl4.gr2.gr23.zRandomScl.onChange = pal.gr.pnl.pnl4.gr2.gr23.zRandomScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.zRandomEt.text = this.value;
			distributeLayers.offsetPositionRandom(pal);
		};

		pal.gr.pnl.pnl4.gr2.gr23.zRandomEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.zRandomScl.value = parseInt(this.text);
			distributeLayers.offsetPositionRandom(pal);			
		};
 
		pal.gr.pnl.pnl4.gr2.gr24.sliderRangeBtn.onClick = function () 
		{
			var minVal = parseInt(prompt("Minimum value:", pal.gr.pnl.pnl4.gr2.gr21.xRandomScl.minvalue, "滑块范围"));
			var maxVal = parseInt(prompt("Maximum value:", pal.gr.pnl.pnl4.gr2.gr21.xRandomScl.maxvalue, "滑块范围"));
			if (isNaN(minVal)) minVal = pal.gr.pnl.pnl4.gr2.gr21.xRandomScl.minvalue;
			if (isNaN(maxVal)) maxVal = pal.gr.pnl.pnl4.gr2.gr21.xRandomScl.maxvalue;
			 
			pal.gr.pnl.pnl4.gr2.gr21.xRandomScl.minvalue = 
			pal.gr.pnl.pnl4.gr2.gr22.yRandomScl.minvalue = 
			pal.gr.pnl.pnl4.gr2.gr23.zRandomScl.minvalue = minVal;
			
			pal.gr.pnl.pnl4.gr2.gr21.xRandomScl.maxvalue = 
			pal.gr.pnl.pnl4.gr2.gr22.yRandomScl.maxvalue = 
			pal.gr.pnl.pnl4.gr2.gr23.zRandomScl.maxvalue = maxVal;
		};
		
		pal.gr.pnl.pnl5.gr2.gr21.xRandomScl.onChange = pal.gr.pnl.pnl5.gr2.gr21.xRandomScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.xRandomEt.text = this.value;
			distributeLayers.offsetRotationRandom(pal, "x");
		};

		pal.gr.pnl.pnl5.gr2.gr21.xRandomEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.xRandomScl.value = parseInt(this.text);
			distributeLayers.offsetRotationRandom(pal, "x");			
		};
		
		pal.gr.pnl.pnl5.gr2.gr22.yRandomScl.onChange = pal.gr.pnl.pnl5.gr2.gr22.yRandomScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.yRandomEt.text = this.value;
			distributeLayers.offsetRotationRandom(pal, "y");
		};

		pal.gr.pnl.pnl5.gr2.gr22.yRandomEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.yRandomScl.value = parseInt(this.text);
			distributeLayers.offsetRotationRandom(pal, "y");			
		};		 

		pal.gr.pnl.pnl5.gr2.gr23.zRandomScl.onChange = pal.gr.pnl.pnl5.gr2.gr23.zRandomScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.zRandomEt.text = this.value;
			distributeLayers.offsetRotationRandom(pal, "z");
		};

		pal.gr.pnl.pnl5.gr2.gr23.zRandomEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.zRandomScl.value = parseInt(this.text);
			distributeLayers.offsetRotationRandom(pal, "z");			
		};
 
		pal.gr.pnl.pnl5.gr2.gr24.sliderRangeBtn.onClick = function () 
		{
			var minVal = parseInt(prompt("Minimum value:", pal.gr.pnl.pnl5.gr2.gr21.xRandomScl.minvalue, "滑块范围"));
			var maxVal = parseInt(prompt("Maximum value:", pal.gr.pnl.pnl5.gr2.gr21.xRandomScl.maxvalue, "滑块范围"));
			if (isNaN(minVal)) minVal = pal.gr.pnl.pnl5.gr2.gr21.xRandomScl.minvalue;
			if (isNaN(maxVal)) maxVal = pal.gr.pnl.pnl5.gr2.gr21.xRandomScl.maxvalue;
						
			pal.gr.pnl.pnl5.gr2.gr21.xRandomScl.minvalue = 
			pal.gr.pnl.pnl5.gr2.gr22.yRandomScl.minvalue = 
			pal.gr.pnl.pnl5.gr2.gr23.zRandomScl.minvalue = minVal;
			
			pal.gr.pnl.pnl5.gr2.gr21.xRandomScl.maxvalue = 
			pal.gr.pnl.pnl5.gr2.gr22.yRandomScl.maxvalue = 
			pal.gr.pnl.pnl5.gr2.gr23.zRandomScl.maxvalue = maxVal;
		};
		
		pal.gr.pnl.pnl6.gr2.gr21.xRandomScl.onChange = pal.gr.pnl.pnl6.gr2.gr21.xRandomScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.xRandomEt.text = this.value;
			distributeLayers.offsetScaleRandom(pal, "x");
		};

		pal.gr.pnl.pnl6.gr2.gr21.xRandomEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.xRandomScl.value = parseInt(this.text);
			distributeLayers.offsetScaleRandom(pal, "x");			
		};
		
		pal.gr.pnl.pnl6.gr2.gr22.yRandomScl.onChange = pal.gr.pnl.pnl6.gr2.gr22.yRandomScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.yRandomEt.text = this.value;
			distributeLayers.offsetScaleRandom(pal, "y");
		};

		pal.gr.pnl.pnl6.gr2.gr22.yRandomEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			this.parent.yRandomScl.value = parseInt(this.text);
			distributeLayers.offsetScaleRandom(pal, "y");			
		};		
		
		pal.gr.pnl.pnl6.gr2.gr23.opacityRandomScl.onChange = pal.gr.pnl.pnl6.gr2.gr23.opacityRandomScl.onChanging = function () 
		{
			this.value = Math.floor(this.value);			
			this.parent.opacityRandomEt.text = this.value;
			distributeLayers.offsetOpacityRandom(pal);
		};

		pal.gr.pnl.pnl6.gr2.gr23.opacityRandomEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 0;
			else if (parseFloat(this.text) < 0) this.text = 0;
			else if (parseFloat(this.text) > 100) this.text = 100;
			this.parent.opacityRandomScl.value = parseInt(this.text);
			distributeLayers.offsetOpacityRandom(pal);			
		};		

		pal.gr.pnl.pnl6.gr2.gr24.sliderRangeBtn.onClick = function () 
		{
			var minVal = parseInt(prompt("Minimum value:", pal.gr.pnl.pnl6.gr2.gr21.xRandomScl.minvalue, "滑块范围"));
			var maxVal = parseInt(prompt("Maximum value:", pal.gr.pnl.pnl6.gr2.gr21.xRandomScl.maxvalue, "滑块范围"));
			if (isNaN(minVal)) minVal = pal.gr.pnl.pnl6.gr2.gr21.xRandomScl.minvalue;
			if (isNaN(maxVal)) maxVal = pal.gr.pnl.pnl6.gr2.gr21.xRandomScl.maxvalue;			
			
			pal.gr.pnl.pnl6.gr2.gr21.xRandomScl.minvalue = 
			pal.gr.pnl.pnl6.gr2.gr22.yRandomScl.minvalue = minVal;		 
			pal.gr.pnl.pnl6.gr2.gr23.opacityRandomScl.minvalue = Math.max(0,minVal);
			
			pal.gr.pnl.pnl6.gr2.gr21.xRandomScl.maxvalue =
			pal.gr.pnl.pnl6.gr2.gr22.yRandomScl.maxvalue = maxVal; 
			pal.gr.pnl.pnl6.gr2.gr23.opacityRandomScl.maxvalue = Math.min(100,maxVal);
		};
						
		pal.gr.pnl.pnl7.gr2.gr21.factorScl.onChange = pal.gr.pnl.pnl7.gr2.gr21.factorScl.onChanging = function () 
		{
			//this.value = this.value.toFixed(2);			
			this.parent.factorEt.text = this.value;
			distributeLayers.offsetPosition(pal);
			distributeLayers.offsetRotation(pal, "x");
			distributeLayers.offsetRotation(pal, "y");
			distributeLayers.offsetRotation(pal, "z");
			distributeLayers.offsetScale(pal);
			distributeLayers.offsetOpacity(pal); 
		};		

		pal.gr.pnl.pnl7.gr2.gr21.factorEt.onChange = function () 
		{
			if (isNaN(this.text)) this.text = 1.0;
			this.parent.factorScl.value = parseFloat(this.text).toFixed(2);
			distributeLayers.offsetPosition(pal); 
			distributeLayers.offsetRotation(pal, "x");
			distributeLayers.offsetRotation(pal, "y");
			distributeLayers.offsetRotation(pal, "z");
			distributeLayers.offsetScale(pal);
			distributeLayers.offsetOpacity(pal); 
		};	

		pal.gr.pnl.pnl7.gr2.gr24.sliderRangeBtn.onClick = function () 
		{
			var minVal = parseInt(prompt("Minimum value:", pal.gr.pnl.pnl7.gr2.gr21.factorScl.minvalue, "滑块范围"));
			var maxVal = parseInt(prompt("Maximum value:", pal.gr.pnl.pnl7.gr2.gr21.factorScl.maxvalue, "滑块范围"));
			if (isNaN(minVal)) minVal = pal.gr.pnl.pnl7.gr2.gr21.factorScl.minvalue;
			if (isNaN(maxVal)) maxVal = pal.gr.pnl.pnl7.gr2.gr21.factorScl.maxvalue;
						
			pal.gr.pnl.pnl7.gr2.gr21.factorScl.minvalue = minVal;			
			pal.gr.pnl.pnl7.gr2.gr21.factorScl.maxvalue = maxVal;
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
	
	// Offsets position of the selected layers along x/y/z axis 
	this.offsetPosition = function (pal)
	{
		try
		{
			var comp = app.project.activeItem;
			var err = this.noCompErr;
			if (this.checkActiveItem(comp)) throw(err);
					
			var selLayers = comp.selectedLayers;
			var err = this.noLayersErr;
			if (selLayers.length < 1) throw(err);
			
			var xOffset = parseInt(pal.gr.pnl.pnl1.gr2.gr21.xOffsetEt.text);
			var yOffset = parseInt(pal.gr.pnl.pnl1.gr2.gr22.yOffsetEt.text);
			var zOffset = parseInt(pal.gr.pnl.pnl1.gr2.gr23.zOffsetEt.text);
			var factor = parseFloat(pal.gr.pnl.pnl7.gr2.gr21.factorEt.text);
			
			var prevOffset = [xOffset, yOffset, zOffset];
			
			app.beginUndoGroup(this.scriptTitle);
			 
			var err = this.duringProcessErr;			 
			try
			{
				selLayers[0].threeDLayer = true;
				 
				for (var i = 1; i < selLayers.length; i++)
				{
					selLayers[i].threeDLayer = true;
					
					if (!selLayers[i].position.dimensionsSeparated)
					{				 
						var prevP = selLayers[i-1].position;
						var curP = selLayers[i].position;
					
						var curOffset = factor * prevOffset;				
						var newP = prevP.valueAtTime(comp.time, false) + curOffset;							
					
						curP.numKeys ? curP.setValueAtTime(comp.time, newP) : curP.setValue(newP);
					
						prevOffset = curOffset;
					}
					else
					{
						var prevPx = selLayers[i-1].property("ADBE Transform Group").property("ADBE Position_0");
						var prevPy = selLayers[i-1].property("ADBE Transform Group").property("ADBE Position_1");
						var prevPz = selLayers[i-1].property("ADBE Transform Group").property("ADBE Position_2");
						var curPx = selLayers[i].property("ADBE Transform Group").property("ADBE Position_0");
						var curPy = selLayers[i].property("ADBE Transform Group").property("ADBE Position_1");
						var curPz = selLayers[i].property("ADBE Transform Group").property("ADBE Position_2");
					
						var curOffsetx = factor * prevOffset[0];
						var curOffsety = factor * prevOffset[1];
						var curOffsetz = factor * prevOffset[2];				
						var newPx = prevPx.valueAtTime(comp.time, false) + curOffsetx;
						var newPy = prevPy.valueAtTime(comp.time, false) + curOffsety;
						var newPz = prevPz.valueAtTime(comp.time, false) + curOffsetz;
						
						curPx.numKeys ? curPx.setValueAtTime(comp.time, newPx) : curPx.setValue(newPx);
						curPy.numKeys ? curPy.setValueAtTime(comp.time, newPy) : curPy.setValue(newPy);
						curPz.numKeys ? curPz.setValueAtTime(comp.time, newPz) : curPz.setValue(newPz);
					
						prevOffset = [curOffsetx,curOffsety,curOffsetz];
					}
				}
			}
			catch(e)
			{
				throw(err);
			}
				  
			app.endUndoGroup();
		}
		catch(err)
		{
			utils.throwErr(err);
		}				
	};

	// Offsets x/y/z rotation of the selected layers 
	this.offsetRotation = function (pal, axis)
	{
		try
		{
			var comp = app.project.activeItem;
			var err = this.noCompErr;
			if (this.checkActiveItem(comp)) throw(err);
					
			var selLayers = comp.selectedLayers;
			var err = this.noLayersErr;
			if (selLayers.length < 1) throw(err);
			
			var prevOffset = (axis == "x") ? parseInt(pal.gr.pnl.pnl2.gr2.gr21.xRotationEt.text) : 
							((axis == "y") ? parseInt(pal.gr.pnl.pnl2.gr2.gr22.yRotationEt.text) : parseInt(pal.gr.pnl.pnl2.gr2.gr23.zRotationEt.text));

			var factor = parseFloat(pal.gr.pnl.pnl7.gr2.gr21.factorEt.text);
			
			app.beginUndoGroup(this.scriptTitle);
			 
			 var err = this.duringProcessErr;			 
			 try
			 {
				 if (!selLayers[0].threeDLayer) selLayers[0].threeDLayer = true;
				 
				 for (var i = 1; i < selLayers.length; i++)
				 {
					 if (!selLayers[i].threeDLayer) selLayers[i].threeDLayer = true;
					 
					 var prevR, curR;
					 if (axis == "x") 
					 {
						 prevR = selLayers[i-1].rotationX;
						 curR = selLayers[i].rotationX;
					 }
					 else if (axis == "y")
					 {
						 prevR = selLayers[i-1].rotationY;
						 curR = selLayers[i].rotationY;
					 }
					 else
					 {
						 prevR = selLayers[i-1].rotationZ;
						 curR = selLayers[i].rotationZ;
					 }
					
					 var curOffset = factor * prevOffset;							   
					 var newR = prevR.valueAtTime(comp.time, false) + curOffset;							
					
					 curR.numKeys ? curR.setValueAtTime(comp.time, newR) : curR.setValue(newR);
					
					 prevOffset = curOffset;				
				 }
			 }
			 catch(e)
			 {
				 throw(err);
			 }
				  
			app.endUndoGroup();
		}
		catch(err)
		{
			utils.throwErr(err);
		}				
	};

	// Offsets scale of the selected layers 
	this.offsetScale = function (pal)
	{
		try
		{
			var comp = app.project.activeItem;
			var err = this.noCompErr;
			if (this.checkActiveItem(comp)) throw(err);
					
			var selLayers = comp.selectedLayers;
			var err = this.noLayersErr;
			if (selLayers.length < 1) throw(err);
			
			var xOffset = parseInt(pal.gr.pnl.pnl3.gr2.gr21.xScaleEt.text);
			var yOffset = parseInt(pal.gr.pnl.pnl3.gr2.gr22.yScaleEt.text);							
			var factor = parseFloat(pal.gr.pnl.pnl7.gr2.gr21.factorEt.text);
			
			var prevOffset = [xOffset, yOffset, 0];
			
			app.beginUndoGroup(this.scriptTitle);
			 
			 var err = this.duringProcessErr;			 
			 try
			 {
				 if (!selLayers[0].threeDLayer) selLayers[0].threeDLayer = true;
				 
				 for (var i = 1; i < selLayers.length; i++)
				 {
					 if (!selLayers[i].threeDLayer) selLayers[i].threeDLayer = true;
					 
					 var prevS = selLayers[i-1].scale;
					 var curS = selLayers[i].scale;
					
					 var curOffset = factor * prevOffset;							   
					 var newS = prevS.valueAtTime(comp.time, false) + curOffset;							
					
					 curS.numKeys ? curS.setValueAtTime(comp.time, newS) : curS.setValue(newS);
					
					 prevOffset = curOffset;				
				 }
			 }
			 catch(e)
			 {
				 throw(err);
			 }
				  
			app.endUndoGroup();
		}
		catch(err)
		{
			utils.throwErr(err);
		}				
	};
	
	// Offsets opacity of the selected layers 
	this.offsetOpacity = function (pal)
	{
		try
		{
			var comp = app.project.activeItem;
			var err = this.noCompErr;
			if (this.checkActiveItem(comp)) throw(err);
					
			var selLayers = comp.selectedLayers;
			var err = this.noLayersErr;
			if (selLayers.length < 1) throw(err);
			
			var offset = parseInt(pal.gr.pnl.pnl3.gr2.gr23.opacityEt.text);							
			var factor = parseFloat(pal.gr.pnl.pnl7.gr2.gr21.factorEt.text);
			
			var prevOffset = offset;
			
			app.beginUndoGroup(this.scriptTitle);
			 
			 var err = this.duringProcessErr;			 
			 try
			 {
				 for (var i = 1; i < selLayers.length; i++)
				 {
					 var prevO = selLayers[i-1].opacity;
					 var curO = selLayers[i].opacity;
					
					 var curOffset = factor * prevOffset;							   
					 var newO = Math.max(0, Math.min(100, prevO.valueAtTime(comp.time, false) - curOffset));							
					
					 curO.numKeys ? curO.setValueAtTime(comp.time, newO) : curO.setValue(newO);
					
					 prevOffset = curOffset;								
				 }
			 }
			 catch(e)
			 {
				 throw(err);
			 }
				  
			app.endUndoGroup();
		}
		catch(err)
		{
			utils.throwErr(err);
		}				
	};
	
	// Randomly offsets position of the selected layers 
	this.offsetPositionRandom = function (pal)
	{
		try
		{
			var comp = app.project.activeItem;
			var err = this.noCompErr;
			if (this.checkActiveItem(comp)) throw(err);
					
			var selLayers = comp.selectedLayers;
			var err = this.noLayersErr;
			if (selLayers.length < 1) throw(err);
			
			var xRandom = parseInt(pal.gr.pnl.pnl4.gr2.gr21.xRandomEt.text);
			var yRandom = parseInt(pal.gr.pnl.pnl4.gr2.gr22.yRandomEt.text);
			var zRandom = parseInt(pal.gr.pnl.pnl4.gr2.gr23.zRandomEt.text);
			
			app.beginUndoGroup(this.scriptTitle);
			 
			var err = this.duringProcessErr;			 
			try
			{
				for (var i = 1; i < selLayers.length; i++)
				{
					if (!selLayers[i].position.dimensionsSeparated)
					{
						var curP = selLayers[i].position;
						var offset = [-xRandom + 2*xRandom*Math.random(), -yRandom + 2*yRandom*Math.random(), -zRandom + 2*zRandom*Math.random()];
						var newP = curP.valueAtTime(comp.time, false) + offset;							
					
						curP.numKeys ? curP.setValueAtTime(comp.time, newP) : curP.setValue(newP);
					}
					else
					{
						var curPx = selLayers[i].property("ADBE Transform Group").property("ADBE Position_0");
						var curPy = selLayers[i].property("ADBE Transform Group").property("ADBE Position_1");
						var curPz = selLayers[i].property("ADBE Transform Group").property("ADBE Position_2");
						var offsetx = -xRandom + 2*xRandom*Math.random();
						var offsety = -yRandom + 2*yRandom*Math.random();
						var offsetz = -zRandom + 2*zRandom*Math.random();
						var newPx = curPx.valueAtTime(comp.time, false) + offsetx;
						var newPy = curPy.valueAtTime(comp.time, false) + offsety;
						var newPz = curPz.valueAtTime(comp.time, false) + offsetz;
						
						curPx.numKeys ? curPx.setValueAtTime(comp.time, newPx) : curPx.setValue(newPx);
						curPy.numKeys ? curPy.setValueAtTime(comp.time, newPy) : curPy.setValue(newPy);
						curPz.numKeys ? curPz.setValueAtTime(comp.time, newPz) : curPz.setValue(newPz);
					}
				 }
			 }
			 catch(e)
			 {
				 throw(err);
			 }
				  
			app.endUndoGroup();
		}
		catch(err)
		{
			utils.throwErr(err);
		}				
	};

	// Randomly offsets x/y/z rotation of the selected layers 
	this.offsetRotationRandom = function (pal, axis)
	{
		try
		{
			var comp = app.project.activeItem;
			var err = this.noCompErr;
			if (this.checkActiveItem(comp)) throw(err);
					
			var selLayers = comp.selectedLayers;
			var err = this.noLayersErr;
			if (selLayers.length < 1) throw(err);
			
			var xRandom = parseInt(pal.gr.pnl.pnl5.gr2.gr21.xRandomEt.text);
			var yRandom = parseInt(pal.gr.pnl.pnl5.gr2.gr22.yRandomEt.text);
			var zRandom = parseInt(pal.gr.pnl.pnl5.gr2.gr23.zRandomEt.text);
											 
			app.beginUndoGroup(this.scriptTitle);
			 
			 var err = this.duringProcessErr;			 
			 try
			 {
				 for (var i = 1; i < selLayers.length; i++)
				 {
					 var curR = (axis == "x") ? selLayers[i].rotationX : ((axis == "y") ? selLayers[i].rotationY : selLayers[i].rotationZ);
					
					 var offset = (axis == "x") ? -xRandom + 2*xRandom*Math.random() : 
								 ((axis == "y") ? -yRandom + 2*yRandom*Math.random() : -zRandom + 2*zRandom*Math.random());
								
					 var newR = curR.valueAtTime(comp.time, false) + offset;							
					
					 curR.numKeys ? curR.setValueAtTime(comp.time, newR) : curR.setValue(newR);
				 }
			 }
			 catch(e)
			 {
				 throw(err);
			 }
				  
			app.endUndoGroup();
		}
		catch(err)
		{
			utils.throwErr(err);
		}				
	};	
	
	// Randomly offsets scale of the selected layers 
	this.offsetScaleRandom = function (pal, axis)
	{
		try
		{
			var comp = app.project.activeItem;
			var err = this.noCompErr;
			if (this.checkActiveItem(comp)) throw(err);
					
			var selLayers = comp.selectedLayers;
			var err = this.noLayersErr;
			if (selLayers.length < 1) throw(err);
			
			var sRandom = (axis == "x") ? parseInt(pal.gr.pnl.pnl6.gr2.gr21.xRandomEt.text) : parseInt(pal.gr.pnl.pnl6.gr2.gr22.yRandomEt.text);
			var uniform = pal.gr.pnl.pnl6.gr3.uniformCb.value;
			
			app.beginUndoGroup(this.scriptTitle);
			 
			var err = this.duringProcessErr;			 
			try
			{
				for (var i = 1; i < selLayers.length; i++)
				{
					var curS = selLayers[i].scale;
					var offset = (axis == "x") ? [-sRandom + 2*sRandom*Math.random(), 0, 0] : [0, -sRandom + 2*sRandom*Math.random(), 0];
					if (uniform && axis == "x") offset[1] = offset[0];
					else if (uniform && axis == "y") offset[0] = offset[1]; 
					var newS = curS.valueAtTime(comp.time, false) + offset;							
					
					curS.numKeys ? curS.setValueAtTime(comp.time, newS) : curS.setValue(newS);
				 }
			 }
			 catch(e)
			 {
				 throw(err);
			 }
				  
			app.endUndoGroup();
		}
		catch(err)
		{
			utils.throwErr(err);
		}				
	};
	
	// Randomly offsets opacity of the selected layers 
	this.offsetOpacityRandom = function (pal)
	{
		try
		{
			var comp = app.project.activeItem;
			var err = this.noCompErr;
			if (this.checkActiveItem(comp)) throw(err);
					
			var selLayers = comp.selectedLayers;
			var err = this.noLayersErr;
			if (selLayers.length < 1) throw(err);
			
			var oRandom = parseInt(pal.gr.pnl.pnl6.gr2.gr23.opacityRandomEt.text);
			
			app.beginUndoGroup(this.scriptTitle);
			 
			var err = this.duringProcessErr;			 
			try
			{
				for (var i = 1; i < selLayers.length; i++)
				{
					var curO = selLayers[i].opacity;
					var offset = -oRandom + 2*oRandom*Math.random();
					var newO = Math.max(0, Math.min(100, curO.valueAtTime(comp.time, false) + offset));							
					
					curO.numKeys ? curO.setValueAtTime(comp.time, newO) : curO.setValue(newO);
				 }
			 }
			 catch(e)
			 {
			 	throw(err);
			 }
				  
			app.endUndoGroup();
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
function DistributeLayersUtils()
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
new DistributeLayers().run(this);
