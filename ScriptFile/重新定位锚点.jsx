/* 

名称: 随机选择层（2）
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

function RepositionAnchorPoint()
{
    // Variable used to keep track of 'this' reference
    var repositionAnchorPoint = this;
    
    // Create an instance of the utils class to use its functions
    var utils = new RepositionAnchorPointUtils();

    // Script infos
    this.scriptTitle = "重新定位锚点";

    // Errors
    this.requirementErr = {en:"This script requires After Effects CS3 or later.", fr:"Ce script nécessite After Effects CS3 ou supérieur."};    
    this.noCompErr = {en:"A comp must be active.", fr:"Une composition doit être active."};
    this.noLayersErr = {en:"Select at least one layer.", fr:"Sélectionnez au moins un calque."};
    this.processErr = {en:"An error occurred while manipulating layers.", fr:"Une erreur s'est produite pendant la manipulation des calques."};

    // UI strings 
    this.aboutBtnName = "关注视效网了解更多";
    this.edgesStName = {en:"边缘:", fr:"Bords:"};    
    this.edgesLstChoices = {en:"['图层边缘','蒙版边界框']", fr:"['Bords du calque','Cadre de contour du Masque']"};
    this.anchorStName = {en:"锚点:", fr:"Ancrage:"};
    this.runBtnName = {en:"执行", fr:"Éxécuter"};
    
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
                aboutBtn: Button { text:'" + this.aboutBtnName + "', preferredSize:[150,20] } \
            }, \
            gr2: Group { orientation:'row', alignment:['fill','fill'], \
                gr21: Group { orientation:'column', alignment:['fill','fill'], alignChildren:['right','fill'], margins:[0,5,0,0], spacing:10, \
                    edgesSt: StaticText { text:'" + utils.loc(this.edgesStName) + "' }, \
                    anchorSt: StaticText { text:'" + utils.loc(this.anchorStName) + "' } \
                }, \
                gr22: Group { orientation:'column', alignment:['fill','fill'], alignChildren:['left','center'], \
                    gr221: Group { \
                        edgesLst: DropDownList { properties:{items:" + utils.loc(this.edgesLstChoices) + "} } \
                    }, \
                    gr222: Group { orientation:'column', alignment:['fill','fill'], alignChildren:['left','top'], \
                        gr2221: Group { orientation:'row', \
                            aCb: RadioButton { }, \
                            bCb: RadioButton { }, \
                            cCb: RadioButton { } \
                        }, \
                        gr2222: Group { orientation:'row', \
                            dCb: RadioButton { }, \
                            eCb: RadioButton { value:true }, \
                            fCb: RadioButton { } \
                        }, \
                        gr2223: Group { orientation:'row', \
                            gCb: RadioButton { }, \
                            hCb: RadioButton { }, \
                            iCb: RadioButton { } \
                        } \
                    } \
                } \
            }, \
            gr3: Panel { alignment:['fill','center'] }, \
            gr4: Group { orientation:'row', alignment:['fill','top'], \
                runBtn: Button { text:'" + utils.loc(this.runBtnName) + "', alignment:['right','center'] } \
            } \
        }"; 
        pal.gr = pal.add(res);
        
        pal.gr.gr2.gr22.gr221.edgesLst.graphics.foregroundColor = pal.graphics.newPen(pal.graphics.BrushType.SOLID_COLOR, [0,0,0], 1);
        
        pal.gr.gr2.gr22.gr221.edgesLst.selection = 0;
        
        // event callbacks
        pal.gr.gr1.aboutBtn.onClick = function () 
        { 
            utils.createAboutDlg(repositionAnchorPoint.scriptAbout); 
        };
        
        pal.gr.gr2.gr22.gr222.gr2221.aCb.onClick = function ()
        {
            repositionAnchorPoint.uncheckedOthers(this.parent.parent, 0);
        };
        
        pal.gr.gr2.gr22.gr222.gr2221.bCb.onClick = function ()
        {
            repositionAnchorPoint.uncheckedOthers(this.parent.parent, 1);
        };
        
        pal.gr.gr2.gr22.gr222.gr2221.cCb.onClick = function ()
        {
            repositionAnchorPoint.uncheckedOthers(this.parent.parent, 2);
        }; 
        
        pal.gr.gr2.gr22.gr222.gr2222.dCb.onClick = function ()
        {
            repositionAnchorPoint.uncheckedOthers(this.parent.parent, 3);
        }; 
        
        pal.gr.gr2.gr22.gr222.gr2222.eCb.onClick = function ()
        {
            repositionAnchorPoint.uncheckedOthers(this.parent.parent, 4);
        }; 
        
        pal.gr.gr2.gr22.gr222.gr2222.fCb.onClick = function ()
        {
            repositionAnchorPoint.uncheckedOthers(this.parent.parent, 5);
        }; 
        
        pal.gr.gr2.gr22.gr222.gr2223.gCb.onClick = function ()
        {
            repositionAnchorPoint.uncheckedOthers(this.parent.parent, 6);
        }; 
        
        pal.gr.gr2.gr22.gr222.gr2223.hCb.onClick = function ()
        {
            repositionAnchorPoint.uncheckedOthers(this.parent.parent, 7);
        }; 
        
        pal.gr.gr2.gr22.gr222.gr2223.iCb.onClick = function ()
        {
            repositionAnchorPoint.uncheckedOthers(this.parent.parent, 8);
        };
                
        pal.gr.gr4.runBtn.onClick = function () 
        { 
            repositionAnchorPoint.reposition(pal); 
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
     Unchecks radio buttons except the one passed as argument
     @param {Object} Parent group of subgroups containing radio buttons 
     @param {Number} The radio button index to keep checked
    */
    this.uncheckedOthers = function (parentGroup, checkedId)
    {
        this.value = true;
        for (var i = 0; i < parentGroup.children.length; i++)
        for (var j = 0; j < parentGroup.children[i].children.length; j++)
        if (i * parentGroup.children.length + j != checkedId) parentGroup.children[i].children[j].value = false;
    };
    
    /**
     Repositions the anchor point of a set of layers, edges are represented by layer's edges
     @param {Object} pal A palette or a dockable panel containing all user parameters
     @param {Object} layers An array of layer objects          
    */    
    this.repositionOnLayerEdges = function (pal, layers)
    {
        var curTime = layers[0].containingComp.time;
        var compPar = layers[0].containingComp.pixelAspect;
        var anchorId = -1;
        for (var i = 0; anchorId == -1 && i < pal.gr.gr2.gr22.gr222.children.length; i++)
        for (var j = 0; anchorId == -1 && j < pal.gr.gr2.gr22.gr222.children[i].children.length; j++)
        if (pal.gr.gr2.gr22.gr222.children[i].children[j].value)
        {
            anchorId = i * pal.gr.gr2.gr22.gr222.children.length + j;
        }
        
        var err = this.processErr;
        try
        {            
            for (var i = 0; i < layers.length; i++)
            {
                var layer = layers[i];
                var textAdjust, xLayerCenter, yLayerCenter;        
                if (layer instanceof AVLayer || layer instanceof TextLayer) // solid/comp/footage/text layer
                {
                    var layerSize = utils.getLayerSize(layer, curTime); 
                    xLayerCenter = layerSize[0] / 2;
                    yLayerCenter = layerSize[1] / 2;
                    if (layer instanceof TextLayer) textAdjust = [0,2 * yLayerCenter,0]; // assume left align
                }            
                else continue; // skip light/camera            
                
                var anchPt = layer.anchorPoint;
                var pos = layer.position;
                
                var x = (anchorId % 3) * xLayerCenter;
                var y = Math.floor(anchorId / 3) * yLayerCenter;
                var z = 0;            
    
                var delta = [x,y,z] - anchPt.valueAtTime(curTime, false) - (layer instanceof TextLayer ? textAdjust : [0,0,0]);
                var s = layer.scale.valueAtTime(curTime, false) / 100;
                var layerPar = (layer.source) ? layer.source.pixelAspect : 1.0; 
                
                var newAnchPt = anchPt.valueAtTime(curTime, false) + delta;
                var newPos = pos.valueAtTime(curTime, false) + [(s[0]*delta[0]) * (layerPar/compPar), s[1]*delta[1], s[2]*delta[2]];
    
                anchPt.numKeys ? anchPt.setValueAtTime(curTime, newAnchPt) : anchPt.setValue(newAnchPt);            
                pos.numKeys ? pos.setValueAtTime(curTime, newPos) : pos.setValue(newPos);
            }
        }
        catch(e)
        {
            utils.throwErr(err);
        }
    };

    /**
     Repositions the anchor point of a set of layers, edges are represented by the first mask's bounding box (if any)
     @param {Object} pal A palette or a dockable panel containing all user parameters
     @param {Object} layers An array of layer objects          
    */    
    this.repositionOnMaskBoundingBox = function (pal, layers)
    {
        var curTime = layers[0].containingComp.time;
        var compPar = layers[0].containingComp.pixelAspect;
        var anchorId = -1;
        for (var i = 0; anchorId == -1 && i < pal.gr.gr2.gr22.gr222.children.length; i++)
        for (var j = 0; anchorId == -1 && j < pal.gr.gr2.gr22.gr222.children[i].children.length; j++)
        if (pal.gr.gr2.gr22.gr222.children[i].children[j].value)
        {
            anchorId = i * pal.gr.gr2.gr22.gr222.children.length + j;
        }        
        for (var k = 0; k < layers.length; k++)
        {
            var layer = layers[k];
            
            if (layer instanceof AVLayer || layer instanceof TextLayer) // solid/comp/footage/text
            {
                var maskGrp = layer.Masks;
                
                if (maskGrp.numProperties)
                {
                    // Get the first mask
                    var mask = maskGrp.property(1);
                    var maskShape = mask.maskShape;
                    
                    // Retrieve vertices and tangents
                    var shape = maskShape.valueAtTime(curTime, false);
                    var verts = shape.vertices;
                    var intan = shape.inTangents;
                    var outtan = shape.outTangents;

                    // Compute mask bounding box (tangents included)
                    var T = Infinity;
                    var B = -Infinity;
                    var L = Infinity;
                    var R = -Infinity;
                    for (var i = 0; i < verts.length; i++) 
                    {
                        T = utils.min4(T, verts[i][1], verts[i][1]+intan[i][1], verts[i][1]+outtan[i][1]);
                        B = utils.max4(B, verts[i][1], verts[i][1]+intan[i][1], verts[i][1]+outtan[i][1]);
                        L = utils.min4(L, verts[i][0], verts[i][0]+intan[i][0], verts[i][0]+outtan[i][0]);
                        R = utils.max4(R, verts[i][0], verts[i][0]+intan[i][0], verts[i][0]+outtan[i][0]);
                    } 
                        
                    // Reposition anchor point
                    var xBbCenter = (R - L) / 2;
                    var yBbCenter = (B - T) / 2;
                    
                    var anchPt = layer.anchorPoint;
                    var pos = layer.position;                
                    
                    var x = L + (anchorId % 3) * xBbCenter;
                    var y = T + Math.floor(anchorId / 3) * yBbCenter;
                    var z = 0;                            
                    
                    var delta = [x,y,z] - anchPt.valueAtTime(curTime, false);
                    var s = layer.scale.valueAtTime(curTime, false) / 100;
                    var layerPar = layer.source.pixelAspect;                
                    
                    var newAnchPt = anchPt.valueAtTime(curTime, false) + delta;
                    var newPos = pos.valueAtTime(curTime, false) + [(s[0]*delta[0]) * (layerPar/compPar), s[1]*delta[1], s[2]*delta[2]];                
                    
                    anchPt.numKeys ? anchPt.setValueAtTime(curTime, newAnchPt) : anchPt.setValue(newAnchPt);
                    pos.numKeys ? pos.setValueAtTime(curTime, newPos) : pos.setValue(newPos);                
                }
                else // assume a mistake
                {
                    this.repositionOnLayerEdges(pal, layers);    
                }
            }
        }
    };
    
    /**
     Functional part of the script: repositions the anchor point of the selected layers
     @param {Object} pal A palette or a dockable panel containing all user parameters          
    */    
    this.reposition = function (pal)
    {
        try
        {
            var comp = app.project.activeItem;
            var err = this.noCompErr;
            if (this.checkActiveItem(comp)) throw(err);
                    
            var selLayers = comp.selectedLayers;
            var err = this.noLayersErr;
            if (selLayers.length < 1) throw(err);
            
            app.beginUndoGroup(this.scriptTitle);
            
            if (pal.gr.gr2.gr22.gr221.edgesLst.selection.index == 0)
            {
                this.repositionOnLayerEdges(pal, selLayers);
            }
            else 
            {
                this.repositionOnMaskBoundingBox(pal, selLayers);
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
 This class provides some utility functions used by RepositionAnchorPoint
 @class Some utility functions grouped in a class
*/
function RepositionAnchorPointUtils()
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
        Window.alert("Script error:\r" + this.loc(err), wndTitle, true);
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
     Computes the minimum value between four numbers
     @param {Number} n1 A number
     @param {Number} n2 A number
     @param {Number} n3 A number
     @param {Number} n4 A number
     @return {Number} The minimum number between n1, ..., n4 
    */    
    this.min4 = function (n1, n2, n3, n4)
    {
        return (n1 < n2 && n1 < n3 && n1 < n4) ? n1 : 
              ((n2 < n1 && n2 < n3 && n2 < n4) ? n2 :
              ((n3 < n1 && n3 < n2 && n3 < n4) ? n3 : n4));                      
    }; 

    /**
     Computes the maximum value between four numbers
     @param {Number} n1 A number
     @param {Number} n2 A number
     @param {Number} n3 A number
     @param {Number} n4 A number
     @return {Number} The maximum number between n1, ..., n4 
    */    
    this.max4 = function (n1, n2, n3, n4)
    {
        return (n1 > n2 && n1 > n3 && n1 > n4) ? n1 : 
              ((n2 > n1 && n2 > n3 && n2 > n4) ? n2 :
              ((n3 > n1 && n3 > n2 && n3 > n4) ? n3 : n4));                      
    };
        
}


/**
 Creates an instance of the main class and run it
*/
new RepositionAnchorPoint().run(this);
