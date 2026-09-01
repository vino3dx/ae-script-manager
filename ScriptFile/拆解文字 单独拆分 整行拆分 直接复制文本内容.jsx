/* 

名称: 随机偏移
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
function DecomposeText()
{
	// Variable used to keep track of 'this' reference
	var decomposeText = this;
	
	// Create an instance of the utils class to use its functions
	var utils = new DecomposeTextUtils();

	// Script infos
	this.scriptMinSupportVersion = "9.0";
	this.scriptName = "DecomposeText.jsx";	
	this.scriptVersion = "2.2 ZHLMI 汉化";
	this.scriptTitle = "分解文本";
	this.scriptCopyright = "Copyright (c) 2010 Charles Bordenave";
	this.scriptHomepage = "http://www.nabscripts.com";
	this.scriptDescription = {en:"This script decomposes the content of the selected text layer and places each element on its own layer. Decomposition can be done by characters, words, or lines.\\r\\rPreserve characters location method maintains the characters at their current location but creates text layers having the same number of characters as the original layer (therefore their anchor point is the same as the original layer anchor point).\\r\\rAppropriate anchor point method creates text layers containing only one character (therefore their anchor point is as defined in the Paragraph panel), but it superimposes all text layers.\\r\\rSeparate into words and Separate into lines methods are the same as Appropriate anchor point but create text layers containing only words or only lines.", 
							  fr:"Ce script décompose le contenu du calque texte sélectionné et place chaque élément sur un calque indépendant. La décomposition peut se faire par caractère, par mot ou par ligne.\\r\\rLa méthode Préserver la position des caractères laisse les caractères à leur position actuelle mais elle crée des calques texte ayant le même nombre de caractères que le calque original (par conséquent leur point d\\'ancrage est le même que celui du calque original).\\r\\rLa méthode Point d\\'ancrage approprié crée des calques texte contenant un seul caractère (par conséquent leur point d\\'ancrage est comme défini dans le panneau Paragraphe), mais elle superpose tous les calques texte.\\r\\rSéparation par mot et Séparation par ligne sont similaires à Ancrage approprié sauf que la décomposition du texte original se fait par mot ou par ligne."};
	this.scriptAbout = {en:this.scriptName + ", v" + this.scriptVersion + "\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription), 
						fr:this.scriptName + ", v" + this.scriptVersion + "\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription)};		
	this.scriptUsage = {en:	"\u25BA 在 After Effects CS4 或更高版本中运行该脚本 \\r" +
							"\u25BA 选中一个文本图层 \\r" +  
							"\u25BA 指定使用的模式 \\r" +
							"\u25BA 点击分解按钮",
						fr:	"\u25BA Dans After Effects CS4 ou supérieur, exécuter le script \\r" +
							"\u25BA Sélectionner un calque texte \\r" +
							"\u25BA Spécifier la méthode à utiliser \\r" +
							"\u25BA Cliquer sur Décomposer"};
						
	// Errors
	this.requirementErr = {en:"This script requires After Effects CS4 or later.", fr:"Ce script nécessite After Effects CS4 ou supérieur."};	
	this.noCompErr = {en:"A comp must be active.", fr:"Une composition doit être active."};
	this.noLayerErr = {en:"Select exactly one text layer.", fr:"Sélectionnez exactement un calque texte."};
	this.badSelLayerErr = {en:"Select exactly one text layer.", fr:"Sélectionnez exactement un calque texte."};

	// UI strings & default settings
	this.aboutBtnName = "?";
	this.methodStName = {en:"模式:", fr:"Méthode:"};
	this.methodLstChoices = {en:'["字符原地分解", "分解到第一字", "空格间分解", "按行分解"]', fr:'["Préserver la position des caractères", "Ancrage approprié", "Séparation par mot", "Séparation par ligne"]'};
	this.methodLstSelDflt = 0;
	this.runBtnName = {en:"分解", fr:"Décomposer"};
		
	// Creates and displays the script interface
	this.buildUI = function (thisObj)
	{
		// dockable panel or palette
		var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", this.scriptTitle, undefined, {resizeable:false});

		// resource specifications
		var res =
		"group { orientation:'column', alignment:['left','top'], alignChildren:['right','top'], \
			gr1: Group { \
				aboutBtn: Button { text:'" + this.aboutBtnName + "', preferredSize:[0,0] } \
			}, \
			gr2: Group { \
				methodSt: StaticText { text:'" + utils.loc(this.methodStName) + "' }, \
				methodLst: DropDownList { properties:{items:" + utils.loc(this.methodLstChoices) + "} } \
			}, \
			gr3: Group { orientation:'row', alignment:['fill','top'], \
				runBtn: Button { text:'" + utils.loc(this.runBtnName) + "', alignment:['right','center'] } \
			} \
		}"; 
		pal.gr = pal.add(res);
		
		pal.gr.gr2.methodLst.selection = this.methodLstSelDflt;
		
		// event callbacks
		pal.gr.gr1.aboutBtn.onClick = function () 
		{ 
			utils.createAboutDlg(decomposeText.scriptAbout, decomposeText.scriptUsage); 
		};

		pal.gr.gr3.runBtn.onClick = function () 
		{ 
			decomposeText.decompose(pal); 
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

	// Determines whether a given layer is a text layer  
	this.checkLayerType = function (layer)
	{
		return !(layer instanceof TextLayer);
	}
	
	// Functional part of the script: places each character (or word or lines) of the selected text layer on its own layer 
	this.decompose = function (pal)
	{
		try
		{
			var comp = app.project.activeItem;
			var err = this.noCompErr;
			if (this.checkActiveItem(comp)) throw(err);
					
			var layer = comp.selectedLayers[0];
			var err = this.noLayerErr;
			if (!layer) throw(err);
			
			var err = this.badSelLayerErr;
			if (this.checkLayerType(layer)) throw(err);
			
			var txt = layer.sourceText.value.toString();
		
			app.beginUndoGroup(this.scriptTitle);
			
			switch (pal.gr.gr2.methodLst.selection.index)
			{
				case 0: // Preserve characters location		
					var numCharsToRemove = 0;
					for (var i = 0; i < txt.length; i++)
					{
						var curChar = txt.charAt(i);
						if (curChar.match(/\r/))
						{
							numCharsToRemove++;
							continue;
						}
						
						var newLayer = layer.duplicate();
						newLayer.name = curChar;
							
						var animator = newLayer.property("ADBE Text Properties").property("ADBE Text Animators").addProperty("ADBE Text Animator");
						var opacityProp = animator.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity");
						var expressionSelector = animator.property("ADBE Text Selectors").addProperty("ADBE Text Expressible Selector");
						opacityProp.setValue(0);
						expressionSelector.property("ADBE Text Expressible Amount").expression = "selectorValue * (textIndex != " + (i+1-numCharsToRemove) + ");";	 
						
						if (curChar.match(/\s/))
							newLayer.remove();
					}
					break;
				
				case 1: // Appropriate anchor point
					for (var i = 0; i < txt.length; i++)
					{
						var curChar = txt.charAt(i);
						if (!curChar.match(/\s|\r/))
						{
							var newLayer = layer.duplicate();
							newLayer.sourceText.numKeys ? newLayer.sourceText.setValueAtTime(comp.time,curChar) : newLayer.sourceText.setValue(curChar);
						}
					}
					break;
				
				case 2: // Separate into words
					var words = txt.split(/\s|\r/);
					for (var i = 0; i < words.length; i++) 
					{
						if (words[i].length)
						{
							var newLayer = layer.duplicate();
							newLayer.sourceText.numKeys ? newLayer.sourceText.setValueAtTime(comp.time,words[i]) : newLayer.sourceText.setValue(words[i]);
						}
					}				  
					break;
				
				case 3: // Separate into lines
					var lines = txt.split(/\r/);
					for (var i = 0; i < lines.length; i++) 
					{
						if (lines[i].length)
						{
							var newLayer = layer.duplicate();
							newLayer.sourceText.numKeys ? newLayer.sourceText.setValueAtTime(comp.time,lines[i]) : newLayer.sourceText.setValue(lines[i]);
						}
					}
					break;
				
				default:
					break;
			}
			
			layer.enabled = false;
			layer.selected = false;				  
				  
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
function DecomposeTextUtils()
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
new DecomposeText().run(this);
