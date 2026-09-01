/* 

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


function Create3DMengerSponge()
{
    // Variable used to keep track of 'this' reference
    var create3DMengerSponge = this;
    
    // Create an instance of the utils class to use its functions
    var utils = new Create3DMengerSpongeUtils();

    // Script infos
    this.scriptMinSupportVersion = "8.0";
    this.scriptName = "创建3D门格尔海绵.jsx";    
    this.scriptVersion = "1.0";
    this.scriptTitle = "创建3D门格尔海绵";
    this.scriptCopyright = "Copyright (c) 2010 CaoRun.Net";
    this.scriptHomepage = "http://caorun.blogcn.com";
    this.scriptDescription = {en: "此脚本用做创建3D门格尔海绵.\\r\\r\\r\\r \"\"", fr:"Ce script crée un éponge de Menger.\\r\\rL\\'éponge de Menger est une forme fractale tridimensionnelle composée de cubes. La construction se fait de façon récursive. Le nombre total de cubes est 20^d, où d représente la profondeur de la récursion (la valeur de ce paramètre doit donc être petite).\\r\\rL\\'éponge de Menger est créée dans une comp nommée \"Comp Menger\"."};
    this.scriptAbout = {en:this.scriptName + ", v" + this.scriptVersion + "\\r\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription), fr:this.scriptName + ", v" + this.scriptVersion + "\\r\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription)};        

    // Errors & Warnings
    this.requirementErr = {en:"这个脚本运行环境在cs3或更高.", fr:"Ce script nécessite After Effects CS3 ou supérieur."};
    this.mengerConstructionErr = {en:"发生错误,同时创建了门格尔海绵.", fr:"Une erreur s'est produite pendant la construction de l'éponge de Menger."};    
    this.lotOfCubesWng = {en:"将创建包含一个最终合成 %s 立方体.\r你要继续吗 ?", fr:"La comp finale contiendra %s cubes.\rSouhaitez-vous continuer ?"};
        
    // UI strings 
    this.aboutBtnName = "关于";
    this.settingsPnlName = {en:"设置", fr:"Paramètres"};
    this.depthStName = {en:"递归厚度:", fr:"Profondeur récursion:"};
    this.depthEtDflt = 1;
    this.sizeStName = {en:"尺寸:", fr:"Taille:"};
    this.sizeEtDflt = 900;
    this.addControllerCbName = {en:"添加控制和灯光", fr:"Ajouter contrôleur et lumière"};
    this.runBtnName = {en:"创建", fr:"Créer"};
    
    // Miscellaneous
    this.cubeFolderName = {en:"Cube", fr:"Cube"};
    this.cubePrecompName = {en:"Cube Precomp", fr:"Précomp Cube"};
    this.cubeLayerNames = {en:["Front","Back","Left","Right","Bottom","Top"], fr:["Avant","Arrière","Gauche","Droite","Bas","Haut"]};
    this.controllerLayerName = {en:"Controller", fr:"Contrôleur"};
    this.buildCubeInfo = {en:"Build Cube ", fr:"Construit Cube "};
    this.completeInfo = {en:"Complete !", fr:"Terminé !"};
    
    this.finalCompName = {en:"Menger Comp", fr:"Comp Menger"};  
    this.finalCompWidth = 800;
    this.finalCompHeight = 600;  
    this.finalCompDuration = 16; // seconds 
    this.finalCompFramerate = 25;
    this.cubeColor = [1,1,1]; // white
    
    // Internal data
    this.depthOfRecursion = this.depthEtDflt;
    this.size = this.sizeEtDflt;
    this.cubesFolder = null;
    this.cubeSize = 0;
    this.totalCubes = 0;
    this.num = 0;
    this.positionMatrix = new Array();
    this.finalComp = null;            
    
    /**
     Creates and displays the script interface
     @param {Object} thisObj A Panel object if the script is launched from the Window menu, null otherwise    
    */
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
            gr2: Panel { text:'" + utils.loc(this.settingsPnlName) + "', alignment:['fill','top'], alignChildren:['right','top'], \
                gr21: Group { \
                    depthSt: StaticText { text:'" + utils.loc(this.depthStName) + "' }, \
                    depthEt: EditText { text:'" + this.depthEtDflt + "', characters:5 } \
                }, \
                gr22: Group { \
                    sizeSt: StaticText { text:'" + utils.loc(this.sizeStName) + "' }, \
                    sizeEt: EditText { text:'" + this.sizeEtDflt + "', characters:5 } \
                } \
            }, \
            gr3: Group { alignment:['fill','top'], \
                addControllerCb: Checkbox { text:'" + utils.loc(this.addControllerCbName) + "', value:true, alignment:['left','center'] }, \
                runBtn: Button { text:'" + utils.loc(this.runBtnName) + "', alignment:['right','center'] } \
            } \
        }"; 
        pal.gr = pal.add(res);
        
        pal.gr.gr2.gr21.depthEt.graphics.foregroundColor = 
        pal.gr.gr2.gr22.sizeEt.graphics.foregroundColor = pal.graphics.newPen(pal.graphics.BrushType.SOLID_COLOR, [0,0,0], 1);
        
        // event callbacks
        pal.gr.gr1.aboutBtn.onClick = function () 
        { 
            utils.createAboutDlg(create3DMengerSponge.scriptAbout); 
        };
        
        pal.gr.gr2.gr21.depthEt.onChange = function () 
        {
            if (isNaN(this.text) || parseInt(this.text) <= 0) this.text = create3DMengerSponge.depthEtDflt;
            else if (parseInt(this.text) >= 3)
            {
                create3DMengerSponge.totalCubes = Math.pow(20, parseInt(this.text));
                
                if (!confirm(utils.loc(create3DMengerSponge.lotOfCubesWng).replace('%s', create3DMengerSponge.totalCubes))) 
                {
                    this.text = create3DMengerSponge.depthEtDflt;                
                }
            }
            else this.text = parseInt(this.text);
        };
        
        pal.gr.gr2.gr22.sizeEt.onChange = function ()
        {
            if (isNaN(this.text) || parseInt(this.text) < 100) this.text = create3DMengerSponge.sizeEtDflt;
            else this.text = Math.round(this.text);
        };           

        pal.gr.gr3.runBtn.onClick = function () 
        { 
            create3DMengerSponge.createMengerSponge(pal); 
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

    /**
     Creates and positions a 3D solid
     @param {Object} comp A comp object in witch the solid is created
     @param {Array} color A three-dimensional array representing the solid color
     @param {String} name A string representing the source layer name
     @param {Number} width The solid width
     @param {Number} height The solid height
     @param {Array} pos A three-dimensional array representing the position of the solid
     @param {Array} ori A three-dimensional array representing the orientation of the solid     
    */    
    this.createSolid = function (comp, color, name, width, height, par, pos, ori)
    {
        var layer = comp.layers.addSolid(color, name, width, height, par);
        layer.threeDLayer = true;
        layer.position.setValue(pos);
        layer.orientation.setValue(ori);
    };   

    /**
     Creates and positions a cube
     @param {Array} centerPos A three-dimensional array representing the comp coordinates of the cube center
     @param {Number} size The cube size          
    */    
    this.createCube = function (centerPos, size)
    {   
        size = Math.floor(size);
        var half = size / 2;
        
        /* 
        var resize = false;
        var rescale;        
        if (size < 4) 
        {
            rescale = (100 * size) / 4;
            resize = true;
            size = 4;
        }
        */       
        
        // Info palette
        clearOutput();
        writeLn(utils.loc(this.buildCubeInfo) + this.num + "/" + this.totalCubes);
        
        // Create cube precomp
        this.num ++;        
        var preComp;        
        if (this.num == 1) // first time we arrive here
        {
            preComp = app.project.items.addComp(utils.loc(this.cubePrecompName), size, size, 1.0, this.finalCompDuration, this.finalCompFramerate);
            preComp.parentFolder = this.cubeFolder;
        
            // Build cube
            var pos = [[half, half, 0], [half, half, size], [0, half, half], [size, half, half], [half, size, half], [half, 0, half]];
            var ori = [[0,0,0], [0,180,0], [0,90,0], [0,270,0], [90,0,0], [270,0,0]];
            for (var i = 0; i < 6; i++)
            {
                this.createSolid(preComp, this.cubeColor, utils.loc(this.cubeLayerNames)[i], size, size, 1.0, pos[i], ori[i]);            
            }            
            this.cubePrecomp = preComp;
        }
        else // the cube precomp already exists, so we just reuse it
        {
            preComp = this.cubePrecomp;
        }
                
        var precompLayer = this.finalComp.layers.add(preComp);
        precompLayer.threeDLayer = true;
        precompLayer.collapseTransformation = true;
        
        precompLayer.position.setValue(centerPos);      
        precompLayer.anchorPoint.setValue([half,half,half]);
        
        /*
        if (resize) precompLayer.scale.setValue([rescale,rescale,rescale]);
        */ 
        
        // Rename current cube
        var numStr = "" + this.num;
        var leadingZero = 3;
        while (numStr.length < leadingZero) numStr = "0" + numStr;
        precompLayer.name = utils.loc(this.cubePrecompName) + " - " + numStr;
    };

    /**
     Fill the current level with cubes
     @param {Number} x X-coordinate of the current cube origin
     @param {Number} y Y-coordinate
     @param {Number} z Z-coordinate
     @param {Number} s Sponge size
     @param {Number} d Depth of recursion          
    */    
    this.cubes = function (x, y, z, s, d)
    {
        var third = s / 3;
        for (var i = -third; i <= third; i += third)
        for (var j = -third; j <= third; j += third)
        for (var k = -third; k <= third; k += third)
        {
            if (Math.abs(i) + Math.abs(j) + Math.abs(k) >= 2 * third)
            {
                this.MengerSponge(x+i, y+j, z+k, third, d);
            }
        }
    };
    
    /**
     Functional part of the script: recursively creates cubes
     @param {Number} x X-coordinate of the current cube origin
     @param {Number} y Y-coordinate
     @param {Number} z Z-coordinate
     @param {Number} s Sponge size
     @param {Number} d Depth of recursion          
    */    
    this.MengerSponge = function (x, y, z, s, d)
    {
        if (d > 0)
        {
            d--;
            this.cubes(x, y, z, s, d);
        }
        else
        {
            this.positionMatrix.push([x, y, z]);
            this.createCube([x, y, z], s);
            this.positionMatrix.pop();
        }
    };

    /**
     Add a 3D null to control the Menger Sponge
     @param {Object} comp A comp object in which the controller is created          
    */    
    this.addController = function (comp)
    {
        // add default light to see something more attractive
        comp.layers.addLight("Light", [comp.width/2, comp.height/2]);
        
        // add controller
        var controllerLayer = comp.layers.addNull();
        controllerLayer.threeDLayer = true;
        controllerLayer.name = utils.loc(this.controllerLayerName);
        
        // move layer to the center of the sponge
        controllerLayer.position.setValue([0,0,0]);
        
        // parenting (skip the first two layers - null and light layers)
        for (var i = 3; i <= comp.numLayers; i++) comp.layer(i).parent = controllerLayer;
            
        // reposition 
        controllerLayer.position.setValue([comp.width / 2, comp.height / 2, (Math.pow(3, this.depthOfRecursion) * this.cubeSize) / 2]);
        
        // little animation for fun...
        /*
        var keyTimes = [0, this.finalCompDuration];
        var keyValuesRotX = [-25, -25 + 2 * 360];
        var keyValuesRotY = [90, 90 + 2 * 360];
        controllerLayer.rotationX.setValuesAtTimes(keyTimes, keyValuesRotX);
        controllerLayer.rotationY.setValuesAtTimes(keyTimes, keyValuesRotY);
        */
        controllerLayer.selected = true;
    };
    
    /**
     Initializes data and calls the main routine
     @param {Object} pal A palette or a dockable panel containing all user parameters          
    */    
    this.createMengerSponge = function (pal)
    {
        try
        {
            var proj = app.project;
            
            app.beginUndoGroup(this.scriptTitle);
                        
            // Create final comp
            this.finalComp = proj.items.addComp(utils.loc(this.finalCompName), this.finalCompWidth, this.finalCompHeight, 1.0, this.finalCompDuration, this.finalCompFramerate);
                                           
            // Create folder to store cube precomp
            this.cubeFolder = proj.items.addFolder(utils.loc(this.cubeFolderName));
            
            // Retrieve settings from UI
            this.depthOfRecursion = parseInt(pal.gr.gr2.gr21.depthEt.text);
            this.size = parseInt(pal.gr.gr2.gr22.sizeEt.text);
            
            // Initialization
            this.positionMatrix = new Array();
            this.positionMatrix.push([0, 0, 0]);
            this.totalCubes = Math.pow(20, this.depthOfRecursion);
            this.cubeSize = this.size / (Math.pow(3, this.depthOfRecursion));                
            this.num = 0; 
                    
            // Build Menger Sponge
            var err = this.mengerConstructionErr;
            try
            {
                this.MengerSponge(0, 0, 0, this.size, this.depthOfRecursion);
            }
            catch(e)
            {
                throw(err);
            };
            
            // Add controller
            if (pal.gr.gr3.addControllerCb.value)
            {
                this.addController(this.finalComp);
            }
            
            // Info palette
            clearOutput();
            writeLn(utils.loc(this.completeInfo));
                
            app.endUndoGroup();
        }
        catch(err)
        {
            utils.throwErr(err);
        }                
    };
    
    /**
     Runs the script  
     @param {Object} thisObj A Panel object if the script is launched from the Window menu, null otherwise
    */
    this.run = function (thisObj) 
    {
        if (parseFloat(app.version) < parseFloat(this.scriptMinSupportVersion))
        {
            this.throwErr(this.requirementErr);
        }
        else
        {
            this.buildUI(thisObj);
        }    
    };
}


/**
 This class provides some utility functions used by Create3DMengerSponge
 @class Some utility functions grouped in a class
*/
function Create3DMengerSpongeUtils()
{
    /**
     String localization function: english and french languages are supported
     @param {Object} str A localization object containing the localized versions of a string    
     @return Appropriate localized version of str
    */    
    this.loc = function (str)
    {
        return app.language == Language.FRENCH ? str.fr : str.en;
    };

    /**
     Displays a window containg a localized error message
     @param {Object} err A localization object containing the localized versions of an error message
    */    
    this.throwErr = function (err)
    {
        var wndTitle = $.fileName.substring($.fileName.lastIndexOf("/")+1, $.fileName.lastIndexOf("."));
        Window.alert("脚本错误:\r" + this.loc(err), wndTitle, true);
    };            

    /**
     Displays a window containg a localized informative message
     @param {Object} msg A localization object containing the localized versions of an informative message     
    */    
    this.throwMsg = function (msg)
    {
        var wndTitle = $.fileName.substring($.fileName.lastIndexOf("/")+1, $.fileName.lastIndexOf("."));
        Window.alert("脚本信息:\r" + this.loc(msg), wndTitle, true);
    };
    
    /**
     Displays a customized window containg the About text
     @param {String} aboutStr The text to display
    */
    this.createAboutDlg = function (aboutStr)
    {        
        eval(unescape('%20%20%20%20%20%20%20%20%2F%2A%2A%20%0A%20%20%20%20%20%20%20%20%20%44%72%61%77%20%73%6F%6D%65%20%72%61%6E%64%6F%6D%20%72%65%63%74%61%6E%67%6C%65%73%20%28%70%6F%73%69%74%69%6F%6E%2C%20%73%69%7A%65%2C%20%63%6F%6C%6F%72%2C%20%61%6C%70%68%61%29%20%6F%6E%20%74%68%65%20%77%69%6E%64%6F%77%20%62%61%63%6B%67%72%6F%75%6E%64%0A%20%20%20%20%20%20%20%20%20%40%69%67%6E%6F%72%65%20%0A%20%20%20%20%20%20%20%20%2A%2F%0A%20%20%20%20%20%20%20%20%66%75%6E%63%74%69%6F%6E%20%61%64%64%4E%61%62%73%63%72%69%70%74%73%42%61%63%6B%67%72%6F%75%6E%64%53%69%67%6E%61%74%75%72%65%28%77%6E%64%29%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%6E%75%6D%52%65%63%74%20%3D%20%32%34%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%6D%69%6E%4F%70%61%63%69%74%79%20%3D%20%30%2E%30%35%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%6D%61%78%4F%70%61%63%69%74%79%20%3D%20%30%2E%31%35%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%6C%65%66%74%45%64%67%65%20%3D%20%30%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%74%6F%70%45%64%67%65%20%3D%20%30%3B%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%72%69%67%68%74%45%64%67%65%20%3D%20%77%6E%64%2E%77%69%6E%64%6F%77%42%6F%75%6E%64%73%2E%77%69%64%74%68%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%62%6F%74%74%6F%6D%45%64%67%65%20%3D%20%77%6E%64%2E%77%69%6E%64%6F%77%42%6F%75%6E%64%73%2E%68%65%69%67%68%74%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%66%6F%72%20%28%76%61%72%20%69%20%3D%20%30%20%3B%20%69%20%3C%20%6E%75%6D%52%65%63%74%3B%20%69%2B%2B%29%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%78%4C%6F%63%20%3D%20%31%30%20%2B%20%28%72%69%67%68%74%45%64%67%65%20%2D%20%32%30%29%20%2A%20%4D%61%74%68%2E%72%61%6E%64%6F%6D%28%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%79%4C%6F%63%20%3D%20%31%30%20%2B%20%28%62%6F%74%74%6F%6D%45%64%67%65%20%2D%20%32%30%29%20%2A%20%4D%61%74%68%2E%72%61%6E%64%6F%6D%28%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%77%69%64%74%68%20%3D%20%35%20%2B%20%31%35%20%2A%20%4D%61%74%68%2E%72%61%6E%64%6F%6D%28%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%68%65%69%67%68%74%20%3D%20%35%20%2B%20%31%35%20%2A%20%4D%61%74%68%2E%72%61%6E%64%6F%6D%28%29%3B%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%62%6F%72%64%65%72%57%69%64%74%68%20%3D%20%31%20%2B%20%34%20%2A%20%4D%61%74%68%2E%72%61%6E%64%6F%6D%28%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%62%6F%72%64%65%72%43%6F%6C%6F%72%20%3D%20%5B%4D%61%74%68%2E%72%61%6E%64%6F%6D%28%29%2C%20%4D%61%74%68%2E%72%61%6E%64%6F%6D%28%29%2C%20%4D%61%74%68%2E%72%61%6E%64%6F%6D%28%29%2C%20%6D%69%6E%4F%70%61%63%69%74%79%20%2B%20%28%6D%61%78%4F%70%61%63%69%74%79%20%2D%20%6D%69%6E%4F%70%61%63%69%74%79%29%20%2A%20%4D%61%74%68%2E%72%61%6E%64%6F%6D%28%29%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%63%6F%6C%6F%72%42%72%75%73%68%20%3D%20%77%6E%64%2E%67%72%61%70%68%69%63%73%2E%6E%65%77%42%72%75%73%68%28%77%6E%64%2E%67%72%61%70%68%69%63%73%2E%42%72%75%73%68%54%79%70%65%2E%53%4F%4C%49%44%5F%43%4F%4C%4F%52%2C%20%62%6F%72%64%65%72%43%6F%6C%6F%72%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%77%6E%64%2E%67%31%20%3D%20%77%6E%64%2E%61%64%64%28%22%67%72%6F%75%70%22%2C%20%5B%78%4C%6F%63%2C%20%79%4C%6F%63%2C%20%78%4C%6F%63%20%2B%20%77%69%64%74%68%2C%20%79%4C%6F%63%20%2B%20%62%6F%72%64%65%72%57%69%64%74%68%5D%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%77%6E%64%2E%67%32%20%3D%20%77%6E%64%2E%61%64%64%28%22%67%72%6F%75%70%22%2C%20%5B%78%4C%6F%63%2C%20%79%4C%6F%63%20%2B%20%68%65%69%67%68%74%20%2D%20%62%6F%72%64%65%72%57%69%64%74%68%2C%20%78%4C%6F%63%20%2B%20%77%69%64%74%68%2C%20%79%4C%6F%63%20%2B%20%68%65%69%67%68%74%5D%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%77%6E%64%2E%67%33%20%3D%20%77%6E%64%2E%61%64%64%28%22%67%72%6F%75%70%22%2C%20%5B%78%4C%6F%63%2C%20%79%4C%6F%63%20%2B%20%62%6F%72%64%65%72%57%69%64%74%68%2C%20%78%4C%6F%63%20%2B%20%62%6F%72%64%65%72%57%69%64%74%68%2C%20%79%4C%6F%63%20%2B%20%68%65%69%67%68%74%20%2D%20%62%6F%72%64%65%72%57%69%64%74%68%5D%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%77%6E%64%2E%67%34%20%3D%20%77%6E%64%2E%61%64%64%28%22%67%72%6F%75%70%22%2C%20%5B%78%4C%6F%63%20%2B%20%77%69%64%74%68%20%2D%20%62%6F%72%64%65%72%57%69%64%74%68%2C%20%79%4C%6F%63%20%2B%20%62%6F%72%64%65%72%57%69%64%74%68%2C%20%78%4C%6F%63%20%2B%20%77%69%64%74%68%2C%20%79%4C%6F%63%20%2B%20%68%65%69%67%68%74%20%2D%20%62%6F%72%64%65%72%57%69%64%74%68%5D%29%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%77%6E%64%2E%67%31%2E%67%72%61%70%68%69%63%73%2E%62%61%63%6B%67%72%6F%75%6E%64%43%6F%6C%6F%72%20%3D%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%77%6E%64%2E%67%32%2E%67%72%61%70%68%69%63%73%2E%62%61%63%6B%67%72%6F%75%6E%64%43%6F%6C%6F%72%20%3D%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%77%6E%64%2E%67%33%2E%67%72%61%70%68%69%63%73%2E%62%61%63%6B%67%72%6F%75%6E%64%43%6F%6C%6F%72%20%3D%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%77%6E%64%2E%67%34%2E%67%72%61%70%68%69%63%73%2E%62%61%63%6B%67%72%6F%75%6E%64%43%6F%6C%6F%72%20%3D%20%63%6F%6C%6F%72%42%72%75%73%68%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%20%20%20%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%76%61%72%20%64%6C%67%20%3D%20%6E%65%77%20%57%69%6E%64%6F%77%28%22%64%69%61%6C%6F%67%22%2C%20%22%41%62%6F%75%74%22%29%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20%70%61%6E%65%6C%20%62%6F%72%64%65%72%53%74%79%6C%65%3A%20%6F%6E%65%20%6F%66%20%62%6C%61%63%6B%2C%20%65%74%63%68%65%64%2C%20%67%72%61%79%2C%20%72%61%69%73%65%64%2C%20%73%75%6E%6B%65%6E%2E%20%44%65%66%61%75%6C%74%20%69%73%20%65%74%63%68%65%64%2E%0A%20%20%20%20%20%20%20%20%2F%2F%20%72%65%73%6F%75%72%63%65%20%73%70%65%63%69%66%69%63%61%74%69%6F%6E%73%0A%20%20%20%20%20%20%20%20%76%61%72%20%72%65%73%20%3D%0A%20%20%20%20%20%20%20%20%22%67%72%6F%75%70%20%7B%20%6F%72%69%65%6E%74%61%74%69%6F%6E%3A%27%63%6F%6C%75%6D%6E%27%2C%20%61%6C%69%67%6E%6D%65%6E%74%3A%5B%27%66%69%6C%6C%27%2C%27%66%69%6C%6C%27%5D%2C%20%5C%0A%20%20%20%20%20%20%20%20%20%20%20%20%61%62%6F%75%74%50%6E%6C%3A%20%50%61%6E%65%6C%20%7B%20%70%72%6F%70%65%72%74%69%65%73%3A%7B%20%62%6F%72%64%65%72%53%74%79%6C%65%3A%27%73%75%6E%6B%65%6E%27%20%7D%2C%20%5C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%61%62%6F%75%74%45%74%3A%20%45%64%69%74%54%65%78%74%20%7B%20%74%65%78%74%3A%27%22%20%2B%20%74%68%69%73%2E%6C%6F%63%28%61%62%6F%75%74%53%74%72%29%20%2B%20%22%27%2C%20%70%72%6F%70%65%72%74%69%65%73%3A%7B%6D%75%6C%74%69%6C%69%6E%65%3A%74%72%75%65%7D%2C%20%70%72%65%66%65%72%72%65%64%53%69%7A%65%3A%5B%32%38%30%2C%31%35%30%5D%2C%20%61%6C%69%67%6E%6D%65%6E%74%3A%5B%27%72%69%67%68%74%27%2C%27%63%65%6E%74%65%72%27%5D%20%7D%20%5C%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%2C%20%5C%0A%20%20%20%20%20%20%20%20%20%20%20%20%62%74%6E%73%47%72%3A%20%47%72%6F%75%70%20%7B%20%61%6C%69%67%6E%6D%65%6E%74%3A%5B%27%66%69%6C%6C%27%2C%27%66%69%6C%6C%27%5D%2C%20%5C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%76%69%73%69%74%42%74%6E%3A%20%42%75%74%74%6F%6E%20%7B%20%74%65%78%74%3A%27%56%69%73%69%74%20%48%6F%6D%65%70%61%67%65%27%2C%20%61%6C%69%67%6E%6D%65%6E%74%3A%5B%27%6C%65%66%74%27%2C%27%63%65%6E%74%65%72%27%5D%20%7D%2C%20%5C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%6F%6B%42%74%6E%3A%20%42%75%74%74%6F%6E%20%7B%20%74%65%78%74%3A%27%4F%6B%27%2C%20%61%6C%69%67%6E%6D%65%6E%74%3A%5B%27%72%69%67%68%74%27%2C%27%63%65%6E%74%65%72%27%5D%20%7D%20%5C%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%20%5C%0A%20%20%20%20%20%20%20%20%7D%22%3B%20%0A%20%20%20%20%20%20%20%20%64%6C%67%2E%67%72%20%3D%20%64%6C%67%2E%61%64%64%28%72%65%73%29%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20%6F%6E%20%4D%61%63%20%77%65%20%63%61%6E%20%64%69%73%61%62%6C%65%20%65%64%69%74%20%74%65%78%74%20%77%68%69%6C%65%20%61%6C%6C%6F%77%69%6E%67%20%73%63%72%6F%6C%6C%69%6E%67%2C%20%6F%6E%20%57%69%6E%64%6F%77%73%20%77%65%20%63%61%6E%27%74%0A%20%20%20%20%20%20%20%20%64%6C%67%2E%67%72%2E%61%62%6F%75%74%50%6E%6C%2E%61%62%6F%75%74%45%74%2E%65%6E%61%62%6C%65%64%20%3D%20%28%24%2E%6F%73%2E%69%6E%64%65%78%4F%66%28%22%57%69%6E%22%29%20%21%3D%20%2D%31%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20%64%72%61%77%20%72%61%6E%64%6F%6D%20%62%61%63%6B%67%72%6F%75%6E%64%20%63%6F%6C%6F%72%20%28%67%72%61%79%73%63%61%6C%65%29%0A%20%20%20%20%20%20%20%20%69%66%20%28%70%61%72%73%65%46%6C%6F%61%74%28%61%70%70%2E%76%65%72%73%69%6F%6E%29%20%3E%3D%20%39%2E%30%29%20%2F%2F%20%43%53%34%20%6F%72%20%6C%61%74%65%72%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%77%68%69%74%65%42%72%75%73%68%20%3D%20%64%6C%67%2E%67%72%61%70%68%69%63%73%2E%6E%65%77%42%72%75%73%68%28%64%6C%67%2E%67%72%61%70%68%69%63%73%2E%42%72%75%73%68%54%79%70%65%2E%53%4F%4C%49%44%5F%43%4F%4C%4F%52%2C%20%5B%31%2C%20%31%2C%20%31%2C%20%31%5D%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%72%61%6E%64%20%3D%20%4D%61%74%68%2E%72%61%6E%64%6F%6D%28%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%62%67%42%72%75%73%68%20%3D%20%64%6C%67%2E%67%72%61%70%68%69%63%73%2E%6E%65%77%42%72%75%73%68%28%64%6C%67%2E%67%72%61%70%68%69%63%73%2E%42%72%75%73%68%54%79%70%65%2E%53%4F%4C%49%44%5F%43%4F%4C%4F%52%2C%20%5B%72%61%6E%64%2C%20%72%61%6E%64%2C%20%72%61%6E%64%2C%20%31%5D%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%64%6C%67%2E%67%72%61%70%68%69%63%73%2E%62%61%63%6B%67%72%6F%75%6E%64%43%6F%6C%6F%72%20%3D%20%62%67%42%72%75%73%68%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%64%6C%67%2E%67%72%2E%61%62%6F%75%74%50%6E%6C%2E%67%72%61%70%68%69%63%73%2E%62%61%63%6B%67%72%6F%75%6E%64%43%6F%6C%6F%72%20%3D%20%77%68%69%74%65%42%72%75%73%68%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%64%6C%67%2E%6C%61%79%6F%75%74%2E%6C%61%79%6F%75%74%28%74%72%75%65%29%3B%20%2F%2F%20%74%6F%20%67%65%74%20%77%69%6E%64%6F%77%20%62%6F%75%6E%64%73%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%61%64%64%4E%61%62%73%63%72%69%70%74%73%42%61%63%6B%67%72%6F%75%6E%64%53%69%67%6E%61%74%75%72%65%28%64%6C%67%29%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%64%6C%67%2E%67%72%2E%62%74%6E%73%47%72%2E%6F%6B%42%74%6E%2E%6F%6E%43%6C%69%63%6B%20%3D%20%66%75%6E%63%74%69%6F%6E%20%28%29%20%7B%20%64%6C%67%2E%63%6C%6F%73%65%28%29%3B%20%7D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20%6F%70%65%6E%20%68%6F%6D%65%70%61%67%65%20%75%72%6C%0A%20%20%20%20%20%20%20%20%64%6C%67%2E%67%72%2E%62%74%6E%73%47%72%2E%76%69%73%69%74%42%74%6E%2E%6F%6E%43%6C%69%63%6B%20%3D%20%66%75%6E%63%74%69%6F%6E%20%28%29%20%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%63%6D%64%20%3D%20%22%22%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%76%61%72%20%75%72%6C%20%3D%20%22%68%74%74%70%3A%2F%2F%77%77%77%2E%6E%61%62%73%63%72%69%70%74%73%2E%63%6F%6D%2F%22%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%69%66%20%28%24%2E%6F%73%2E%69%6E%64%65%78%4F%66%28%22%57%69%6E%22%29%20%21%3D%20%2D%31%29%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%69%66%20%28%46%69%6C%65%28%22%43%3A%2F%50%72%6F%67%72%61%6D%20%46%69%6C%65%73%2F%4D%6F%7A%69%6C%6C%61%20%46%69%72%65%66%6F%78%2F%66%69%72%65%66%6F%78%2E%65%78%65%22%29%2E%65%78%69%73%74%73%29%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%0A%09%09%09%09%09%63%6D%64%20%2B%3D%20%22%43%3A%2F%50%72%6F%67%72%61%6D%20%46%69%6C%65%73%2F%4D%6F%7A%69%6C%6C%61%20%46%69%72%65%66%6F%78%2F%66%69%72%65%66%6F%78%2E%65%78%65%20%22%20%2B%20%75%72%6C%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%65%6C%73%65%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%09%63%6D%64%20%2B%3D%20%22%43%3A%2F%50%72%6F%67%72%61%6D%20%46%69%6C%65%73%2F%49%6E%74%65%72%6E%65%74%20%45%78%70%6C%6F%72%65%72%2F%69%65%78%70%6C%6F%72%65%2E%65%78%65%20%22%20%2B%20%75%72%6C%3B%0A%09%09%09%09%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%65%6C%73%65%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%09%63%6D%64%20%2B%3D%20%22%6F%70%65%6E%20%5C%22%22%20%2B%20%75%72%6C%20%2B%20%22%5C%22%22%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%74%72%79%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%0A%09%09%09%09%73%79%73%74%65%6D%2E%63%61%6C%6C%53%79%73%74%65%6D%28%63%6D%64%29%3B%0A%09%09%09%7D%0A%09%09%09%63%61%74%63%68%28%65%29%0A%09%09%09%7B%0A%09%09%09%09%61%6C%65%72%74%28%65%29%3B%0A%09%09%09%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%64%6C%67%2E%63%65%6E%74%65%72%28%29%3B%0A%20%20%20%20%20%20%20%20%64%6C%67%2E%73%68%6F%77%28%29%3B'));
    };
}


/**
 Creates an instance of the main class and run it
*/
new Create3DMengerSponge().run(this);
