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


function Create3DPyramid()
{
    // Variable used to keep track of 'this' reference
    var create3DPyramid = this;
    
    // Create an instance of the utils class to use its functions
    var utils = new Create3DPyramidUtils();

    // Script infos
    this.scriptMinSupportVersion = "8.0";
    this.scriptName = "创建3D金字塔.jsx";    
    this.scriptVersion = "1.0";
    this.scriptTitle = "创建3D金字塔";
    this.scriptCopyright = "Copyright (c) 2010 CaoRun.Net";
    this.scriptHomepage = "http://caorun.blogcn.com";
    this.scriptDescription = {en: "此脚本用来创建3D金字塔.\\r\\r\\r\\r\\r\\r", fr:"Ce script crée une pyramide 3D avec les calques choisis par l\\'utilisateur.\\r\\rAssignez un calque à chacune des faces de la pyramide et le script va les positionner, les faire pivoter, les redimensionner et les masquer pour construire une pyramide d\\'une taille donnée.\\r\\rNotez que le même calque peut servir pour plusieurs faces (le script fera des copies du calque). Ceci permet par exemple de créer une pyramide avec un seul calque dans la composition.\\r\\rPour un meilleur contrôle, l\\'option \"Ajouter Contrôleur\" parente chaque face à un Nul 3D positionné au centre de la pyramide. Il contient des Curseurs pour redimensionner dynamiquement la pyramide."};
    this.scriptAbout = {en:this.scriptName + ", v" + this.scriptVersion + "\\r\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription), fr:this.scriptName + ", v" + this.scriptVersion + "\\r\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription)};        

    // Errors
    this.requirementErr = {en:"这个脚本运行环境在cs3或更高.", fr:"Ce script nécessite After Effects CS3 ou supérieur."};
    this.noCompErr = {en:"这个脚本运行环境在cs3或更高.", fr:"Une composition doit être active."};
    this.noLayersErr = {en:"在合成中必须包含至少一个层.", fr:"La composition doit contenir au moins un calque."};
    this.noSelErr = {en:"您必须指定一个层给盒子纹理. 不要忘记刷新图层列表.如果你已经打开新的合成或新的层.", fr:"Vous devez assigner un calque à chacune des faces de la boîte. N'oubliez pas d'Actualiser la liste des calques si vous avez ouvert une nouvelle comp ou créé de nouveaux calques."};
    this.layersTypeErr = {en:"你可以使用文字图层或AV图层 (固态层, 素材, 合成) 但是不能两者.", fr:"Vous pouvez utiliser des calques texte ou des calques Audio Vidéo (solide, métrage, comp) mais pas les deux."};
    this.badLayersErr = {en:"层 \"%s\" 不能使用一个固态层创建金字塔.", fr:"Le calque \"%s\" ne peut pas être utilisé pour créer la pyramide."};

    // UI strings & default settings
    this.aboutBtnName = "?";
    this.dimensionsPnlName = {en:"尺寸", fr:"Dimensions"};
    this.widthStName = {en:"宽度:", fr:"Largeur:"};
    this.heightStName = {en:"高度:", fr:"Hauteur:"};
    this.depthStName = {en:"厚度:", fr:"Profondeur:"};
    this.uniformCbName = {en:"约束尺寸", fr:"Taille uniforme"};
    this.widthEtDflt = 1000;
    this.heightEtDflt = 1000;
    this.depthEtDflt = 1000;
    this.texturesPnlName = {en:"纹理", fr:"Textures"};
    this.refreshBtnName = {en:"刷新", fr:"Actualiser"};
    this.listWidth = 100; // preferredSize.width of dropdownlists
    this.frontStName = {en:"前:", fr:"Avant:"};
    this.backStName = {en:"后:", fr:"Arrière:"};
    this.leftStName = {en:"左:", fr:"Gauche:"};
    this.rightStName = {en:"右:", fr:"Droite:"};
    this.bottomStName = {en:"底:", fr:"Bas:"};
    this.addControllerCbName = {en:"添加控制", fr:"Ajouter Contrôleur"};
    this.controllerLayerName = {en:"控制", fr:"Contrôleur"};
    this.runBtnName = {en:"创建", fr:"Créer"};
    
    // Effect and expressions
    this.pyrWEffectName = {en:"Pyr. Width", fr:"Largeur Pyr."};
    this.pyrHEffectName = {en:"Pyr. Height", fr:"Hauteur Pyr."};
    this.pyrDEffectName = {en:"Pyr. Depth", fr:"Profondeur Pyr."};
    this.fPositionExpression = 
    "compPar = thisComp.pixelAspect;\r" +
    "L = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\");\r" +
    "pyrH = L.effect(\"" + utils.loc(this.pyrHEffectName) + "\")(1);\r" +
    "pyrD = L.effect(\"" + utils.loc(this.pyrDEffectName) + "\")(1);\r" +
    "[0, pyrH/3, -(pyrD/2)*compPar];";
    this.bPositionExpression = 
    "compPar = thisComp.pixelAspect;\r" +
    "L = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\");\r" +
    "pyrH = L.effect(\"" + utils.loc(this.pyrHEffectName) + "\")(1);\r" +
    "pyrD = L.effect(\"" + utils.loc(this.pyrDEffectName) + "\")(1);\r" +
    "[0, pyrH/3, (pyrD/2)*compPar];";
    this.lPositionExpression =
    "L = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\");\r" +
    "pyrW = L.effect(\"" + utils.loc(this.pyrWEffectName) + "\")(1);\r" +
    "pyrH = L.effect(\"" + utils.loc(this.pyrHEffectName) + "\")(1);\r" +
    "[-pyrW/2, pyrH/3, 0];";    
    this.bsPositionExpression = 
    "L = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\");\r" +
    "pyrH = L.effect(\"" + utils.loc(this.pyrHEffectName) + "\")(1);\r" +
    "[0, pyrH/3, 0];";
    this.rPositionExpression =
    "L = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\");\r" +
    "pyrW = L.effect(\"" + utils.loc(this.pyrWEffectName) + "\")(1);\r" +
    "pyrH = L.effect(\"" + utils.loc(this.pyrHEffectName) + "\")(1);\r" +
    "[pyrW/2, pyrH/3, 0];";    
    this.fbScaleExpression = 
    "compPar = thisComp.pixelAspect;\r" +
    "try { layerPar = source.pixelAspect; } catch(e) { layerPar = 1.0; }\r" +
    "layerW = width*layerPar;\r" +
    "L = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\");\r" +
    "pyrW = L.effect(\"" + utils.loc(this.pyrWEffectName) + "\")(1)*compPar;\r" +
    "pyrH = L.effect(\"" + utils.loc(this.pyrHEffectName) + "\")(1);\r" +
    "pyrD = L.effect(\"" + utils.loc(this.pyrDEffectName) + "\")(1)*compPar;\r" +
    "hypo = Math.sqrt(Math.pow(pyrH,2) + Math.pow(pyrD/2,2));\r" +
    "sx = 100*pyrW/layerW;\r" +
    "sy = 100*hypo/height;\r" +
    "[sx,sy,100];";
    this.lrScaleExpression = 
    "compPar = thisComp.pixelAspect;\r" +
    "try { layerPar = source.pixelAspect; } catch(e) { layerPar = 1.0; }\r" +
    "layerW = width*layerPar;\r" +
    "L = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\");\r" +
    "pyrW = L.effect(\"" + utils.loc(this.pyrWEffectName) + "\")(1)*compPar;\r" +
    "pyrH = L.effect(\"" + utils.loc(this.pyrHEffectName) + "\")(1);\r" +
    "pyrD = L.effect(\"" + utils.loc(this.pyrDEffectName) + "\")(1)*compPar;\r" +
    "hypo = Math.sqrt(Math.pow(pyrH,2) + Math.pow(pyrW/2,2));\r" +
    "sx = 100*pyrD/layerW;\r" +
    "sy = 100*hypo/height;\r" +
    "[sx,sy,100];";
    this.bsScaleExpression = 
    "compPar = thisComp.pixelAspect;\r" +
    "try { layerPar = source.pixelAspect; } catch(e) { layerPar = 1.0; }\r" +
    "layerW = width*layerPar;\r" +
    "L = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\");\r" +
    "pyrW = L.effect(\"" + utils.loc(this.pyrWEffectName) + "\")(1)*compPar;\r" +
    "pyrD = L.effect(\"" + utils.loc(this.pyrDEffectName) + "\")(1)*compPar;\r" +
    "sx = 100*pyrW/layerW;\r" +
    "sy = 100*pyrD/height;\r" +
    "[sx,sy,100];";
    this.lOrientationExpression = 
    "compPar = thisComp.pixelAspect;\r" +
    "L = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\");\r" +
    "pyrW = L.effect(\"" + utils.loc(this.pyrWEffectName) + "\")(1);\r" +
    "pyrH = L.effect(\"" + utils.loc(this.pyrHEffectName) + "\")(1);\r" +
    "a = Math.atan2(pyrW/2, pyrH/compPar);\r" +
    "[0,0,radiansToDegrees(a)];";    
    this.rOrientationExpression = 
    "compPar = thisComp.pixelAspect;\r" +
    "L = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\");\r" +
    "pyrW = L.effect(\"" + utils.loc(this.pyrWEffectName) + "\")(1);\r" +
    "pyrH = L.effect(\"" + utils.loc(this.pyrHEffectName) + "\")(1);\r" +
    "a = Math.atan2(pyrW/2, pyrH/compPar);\r" +
    "[0,0,-radiansToDegrees(a)];";
    this.fXRotationExpression =
    "compPar = thisComp.pixelAspect;\r" +
    "L = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\");\r" +
    "pyrH = L.effect(\"" + utils.loc(this.pyrHEffectName) + "\")(1);\r" +
    "pyrD = L.effect(\"" + utils.loc(this.pyrDEffectName) + "\")(1);\r" +
    "a = Math.atan2(pyrD/2, pyrH/compPar);\r" +
    "-radiansToDegrees(a);";    
    this.bXRotationExpression =
    "compPar = thisComp.pixelAspect;\r" +
    "L = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\");\r" +
    "pyrH = L.effect(\"" + utils.loc(this.pyrHEffectName) + "\")(1);\r" +
    "pyrD = L.effect(\"" + utils.loc(this.pyrDEffectName) + "\")(1);\r" +
    "a = Math.atan2(pyrD/2, pyrH/compPar);\r" +
    "radiansToDegrees(a);";    

    // Miscellaneous 
    this.nameSep = " * "; 
    this.layerNames = {en:["Front","Back","Left","Right","Basis"], fr:["Avant","Arrière","Gauche","Droite","Base"]}; // "LayerName" ==> "Back * LayerName"

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
                            fooSt: StaticText { text:'" + utils.loc(this.rightStName) + "', visible:false }, \
                            fooLst: DropDownList { preferredSize:['" + this.listWidth + "',20], visible:false } \
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
        pal.gr.gr3.gr32.gr322.gr3222.rightLst.graphics.foregroundColor = pal.graphics.newPen(pal.graphics.BrushType.SOLID_COLOR, [0,0,0], 1);

        // event callbacks
        pal.gr.gr1.aboutBtn.onClick = function ()
        {
            utils.createAboutDlg(create3DPyramid.scriptAbout);
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
                var err = this.noCompErr;
                if (create3DPyramid.checkActiveItem(comp)) throw(err);

                var lists = [
                pal.gr.gr3.gr32.gr321.gr3211.frontLst,
                pal.gr.gr3.gr32.gr321.gr3212.leftLst,
                pal.gr.gr3.gr32.gr321.gr3213.bottomLst,
                pal.gr.gr3.gr32.gr322.gr3221.backLst,
                pal.gr.gr3.gr32.gr322.gr3222.rightLst
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
            create3DPyramid.createPyramid(pal);
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
        err = true;
        return err;
    };
    
    /**
     Determines whether layers are all text layers or all av layers (solid, footage, comp layer)
     @return True if the layers are all av layers or all text layers
    */
    this.checkLayersType = function (layers)
    {
        var err = false;
        for (var i = 1; !err && i < layers.length; i++) 
        if ((layers[0] instanceof TextLayer && !(layers[i] instanceof TextLayer)) || (!(layers[0] instanceof TextLayer) && layers[i] instanceof TextLayer)    )
        err = true;
        return err;
    };    
    
    /**
     Creates a triangular mask on a layer
     @param {Object} layer A layer object 
    */
    this.addTriangularMask = function (layer, layerSize)
    {
        var mask = layer.Masks.addProperty("ADBE Mask Atom");
        var shape = new Shape();        
        
        var a, b, c;
        
        if (layer instanceof TextLayer) // assume 'center text' option in paragraph panel
        {
            a = [-layerSize[0]/2, 0];
            b = [0, -layerSize[1]];
            c = [layerSize[0]/2, 0];
        }
        else
        {
            a = [0, layerSize[1]];
            b = [layerSize[0]/2, 0];
            c = [layerSize[0], layerSize[1]];            
        }
        shape.vertices = [a, b, c];
        mask.maskShape.setValue(shape);
    };

    /**
     Creates a 3D Null and make it parent of the layers passed as argument
     @param {Array} layers An array of layers to be parented to the controller
     @param {Number} pyrH Height of the pyramid
    */
    this.addSimpleController = function (layers, pyrH)
    {
        var comp = layers[0].containingComp;
        var controllerLayer = comp.layers.addNull();
        controllerLayer.name = utils.loc(this.controllerLayerName);
        controllerLayer.threeDLayer = true;
        controllerLayer.enabled = false;
        
        // position the controller at the center of mass
        var pos = [comp.width/2, comp.height/2 + pyrH/6, 0];
        var p = controllerLayer.position;
        p.numKeys ? p.setValueAtTime(comp.time, pos) : p.setValue(pos);
        
        // parent layers and reposition controller at the center of the comp
        for (var i = 0; i < layers.length; i++) layers[i].parent = controllerLayer;
        
        //p.setValue([comp.width/2, comp.height/2, 0]);
        
        //controllerLayer.selected = true;
    };
    
    /**
     Creates a 3D Null with sliders controls, make it parent of the layers and link with expressions
     @param {Array} layers An array of layers to be parented to the controller
     @param {Number} pyrW Width of the pyramid
     @param {Number} pyrH Height of the pyramid
     @param {Number} pyrD Depth of the pyramid
    */
    this.addController = function (layers, pyrW, pyrH, pyrD)
    {
        var comp = layers[0].containingComp;
        var controllerLayer = comp.layers.addNull();
        controllerLayer.name = utils.loc(this.controllerLayerName);
        controllerLayer.threeDLayer = true;
        controllerLayer.enabled = false;
        
        // add slider controls
        var pyrWEffect = controllerLayer.Effects.addProperty("ADBE Slider Control");
        pyrWEffect.name = utils.loc(this.pyrWEffectName);
        pyrWEffect.property(1).setValue(pyrW); 
        
        var pyrHEffect = controllerLayer.Effects.addProperty("ADBE Slider Control");
        pyrHEffect.name = utils.loc(this.pyrHEffectName);
        pyrHEffect.property(1).setValue(pyrH); 
        
        var pyrDEffect = controllerLayer.Effects.addProperty("ADBE Slider Control");
        pyrDEffect.name = utils.loc(this.pyrDEffectName);
        pyrDEffect.property(1).setValue(pyrD); 
        
        // position the controller at the center of mass
        var pos = [comp.width/2, comp.height - pyrH/3, 0];
        var p = controllerLayer.position;
        p.numKeys ? p.setValueAtTime(comp.time, pos) : p.setValue(pos);
        
        // parent layers and reposition controller at the center of the comp
        for (var i = 0; i < layers.length; i++) layers[i].parent = controllerLayer;
        
        // link layers to controller with expressions
        for (var i = 0; i < layers.length; i++)
        {
            var layerPar = layers[i].source ? layers[i].source.pixelAspect : 1.0;
            var layerSize = utils.getLayerSize(layers[i], comp.time);
            var layerW = layerSize[0]; 
            var layerH = layerSize[1];
            var p = layers[i].position;
            var s = layers[i].scale;
            var r = layers[i].orientation;
            var rx = layers[i].rotationX;
                    
            // position expression
            if (i == 0) p.expression = this.fPositionExpression; // front
            else if (i == 1) p.expression = this.bPositionExpression; // back
            else if (i == 2) p.expression = this.lPositionExpression; // left  
            else if (i == 3) p.expression = this.rPositionExpression; // right
            else p.expression = this.bsPositionExpression; // basis  
            
            // scale expression
            if (i == 0 || i == 1) s.expression = this.fbScaleExpression; // front/back
            else if (i == 2 || i == 3) s.expression = this.lrScaleExpression; // left/right
            else s.expression = this.bsScaleExpression; // basis
                    
            // orientation
            if (i == 2) r.expression = this.lOrientationExpression; // left
            else if (i == 3) r.expression = this.rOrientationExpression; // right
            
            // x rotation
            if (i == 0) rx.expression = this.fXRotationExpression; // front
            else if (i == 1) rx.expression = this.bXRotationExpression; // back
        }
        
        //p.setValue([comp.width/2, comp.height/2, 0]);
        
        //controllerLayer.selected = true;
    };

    /**
     Functional part of the script: creates a 3D pyramid according to user settings
     @param {Object} pal A palette or a dockable panel containing all user parameters
    */
    this.createPyramid = function (pal)
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
                if (!selfront || !selback || !selleft || !selright || !selbottom) throw(err);
            }
            catch(e)
            {
                throw(err);
            }
            
            var compW = comp.width;
            var compH = comp.height;
            var compPar = comp.pixelAspect;
            
            // initialization
            var front = selfront;
            var back = selback;
            var left = selleft;
            var right = selright;
            var bottom = selbottom;

            // check types
            var err = this.layersTypeErr;
            if (this.checkLayersType([front, back, left, right, bottom])) throw(err);

            // pyramid settings
            var pyrW = parseFloat(pal.gr.gr2.widthEt.text);
            var pyrH = parseFloat(pal.gr.gr2.heightEt.text);
            var pyrD = parseFloat(pal.gr.gr2.depthEt.text);
            
            app.beginUndoGroup(this.scriptTitle);

            // create duplicates if necessary
            if (selback == selfront) back = selback.duplicate();
            if (selleft == selfront || selleft == selback) left = selleft.duplicate();
            if (selright == selfront || selright == selback || selright == selleft) right = selright.duplicate();
            if (selbottom == selfront || selbottom == selback || selbottom == selleft || selbottom == selright) bottom = selbottom.duplicate();
            
            front.moveBefore(back);
            
            var layers = [front, back, left, right, bottom];
            
            // create the pyramid
            var err = this.badLayersErr;
            try
            {
                for (var i = 0; i < layers.length; i++)
                {
                    // 3D, deselect
                    layers[i].threeDLayer = true;
                    layers[i].selected = false;
                    var layerPar = layers[i].source ? layers[i].source.pixelAspect : 1.0;
                    var layerSize = utils.getLayerSize(layers[i], comp.time);
                    var layerW = layerSize[0]; 
                    var layerH = layerSize[1];
                    var a = layers[i].anchorPoint;
                    var p = layers[i].position;
                    var s = layers[i].scale;
                    var r = layers[i].orientation;
                    var rx = layers[i].rotationX;
                    var ry = layers[i].rotationY;
                    
                    // anchor point
                    if (layers[i] instanceof TextLayer) a.numKeys ? a.setValueAtTime(comp.time, [0, -layerH/2, 0]) : a.setValue([0, -layerH/2, 0]); // assume 'center text' option in paragraph panel
                    else
                    {
                        if (i != 4)    a.numKeys ? a.setValueAtTime(comp.time, [layerW/2, layerH, 0]) : a.setValue([layerW/2, layerH, 0]);
                        else a.numKeys ? a.setValueAtTime(comp.time, [layerW/2, layerH/2, 0]) : a.setValue([layerW/2, layerH/2, 0]);
                    }
                        
                    // position
                    if (i == 0 || i == 1) p.numKeys ? p.setValueAtTime(comp.time, [compW/2, compH, (-1+2*i) * (pyrD/2) * compPar]) : p.setValue([compW/2, compH, (-1+2*i) * (pyrD/2) * compPar]); // front/back -+ z
                    else if (i == 2 || i == 3) p.numKeys ? p.setValueAtTime(comp.time, [compW/2 + (2*i-5) * (pyrW/2), compH, 0]) : p.setValue([compW/2 + (2*i-5) * (pyrW/2), compH, 0]); // left/right -+ x  
                    else p.numKeys ? p.setValueAtTime(comp.time, [compW/2, compH, 0]) : p.setValue([compW/2, compH, 0]); // basis
                    
                    if (layers[i] instanceof TextLayer && i != 4)
                    {
                        if (i == 0 || i == 1)  p.numKeys ? p.setValueAtTime(comp.time, [compW/2, compH/2, p.valueAtTime(comp.time)[2]] / 2) : p.setValue([compW/2, compH/2, p.value[2] / 2]); 
                        else if (i == 2 || i == 3) p.numKeys ? p.setValueAtTime(comp.time, [compW/2 + (2*i-5) * (pyrW/4), compH/2, p.valueAtTime(comp.time)[2]]) : p.setValue([compW/2 + (2*i-5) * (pyrW/4), compH/2, p.value[2]]); 
                    }
                    else if (layers[i] instanceof TextLayer && i == 4) p.numKeys ? p.setValueAtTime(comp.time, [compW/2, compH/2 + pyrH/2, p.valueAtTime(comp.time)[2]]) : p.setValue([compW/2, compH/2 + pyrH/2, p.value[2]]); 
                        
                    // scale                    
                    var layerWP = layerW * layerPar;
                    var pyrWP = pyrW * compPar;
                    var pyrDP = pyrD * compPar;
                    var sx, sy;
                    if (i != 4)
                    {
                        var hypo;
                        if (i == 0 || i == 1) { hypo = Math.sqrt(Math.pow(pyrH,2) + Math.pow(pyrDP/2,2)); sx = 100*pyrWP/layerWP; } // front/back
                        else { hypo = Math.sqrt(Math.pow(pyrH,2) + Math.pow(pyrWP/2,2)); sx = 100*pyrDP/layerWP; } // left/right
                        sy = 100*hypo/layerH;
                        this.addTriangularMask(layers[i], layerSize, compPar); // add mask while we are here                        
                    }
                    else
                    {
                        sx = 100*pyrWP/layerWP;
                        sy = 100*pyrDP/layerH;
                    }
                    s.numKeys ? s.setValueAtTime(comp.time, [sx,sy,100]) : s.setValue([sx,sy,100]);
                    
                    // orientation
                    if (i == 2 || i == 3) 
                    { 
                        var alpha = Math.atan2(pyrW/2 , pyrH/compPar);
                        r.numKeys ? r.setValueAtTime(comp.time, [0, 0, (5-2*i) * utils.radiansToDegrees(alpha)]) : r.setValue([0, 0, (5-2*i) * utils.radiansToDegrees(alpha)]); // left/right
                    }
                    
                    // x rotation
                    if (i == 0 || i == 1)
                    {
                        var alpha = Math.atan2(pyrD/2 , pyrH/compPar);
                        rx.numKeys ? rx.setValueAtTime(comp.time, (2*i-1) * utils.radiansToDegrees(alpha)) : rx.setValue((2*i-1) * utils.radiansToDegrees(alpha)); // front/back
                    }
                    else if (i == 4) rx.numKeys ? rx.setValueAtTime(comp.time, 90) : rx.setValue(90); // basis
                                        
                    // y rotation
                    if (i == 1) ry.numKeys ? ry.setValueAtTime(comp.time, -180) : ry.setValue(-180); // back 
                    if (i == 2 || i == 3) ry.numKeys ? ry.setValueAtTime(comp.time, (5-2*i) * 90) : ry.setValue((5-2*i) * 90); // left/right +-90                                        
                }
            }
            catch(err)
            {
                err.en = err.en.replace('%s',layers[i].name);
                err.fr = err.fr.replace('%s',layers[i].name);
                throw(err);
            }

            // add controller if requested
            if (pal.gr.gr4.addControllerCb.value)
            {
                if (layers[0] instanceof TextLayer) this.addSimpleController(layers, pyrH);
                else this.addController(layers, pyrW, pyrH, pyrD);
            }

            // rename layers                    
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
 This class provides some utility functions used by Create3DPyramid
 @class Some utility functions grouped in a class
*/
function Create3DPyramidUtils()
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

    /**
     Converts radians to degrees
     @param {Number} rad An angle in radians
     @return The same angle in degrees
    */
    this.radiansToDegrees = function (rad)
    {
        return rad * 180 / Math.PI;
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
new Create3DPyramid().run(this);
