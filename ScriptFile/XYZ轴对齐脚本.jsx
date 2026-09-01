/* 

名称: XYZ对齐脚本
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
function AlignLayers()
{
    // Variable used to keep track of 'this' reference
    var alignLayers = this;
    
    // Create an instance of the utils class to use its functions
    var utils = new AlignLayersUtils();    
    
    // Script infos
    this.scriptMinSupportVersion = "8.0";
    this.scriptName = "XYZ对齐脚本.jsx";    
    this.scriptVersion = "2.0";
    this.scriptTitle = "XYZ对齐脚本";
    this.scriptCopyright = "Copyright (c) 2009 Charles Bordenave";
    this.scriptHomepage = "出自http://www.nabscripts.com";
    this.scriptDescription = {en: "该脚本使选定的图层沿x，y，z轴对齐，并且还可以在相邻图层之间添加恒定的偏移量。\\r\\r在这里，术语“对齐”必须解释为“彼此相邻放置”。\\'.", fr:"Ce script aligne les calques sélectionnés et ajoute possiblement un espace constant entre chaque calque.\\r\\rIci le terme \\'aligne\\' doit être interprété comme \\'place l\\'un à côté de l\\'autre\\'."};
    this.scriptAbout = {en:this.scriptName + ", v" + this.scriptVersion + "\\r\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription), fr:this.scriptName + ", v" + this.scriptVersion + "\\r\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription)};        

    // Errors
    this.requirementErr = {en:"This script requires After Effects CS3 or later.", fr:"Ce script nécessite After Effects CS3 ou supérieur."};    
    this.noCompErr = {en:"至少选两个图层，要不然我让谁和谁对齐？", fr:"Sélectionnez au moins deux calques."};
    this.noLayersErr = {en:"至少选两个图层，要不然让谁和谁对齐？", fr:"Sélectionnez au moins deux calques."};
    this.badSelLayersErr = {en:"选定的图层必须是图像频层或文字层。", fr:"Les calques séléctionnées doivent être des calques AudioVidéo ou des calques Texte."};
    
    // UI strings and default settings
    this.aboutBtnName = "视效网";
    this.xAlignCbName = {en:"X轴对齐:", fr:"Alignement X:"};
    this.yAlignCbName = {en:"Y轴对齐:", fr:"Alignement Y:"};
    this.zAlignCbName = {en:"Z轴对齐:", fr:"Alignement Z:"};
    this.xAlignDflt = 0;
    this.yAlignDflt = 0;
    this.zAlignDflt = 0;

    // Internal data
    this.m_xAlign = false;
    this.m_yAlign = false;
    this.m_zAlign = false;
    this.m_xAlignVal = this.xAlignDflt;
    this.m_yAlignVal = this.yAlignDflt;
    this.m_zAlignVal = this.zAlignDflt;

    /**
     Creates and displays the script interface
     @param {Object} thisObj A Panel object if the script is launched from the Window menu, null otherwise    
    */
    this.buildUI = function (thisObj)
    {
        // dockable panel or palette
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", this.scriptTitle, undefined, {resizeable:true});
        
        // resource specifications
        var res =
        "group { orientation:'column', alignment:['fill','fill'], alignChildren:['right','top'], \
            gr1: Group { \
                aboutBtn: Button { text:'" + this.aboutBtnName + "', preferredSize:[50,20] } \
            }, \
            gr2: Group { orientation:'row', alignment:['fill','top'], \
                xAlignCb: Checkbox { text:'" + utils.loc(this.xAlignCbName) + "' }, \
                xAlignScl: Scrollbar { minvalue:-100, enabled:false, preferredSize:[150,20], alignment:['fill','center'] }, \
                xAlignEt: EditText { text:'" + this.xAlignDflt + "', characters:5, enabled:false, alignment:['right','center'] } \
            }, \
            gr3: Group { orientation:'row', alignment:['fill','top'], \
                yAlignCb: Checkbox { text:'" + utils.loc(this.yAlignCbName) + "' }, \
                yAlignScl: Scrollbar { minvalue:-100, enabled:false, preferredSize:[150,20], alignment:['fill','center'] }, \
                yAlignEt: EditText { text:'" + this.yAlignDflt + "', characters:5, enabled:false, alignment:['right','center'] } \
            }, \
              gr4: Group { orientation:'row', alignment:['fill','top'], \
                zAlignCb: Checkbox { text:'" + utils.loc(this.zAlignCbName) + "' }, \
                zAlignScl: Scrollbar { minvalue:-100, enabled:false, preferredSize:[150,20], alignment:['fill','center'] }, \
                zAlignEt: EditText { text:'" + this.zAlignDflt + "', characters:5, enabled:false, alignment:['right','center'] } \
            } \
        }"; 
        pal.gr = pal.add(res);
        
        pal.gr.gr2.xAlignEt.graphics.foregroundColor =
        pal.gr.gr3.yAlignEt.graphics.foregroundColor =
        pal.gr.gr4.zAlignEt.graphics.foregroundColor = pal.graphics.newPen(pal.graphics.BrushType.SOLID_COLOR, [0,0,0], 1);
        
        // event callbacks
        pal.onResizing = pal.onResize = function () 
        {
            this.layout.resize();
        };
                
        pal.gr.gr1.aboutBtn.onClick = function () 
        { 
            utils.createAboutDlg(alignLayers.scriptAbout); 
        };
        
        pal.gr.gr2.xAlignCb.onClick = function () 
        {
            if (this.value)
            {
                var err = alignLayers.positionSelectedLayers();
                if (err)
                {
                    utils.throwErr(err);
                    this.value = false;
                    this.parent.xAlignScl.enabled = false;
                    this.parent.xAlignEt.enabled = false;
                }
            }
            this.parent.xAlignScl.enabled = this.value;
            this.parent.xAlignEt.enabled = this.value; 
            alignLayers.m_xAlign = this.value;
        };
        
        pal.gr.gr2.xAlignScl.onChange = pal.gr.gr2.xAlignScl.onChanging = function () 
        {
            this.value = Math.round(this.value);
            
            alignLayers.m_xAlignVal = this.value;
            this.parent.xAlignEt.text = this.value;            
            
            var err = alignLayers.positionSelectedLayers();
            if (err)
            {
                utils.throwErr(err);
                this.parent.xAlignScl.enabled = false;
                this.parent.xAlignEt.enabled = false;
            }      
        };

        pal.gr.gr2.xAlignEt.onChange = function () 
        {
            if (isNaN(this.text))
            {
                this.text = alignLayers.xAlignDflt;
            }
            alignLayers.m_xAlignVal = Math.round(this.text);
            this.parent.xAlignScl.value = Math.round(this.text);
             
            var err = alignLayers.positionSelectedLayers();
            if (err)
            {
                utils.throwErr(err);
                this.parent.xAlignScl.enabled = false;
                this.parent.xAlignEt.enabled = false;
            }      
        };

        pal.gr.gr3.yAlignCb.onClick = function () 
        {
            if (this.value)
            {
                var err = alignLayers.positionSelectedLayers();
                if (err)
                {
                    utils.throwErr(err);
                    this.value = false;
                    this.parent.yAlignScl.enabled = false;
                    this.parent.yAlignEt.enabled = false;
                }
            }
            this.parent.yAlignScl.enabled = this.value;
            this.parent.yAlignEt.enabled = this.value; 
            alignLayers.m_yAlign = this.value;      
        };
        
        pal.gr.gr3.yAlignScl.onChange = pal.gr.gr3.yAlignScl.onChanging = function () 
        {
            this.value = Math.round(this.value);
            
            alignLayers.m_yAlignVal = this.value;
            this.parent.yAlignEt.text = this.value;            

            var err = alignLayers.positionSelectedLayers();
            if (err)
            {
                utils.throwErr(err);
                this.parent.yAlignScl.enabled = false;
                this.parent.yAlignEt.enabled = false;
            }
        };

        pal.gr.gr3.yAlignEt.onChange = function () 
        {
            if (isNaN(this.text))
            {
                this.text = alignLayers.yAlignDflt;
            }
            alignLayers.m_yAlignVal = Math.round(this.text);
            this.parent.yAlignScl.value = Math.round(this.text);
               
            var err = alignLayers.positionSelectedLayers();
            if (err)
            {
                utils.throwErr(err);
                this.parent.yAlignScl.enabled = false;
                this.parent.yAlignEt.enabled = false;
            }
        };
        
        pal.gr.gr4.zAlignCb.onClick = function () 
        {
            if (this.value)
            {
                var err = alignLayers.positionSelectedLayers();
                if (err)
                {
                    utils.throwErr(err);
                    this.value = false;
                    this.parent.zAlignScl.enabled = false;
                    this.parent.zAlignEt.enabled = false;
                }
            }
            this.parent.zAlignScl.enabled = this.value;
            this.parent.zAlignEt.enabled = this.value; 
            alignLayers.m_zAlign = this.value;      
        };
        
        pal.gr.gr4.zAlignScl.onChange = pal.gr.gr4.zAlignScl.onChanging = function () 
        {
            this.value = Math.round(this.value);
            
            alignLayers.m_zAlignVal = this.value;
            this.parent.zAlignEt.text = this.value;            

            var err = alignLayers.positionSelectedLayers();
            if (err)
            {
                utils.throwErr(err);
                this.parent.zAlignScl.enabled = false;
                this.parent.zAlignEt.enabled = false;
            }
        };

        pal.gr.gr4.zAlignEt.onChange = function () 
        {
            if (isNaN(this.text))
            {
                this.text = alignLayers.zAlignDflt;
            }
            alignLayers.m_zAlignVal = Math.round(this.text);
            this.parent.zAlignScl.value = Math.round(this.text);

            var err = alignLayers.positionSelectedLayers();
            if (err)
            {
                utils.throwErr(err);
                this.parent.zAlignScl.enabled = false;
                this.parent.zAlignEt.enabled = false;
            }            
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
     Determines whether the layers are of correct type (footage, comp, solid or text layer)  
     @param {Array} layers An array of layers
     @return True if at least one layer has not the correct type, False otherwise    
    */    
    this.checkSelectedLayers = function (layers)
    {
        var err = false;        
        for (var i = 0; !err && i < layers.length; i++)
        {
            if (!(layers[i] instanceof AVLayer) && !(layers[i] instanceof TextLayer)) // reject camera/light layers
            {
                err = true;
            }
        }        
        return err;        
    };

    /**
     Functional part of the script: aligns selected layers along the x, y or z axis, and eventually adds a constant offset between each adjacent layer
    */    
    this.positionSelectedLayers = function ()
    {
        var comp = app.project.activeItem;
        var err = this.noCompErr;
        if (this.checkActiveItem(comp)) return err;

        var layers = comp.selectedLayers;
        var err = this.noLayersErr;
        if (layers.length < 2) return err;

        var err = this.badSelLayersErr;
        if (this.checkSelectedLayers(layers)) return err;

        var firstLayerPos = layers[0].position.valueAtTime(comp.time, true);
        var curPos = firstLayerPos;

        app.beginUndoGroup(this.scriptTitle);

        try
        {
            for (var i = 1; i < layers.length; i++) // skip the first selected layer
            {                
                var prevLayer = layers[i-1];
                var layer = layers[i];

                var xDir = this.m_xAlignVal < 0 ? -1 : 1;
                var yDir = this.m_yAlignVal < 0 ? -1 : 1; 

                var prevSx = prevLayer.scale.valueAtTime(comp.time, true)[0] / 100;
                var prevSy = prevLayer.scale.valueAtTime(comp.time, true)[1] / 100;

                var sx = layer.scale.valueAtTime(comp.time, true)[0] / 100;
                var sy = layer.scale.valueAtTime(comp.time, true)[1] / 100;

                var prevLayerSize = utils.getLayerSize(prevLayer, comp.time);
                var prevW = prevSx * prevLayerSize[0];
                var prevH = prevSy * prevLayerSize[1];

                var layerSize = utils.getLayerSize(layer, comp.time);
                var w = sx * layerSize[0];
                var h = sy * layerSize[1];

                var x = 0.5 * xDir * (prevW + w) + this.m_xAlignVal;
                var y = 0.5 * yDir * (prevH + h) + this.m_yAlignVal;
                var z = this.m_zAlignVal;

                if (layer.position.numKeys) // set new position keyframe at current comp time
                {
                    if (this.m_xAlign)
                    {
                        layer.position.setValueAtTime(comp.time, curPos + [x,0,0]);
                        curPos += [x,0,0];
                    }
                    if (this.m_yAlign)
                    {
                        layer.position.setValueAtTime(comp.time, curPos + [0,y,0]);
                        curPos += [0,y,0];
                    }
                    if (this.m_zAlign)
                    {
                        layer.threeDLayer = true;
                        layer.position.setValueAtTime(comp.time, curPos + [0,0,z]);
                        curPos += [0,0,z];
                    }               
                }
                else // set new position value
                {
                    if (this.m_xAlign)
                    {
                        layer.position.setValue(curPos + [x,0,0]);
                        curPos += [x,0,0];
                    }
                    if (this.m_yAlign)
                    {
                        layer.position.setValue(curPos + [0,y,0]);
                        curPos += [0,y,0];
                    }    
                    if (this.m_zAlign)
                    {
                        layer.threeDLayer = true;
                        layer.position.setValue(curPos + [0,0,z]);
                        curPos += [0,0,z];
                    }    
                }
            }
        }
        catch(e)
        { 
            var err = {en:e, fr:e}; 
            return err;
        }

        app.endUndoGroup();                        
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
 This class provides some utility functions used by AlignLayers
 @class Some utility functions grouped in a class
*/
function AlignLayersUtils()
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
        Window.alert("操作出错:\r" + this.loc(err), wndTitle, true);
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
     Displays a customized window containg the About text
     @param {String} aboutStr The text to display
    */
}


/**
 Creates an instance of the main class and run it
*/
new AlignLayers().run(this);

