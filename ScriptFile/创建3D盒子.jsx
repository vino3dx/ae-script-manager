/* 

名称: 创建3D盒子
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



function Create3DBox()
{
    // Variable used to keep track of 'this' reference
    var create3DBox = this;

    // Create an instance of the utils class to use its functions
    var utils = new Create3DBoxUtils();

    // Script infos
    this.scriptMinSupportVersion = "8.0";
    this.scriptName = "创建3D盒子.jsx";
    this.scriptVersion = "1.0";
    this.scriptTitle = "创建3D盒子";
    this.scriptCopyright = "Copyright (c) 2020";
    this.scriptHomepage = "https://wanvfx.com";
    this.scriptDescription = {en: "此脚本将创建一个用户自定义的3D盒子.\\r\\r\\r\\r\\r\\r", fr:"Ce script crée une boîte 3D avec les calques choisis par l\\'utilisateur.\\r\\rAssignez un calque à chacune des faces de la boîte et le script va les positionner et les redimensionner pour construire une boîte d\\'une taille donnée.\\r\\rNotez que le même calque peut servir pour plusieurs faces (le script fera des copies du calque). Ceci permet par exemple de créer une boîte avec un seul calque dans la composition.\\r\\rPour un meilleur contrôle, l\\'option \"Ajouter Contrôleur\" parente chaque face à un Nul 3D positionné au centre de la boîte."};
    this.scriptAbout = {en:this.scriptName + ", v" + this.scriptVersion + "\\r\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription), fr:this.scriptName + ", v" + this.scriptVersion + "\\r\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription)};

    // Errors
    this.requirementErr = {en:"这个脚本运行环境在cs3或更高.", fr:"Ce script nécessite After Effects CS3 ou supérieur."};
    this.noCompErr = {en:"合成必须激活.", fr:"Une composition doit être active."};
    this.noLayersErr = {en:"合成中至少含有一个层.", fr:"La composition doit contenir au moins un calque."};
    this.noSelErr = {en:"您必须指定一个层给盒子的纹理 . 不要忘记刷新图层列表,如果你已经打开新的合成或新的层. ", fr:"Vous devez assigner un calque à chacune des faces de la boîte. N'oubliez pas d'Actualiser la liste des calques si vous avez ouvert une nouvelle comp ou créé de nouveaux calques."};
    this.badLayersErr = {en:"Layer \"%s\" 不能用来做盒子的纹理.", fr:"Le calque \"%s\" ne peut pas être utilisé pour créer la boîte."};

    // UI strings & default settings
    this.aboutBtnName = "关于";
    this.dimensionsPnlName = {en:"尺寸", fr:"Dimensions"};
    this.widthStName = {en:"宽度:", fr:"Largeur:"};
    this.heightStName = {en:"高度:", fr:"Hauteur:"};
    this.depthStName = {en:"厚度:", fr:"Profondeur:"};
    this.uniformCbName = {en:"约束尺寸", fr:"Taille uniforme"};
    this.widthEtDflt = 100;
    this.heightEtDflt = 100;
    this.depthEtDflt = 100;
    this.texturesPnlName = {en:"纹理", fr:"Textures"};
    this.refreshBtnName = {en:"刷新", fr:"Actualiser"};
    this.listWidth = 100; // preferredSize.width of dropdownlists
    this.frontStName = {en:"前:", fr:"Avant:"};
    this.backStName = {en:"后:", fr:"Arrière:"};
    this.leftStName = {en:"左:", fr:"Gauche:"};
    this.rightStName = {en:"右:", fr:"Droite:"};
    this.bottomStName = {en:"底:", fr:"Bas:"};
    this.topStName = {en:"顶:", fr:"Haut:"};
    this.addControllerCbName = {en:"添加控制", fr:"Ajouter Contrôleur"};
    this.controllerLayerName = {en:"Controller", fr:"Contrôleur"};
    this.runBtnName = {en:"创建", fr:"Créer"};

    // Miscellaneous 
    this.nameSep = " * "; 
    this.layerNames = {en:["Front","Back","Left","Right","Bottom","Top"], fr:["Avant","Arrière","Gauche","Droite","Bas","Haut"]}; // "LayerName" ==> "Back * LayerName"

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
        "group { orientation:'column', alignment:['left','top'], alignChildren:'fill', \
            gr1: Group { \
                aboutBtn: Button { text:'" + this.aboutBtnName + "', preferredSize:[0,0], alignment:['right','center'] } \
            }, \
            gr2: Panel { orientation:'row', alignment:['fill','fill'], alignChildren:['center','center'], text:'" + utils.loc(this.dimensionsPnlName) + "', \
                widthSt: StaticText { text:'" + utils.loc(this.widthStName) + "' }, \
                widthEt: EditText { text:'" + this.widthEtDflt + "', characters:5 }, \
                heightSt: StaticText { text:'" + utils.loc(this.heightStName) + "', enabled:false }, \
                heightEt: EditText { text:'" + this.heightEtDflt + "', characters:5, enabled:false }, \
                depthSt: StaticText { text:'" + utils.loc(this.depthStName) + "', enabled:false }, \
                depthEt: EditText { text:'" + this.depthEtDflt + "', characters:5, enabled:false }, \
                uniformCb: Checkbox { text:'" + utils.loc(this.uniformCbName) + "', value:true } \
            }, \
            gr3: Panel { orientation:'row', alignment:['fill','center'], text:'" + utils.loc(this.texturesPnlName) + "', \
                gr31: Group { alignment:['center','top'], \
                    refreshBtn: Button { text:'" + utils.loc(this.refreshBtnName) + "' } \
                }, \
                gr32: Group { orientation:'row', \
                    gr321: Group { orientation:'column', alignChildren:['right','top'], \
                        gr3211: Group { orientation:'row', \
                            frontSt: StaticText { text:'" + utils.loc(this.frontStName) + "' }, \
                            frontLst: DropDownList { preferredSize:['" + this.listWidth + "',20] } \
                        }, \
                        gr3212: Group { orientation:'row', \
                            leftSt: StaticText { text:'" + utils.loc(this.leftStName) + "' }, \
                            leftLst: DropDownList { preferredSize:['" + this.listWidth + "',20] } \
                        }, \
                        gr3213: Group { orientation:'row', \
                            bottomSt: StaticText { text:'" + utils.loc(this.bottomStName) + "' }, \
                            bottomLst: DropDownList { preferredSize:['" + this.listWidth + "',20] } \
                        } \
                    }, \
                    gr322: Group { orientation:'column', alignChildren:['right','top'], \
                        gr3221: Group { orientation:'row', \
                            backSt: StaticText { text:'" + utils.loc(this.backStName) + "' }, \
                              backLst: DropDownList { preferredSize:['" + this.listWidth + "',20] } \
                        }, \
                        gr3222: Group { orientation:'row', \
                            rightSt: StaticText { text:'" + utils.loc(this.rightStName) + "' }, \
                            rightLst: DropDownList { preferredSize:['" + this.listWidth + "',20] } \
                        }, \
                        gr3223: Group { orientation:'row', \
                            topSt: StaticText { text:'" + utils.loc(this.topStName) + "' }, \
                            topLst: DropDownList { preferredSize:['" + this.listWidth + "',20] } \
                        } \
                    } \
                }, \
            }, \
            gr4: Group { orientation:'row', alignment:['fill','top'], \
                addControllerCb: Checkbox { text:'" + utils.loc(this.addControllerCbName) + "', alignment:['left','center'], value:true }, \
                runBtn: Button { text:'" + utils.loc(this.runBtnName) + "', alignment:['right','center'] } \
            } \
        }";
        pal.gr = pal.add(res);

        pal.gr.gr2.widthEt.graphics.foregroundColor = 
        pal.gr.gr2.heightEt.graphics.foregroundColor = 
        pal.gr.gr2.depthEt.graphics.foregroundColor =         
        pal.gr.gr3.gr32.gr321.gr3211.frontLst.graphics.foregroundColor = 
        pal.gr.gr3.gr32.gr321.gr3212.leftLst.graphics.foregroundColor = 
        pal.gr.gr3.gr32.gr321.gr3213.bottomLst.graphics.foregroundColor = 
        pal.gr.gr3.gr32.gr322.gr3221.backLst.graphics.foregroundColor = 
        pal.gr.gr3.gr32.gr322.gr3222.rightLst.graphics.foregroundColor = 
        pal.gr.gr3.gr32.gr322.gr3223.topLst.graphics.foregroundColor = pal.graphics.newPen(pal.graphics.BrushType.SOLID_COLOR, [0,0,0], 1);
       
        // event callbacks
        pal.gr.gr1.aboutBtn.onClick = function ()
        {
            utils.createAboutDlg(create3DBox.scriptAbout);
        };

        pal.gr.gr2.widthEt.onChange = pal.gr.gr2.widthEt.onChanging = function ()
        {
            if (isNaN(this.text) || parseFloat(this.text) < 1) this.text = create3DBox.widthEtDflt;
            this.text = parseFloat(this.text);

            if (pal.gr.gr2.uniformCb.value)
            {
                pal.gr.gr2.heightEt.text = pal.gr.gr2.depthEt.text = this.text;
            }
        };

        pal.gr.gr2.uniformCb.onClick = function ()
        {
            if (this.value)
            {
                pal.gr.gr2.heightEt.text = pal.gr.gr2.depthEt.text = pal.gr.gr2.widthEt.text;
            }
            pal.gr.gr2.heightSt.enabled = pal.gr.gr2.depthSt.enabled =
            pal.gr.gr2.heightEt.enabled = pal.gr.gr2.depthEt.enabled = !this.value;
        };

        pal.gr.gr3.gr31.refreshBtn.onClick = function ()
        {
            try
            {
                var comp = app.project.activeItem;
                var err = create3DBox.noCompErr;
                if (create3DBox.checkActiveItem(comp)) throw(err);

                var lists = [
                pal.gr.gr3.gr32.gr321.gr3211.frontLst,
                pal.gr.gr3.gr32.gr321.gr3212.leftLst,
                pal.gr.gr3.gr32.gr321.gr3213.bottomLst,
                pal.gr.gr3.gr32.gr322.gr3221.backLst,
                pal.gr.gr3.gr32.gr322.gr3222.rightLst,
                pal.gr.gr3.gr32.gr322.gr3223.topLst
                ];

                for (var i = 1; i <= comp.numLayers; i++)
                {
                    for (var j = 0; j < lists.length; j++)
                    {
                        if (i == 1) lists[j].removeAll();

                        lists[j].add("item", comp.layer(i).name);

                        if (i == 1) lists[j].selection = 0;
                    }
                }
            }
            catch(err)
            {
                utils.throwErr(err);
            }
        };

        pal.gr.gr4.runBtn.onClick = function ()
        {
            create3DBox.createBox(pal);
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
     Determines whether the active item is a composition
     @return True if the active item is not a composition, False otherwise
    */
    this.checkActiveItem = function ()
    {
        var err = false;
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem))
        {
            err = true;
        }
        return err;
    };

    /**
     Creates a 3D Null and make it parent of the layers passed as arguments
     @param {Array} layers An array of layers to be parented to the controller
    */
    this.addController = function (layers, p)//os)
    {
        var comp = layers[0].containingComp;
        var controllerLayer = comp.layers.addNull();
        controllerLayer.name = utils.loc(this.controllerLayerName);
        controllerLayer.threeDLayer = true;
        controllerLayer.enabled = false;

        var pos = [0,0,0];
        for (var i = 0; i < layers.length; i++) pos += layers[i].position.valueAtTime(comp.time, false);
        pos /= layers.length;

        var p = controllerLayer.position;
        p.numKeys ? p.setValueAtTime(comp.time, pos) : p.setValue(pos);

        for (var i = 0; i < layers.length; i++) layers[i].parent = controllerLayer;

        controllerLayer.position.setValue([comp.width/2,comp.height/2,0]);
    };

    /**
     Scales a layer so that its size (in pixels) matches the desired size
     @param {Object} layer A layer object to resize
     @param {Array} desiredSize A two-dimensional array representing the width and height of the desired size
     @param {Boolean} parFlag A flag that indicates whether the layer requires special care about comp pixel aspect ratio
    */
    this.resizeToFit = function (layer, desiredSize, parFlag)
    {
        var compPar = layer.containingComp.pixelAspect;
        var layerPar = layer.source ? layer.source.pixelAspect : 1.0;
        
        var layerSize = utils.getLayerSize(layer, layer.containingComp.time);
        
        var layerW = layerSize[0] * layerPar; // real width
        var layerH = layerSize[1];        

        var targetW = desiredSize[0] * Math.pow(layerPar, Number(parFlag)+1) / layerPar; // same as   parFlag ? desiredSize[0] * layerPar : desiredSize[0];
        if (layerPar != 1.0 && layerPar != compPar && parFlag) targetW *= compPar/layerPar;
        
        var targetH = desiredSize[1];

        var sx = 100 * targetW / layerW;
        var sy = 100 * targetH / layerH;

        var s = layer.scale;
        s.numKeys ? s.setValueAtTime(layer.containingComp.time, [sx,sy]) : s.setValue([sx,sy]);
    };

    /**
     Functional part of the script: creates a 3D box according to user settings
     @param {Object} pal A palette or a dockable panel containing all user parameters
    */
    this.createBox = function (pal)
    {
        try
        {
            var comp = app.project.activeItem;
            var err = this.noCompErr;
            if (this.checkActiveItem(comp)) throw(err);
            
            var err = this.noLayersErr;
            if (comp.layers.length < 1) throw(err);
            
            var err = this.noSelErr;
            try
            {
                var selfront = comp.layer(pal.gr.gr3.gr32.gr321.gr3211.frontLst.selection);//.index + 1);
                var selback = comp.layer(pal.gr.gr3.gr32.gr322.gr3221.backLst.selection);//.index + 1);
                var selleft = comp.layer(pal.gr.gr3.gr32.gr321.gr3212.leftLst.selection);//.index + 1);
                var selright = comp.layer(pal.gr.gr3.gr32.gr322.gr3222.rightLst.selection);//.index + 1);
                var selbottom = comp.layer(pal.gr.gr3.gr32.gr321.gr3213.bottomLst.selection);//.index + 1);
                var seltop = comp.layer(pal.gr.gr3.gr32.gr322.gr3223.topLst.selection);//.index + 1);
                if (!selfront || !selback || !selleft || !selright || !selbottom || !seltop) throw(err);
            }
            catch(e)
            {
                throw(err);
            }

            // initialization
            var front = selfront;
            var back = selback;
            var left = selleft;
            var right = selright;
            var bottom = selbottom;
            var top = seltop;

            // box settings
            var boxW = parseFloat(pal.gr.gr2.widthEt.text) / comp.pixelAspect;
            var boxH = parseFloat(pal.gr.gr2.heightEt.text);
            var boxD = parseFloat(pal.gr.gr2.depthEt.text);
            var halfW = 0.5 * boxW;
            var halfH = 0.5 * boxH;
            var halfD = 0.5 * boxD;
            var pos = [[halfW, halfH, 0], [halfW, halfH, boxD], [0, halfH, halfD], [boxW, halfH, halfD], [halfW, boxH, halfD], [halfW, 0, halfD]];
            var ori = [[0,0,0], [0,180,0], [0,90,0], [0,270,0], [90,0,0], [270,0,0]];
        
            app.beginUndoGroup(this.scriptTitle);

            // create duplicates if necessary
            if (selback == selfront) back = selback.duplicate();
            if (selleft == selfront || selleft == selback) left = selleft.duplicate();
            if (selright == selfront || selright == selback || selright == selleft) right = selright.duplicate();
            if (selbottom == selfront || selbottom == selback || selbottom == selleft || selbottom == selright) bottom = selbottom.duplicate();
            if (seltop == selfront || seltop == selback || seltop == selleft || seltop == selright || seltop == selbottom) top = seltop.duplicate();

            var layers = [front,back,left,right,bottom,top];

            // create the box
            var err = this.badLayersErr;
            try
            {
                for (var i = 0; i < layers.length; i++)
                {
                    layers[i].threeDLayer = true;
                    var layerPar = layers[i].source ? layers[i].source.pixelAspect : 1.0;
                    var layerSize = utils.getLayerSize(layers[i], comp.time);
                    var layerW = layerSize[0]; 
                    var layerH = layerSize[1];
                    var a = layers[i].anchorPoint;
                    var p = layers[i].position;
                    var r = layers[i].orientation;
                    
                    if (layers[i] instanceof TextLayer) // assume left justify, since cs3 does not support font stuff
                        a.numKeys ? a.setValueAtTime(comp.time, 0.5 * [layerW, -layerH, 0]) : a.setValue(0.5 * [layerW, -layerH, 0]);
                    else
                        a.numKeys ? a.setValueAtTime(comp.time, 0.5 * [layerW, layerH, 0]) : a.setValue(0.5 * [layerW, layerH, 0]);
                    
                    if (layerPar == 1.0)
                    {
                        var pp = [pos[i][0]/comp.pixelAspect, pos[i][1], pos[i][2]];
                        p.numKeys ? p.setValueAtTime(comp.time, pp) : p.setValue(pp);    
                    }
                    else
                        p.numKeys ? p.setValueAtTime(comp.time, pos[i]) : p.setValue(pos[i]);
                    r.numKeys ? r.setValueAtTime(comp.time, ori[i]) : r.setValue(ori[i]); 
                    
                    if (i == 0 || i == 1) this.resizeToFit(layers[i],[boxW,boxH], true); // front & back
                    if (i == 2 || i == 3) this.resizeToFit(layers[i],[boxD,boxH], false); // left & right
                    if (i == 4 || i == 5) this.resizeToFit(layers[i],[boxW,boxD], true); // bottom & top
                }
            }
            catch(e)
            {
                err.en = err.en.replace('%s',layers[i].name);
                err.fr = err.fr.replace('%s',layers[i].name);
                throw(err);
            }

            // add controller if requested
            if (pal.gr.gr4.addControllerCb.value)
            {
                this.addController(layers, [halfW, -halfH, halfD]);
            }

            // rename layers (maybe optional...)                    
            for (var i = 0; i < layers.length; i++)
            {
                layers[i].name = utils.loc(this.layerNames)[i] + this.nameSep + layers[i].name.substring(0,31 - this.nameSep.length - utils.loc(this.layerNames)[i].length);
            }

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
 This class provides some utility functions used by Create3DBox
 @class Some utility functions grouped in a class
*/
function Create3DBoxUtils()
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
     Get the size in pixels of an AV layer (comp layer, footage layer, solid layer, text layer) at specific time
     @param {Object} avLayer An AV layer object    
     @param {Number} time A floating-point value representing the time in seconds at which the layer size must be evaluated    
     @return A two-dimensional array containing the width and height of the layer
    */
    this.getLayerSize = function (avLayer, time)
    {
        var w, h;
        if (!(avLayer instanceof TextLayer))
        {
            w = avLayer.width;
            h = avLayer.height;
        }
        else
        {
            var bb = avLayer.sourceRectAtTime(time, true);
            w = bb.width;
            h = bb.height;
        }
        return [w,h];
    };
    
    
}


/**
 Creates an instance of the main class and run it
*/
new Create3DBox().run(this);
