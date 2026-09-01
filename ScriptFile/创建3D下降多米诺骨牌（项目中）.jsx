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





function Create3DFallingDominoes()
{
    // Variable used to keep track of 'this' reference
    var create3DFallingDominoes = this;
    
    // Create an instance of the utils class to use its functions
    var utils = new Create3DFallingDominoesUtils();

    // Script infos
    this.scriptMinSupportVersion = "8.0";
    this.scriptName = "创建3D骨牌.jsx";    
    this.scriptVersion = "1.0";
    this.scriptTitle = "创建3D骨牌";
    this.scriptCopyright = "Copyright (c) 2010 CaoRun.Net";
    this.scriptHomepage = "http://caorun.blogcn.com";
    this.scriptDescription = {en: "此脚本用作创建3D骨牌推倒效果.", fr:"Ce script crée et anime une chaîne de dominos 3D qui tombent."};
    this.scriptAbout = {en:this.scriptName + ", v" + this.scriptVersion + "\\r\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription), fr:this.scriptName + ", v" + this.scriptVersion + "\\r\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription)};        

    // Errors
    this.requirementErr = {en:"这个脚本运行环境在cs3或更高..", fr:"Ce script nécessite After Effects CS3 ou supérieur."};    
    this.noCompErr = {en:"合成必须激活.", fr:"Une composition doit être active."};
    this.noLayersErr = {en:"激活合成必须包含至少一个层.", fr:"La composition active doit contenir au moins un calque."};

    // UI strings 
    this.aboutBtnName = "关于";
    this.dominoPnlName = {en:"骨牌设置", fr:"Paramètres d\\'un domino"};
    this.dominoWidthHeightStName = {en:"宽/高:", fr:"Largeur/Hauteur:"};
    this.dominoWidthEtDflt = 100;
    this.dominoHeightEtDflt = 140;
    this.dominoThicknessStName = {en:"厚度:", fr:"Épaisseur:"};
    this.dominoThicknessEtDflt = 20;
    this.finalCompPnlName = {en:"最终合成", fr:"Comp Finale"};
    this.finalCompWidthHeightStName = {en:"宽/高:", fr:"Largeur/Hauteur:"};
    this.finalCompWidthEtDflt = 800;
    this.finalCompHeightEtDflt = 600;
    this.finalCompFrameRateStName = {en:"帧率:", fr:"Cadence:"};
    this.finalCompFrameRateEtDflt = 25;
    this.finalCompDurationStName = {en:"时间:", fr:"Durée:"};
    this.finalCompDurationEtDflt = 10;
    this.animationPnlName = {en:"动画", fr:"Animation"};
    this.numberOfDominoesStName = {en:"骨牌数量:", fr:"Nombre de dominos:"};    
    this.numberOfDominoesEtDflt = 10;
    this.distanceBetweenDominoesStName = {en:"骨牌之间的距离:", fr:"Distance entre les dominos:"};
    this.distanceBetweenDominoesEtDflt = 100;
    this.framesBeforeCollisionStName = {en:"帧碰撞时间:", fr:"Nombre d\\'images avant collision:"};
    this.framesBeforeCollisionEtDflt = 5;
    this.runBtnName = {en:"创建", fr:"Créer"};
    
    // Domino-related strings & default settings
    this.dominoPrecompName = {en:"多米诺骨牌", fr:"Précomp Domino"};
    this.sideLayerNames = {en:["Front","Back","Left","Right","Bottom","Top"], fr:["Avant","Arrière","Gauche","Droite","Bas","Haut"]};
    this.dominoColor = [1,1,1]; // white
    this.finalCompName = {en:"多米诺骨牌动画工程", fr:"Animation des dominos"};
    this.controllerLayerName = {en:"Controller", fr:"Contrôleur"};
    this.distanceBetweenDominoesEffectName = {en:"Distance Between Dominoes", fr:"Distance entre les dominos"};
    this.framesBeforeCollisionEffectName = {en:"Frames Before Collision", fr:"Nombre d'images avant collision"};
    this.firstDominoLayerName = {en:"First Domino", fr:"Premier Domino"};
    
    
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
            gr2: Panel { text:'" + utils.loc(this.dominoPnlName) + "', alignment:['fill','fill'], alignChildren:['right','top'], \
                gr21: Group { \
                    dominoWidthHeightSt: StaticText { text:'" + utils.loc(this.dominoWidthHeightStName) + "' }, \
                    dominoWidthEt: EditText { text:'" + this.dominoWidthEtDflt + "', characters:5 }, \
                    dominoHeightEt: EditText { text:'" + this.dominoHeightEtDflt + "', characters:5 } \
                }, \
                gr22: Group { \
                    dominoThicknessSt: StaticText { text:'" + utils.loc(this.dominoThicknessStName) + "' }, \
                    dominoThicknessEt: EditText { text:'" + this.dominoThicknessEtDflt + "', characters:5 }, \
                    fooEt: EditText { characters:5, visible:false } \
                } \
            }, \
            gr3: Panel { text:'" + utils.loc(this.finalCompPnlName) + "', alignment:['fill','fill'], alignChildren:['right','top'], \
                gr31: Group { \
                    finalCompWidthHeightSt: StaticText { text:'" + utils.loc(this.finalCompWidthHeightStName) + "' }, \
                    finalCompWidthEt: EditText { text:'" + this.finalCompWidthEtDflt + "', characters:5 }, \
                    finalCompHeightEt: EditText { text:'" + this.finalCompHeightEtDflt + "', characters:5 } \
                }, \
                gr32: Group { \
                    finalCompFrameRateSt: StaticText { text:'" + utils.loc(this.finalCompFrameRateStName) + "' }, \
                    finalCompFrameRateEt: EditText { text:'" + this.finalCompFrameRateEtDflt + "', characters:5 }, \
                    fooEt: EditText { characters:5, visible:false } \
                }, \
                gr33: Group { \
                    finalCompDurationSt: StaticText { text:'" + utils.loc(this.finalCompDurationStName) + "' }, \
                    finalCompDurationEt: EditText { text:'" + this.finalCompDurationEtDflt + "', characters:5 }, \
                    fooEt: EditText { characters:5, visible:false } \
                } \
            }, \
            gr4: Panel { text:'" + utils.loc(this.animationPnlName) + "', alignment:['fill','fill'], alignChildren:['right','top'], \
                gr41: Group { \
                    numberOfDominoesSt: StaticText { text:'" + utils.loc(this.numberOfDominoesStName) + "' }, \
                    numberOfDominoesEt: EditText { text:'" + this.numberOfDominoesEtDflt + "', characters:5 }, \
                    fooEt: EditText { characters:5, visible:false } \
                }, \
                gr42: Group { \
                    distanceBetweenDominoesSt: StaticText { text:'" + utils.loc(this.distanceBetweenDominoesStName) + "' }, \
                    distanceBetweenDominoesEt: EditText { text:'" + this.distanceBetweenDominoesEtDflt + "', characters:5 }, \
                    fooEt: EditText { characters:5, visible:false } \
                }, \
                gr43: Group { \
                    framesBeforeCollisionSt: StaticText { text:'" + utils.loc(this.framesBeforeCollisionStName) + "' }, \
                    framesBeforeCollisionEt: EditText { text:'" + this.framesBeforeCollisionEtDflt + "', characters:5 }, \
                    fooEt: EditText { characters:5, visible:false } \
                } \
            }, \
            gr5: Group { orientation:'row', alignment:['fill','top'], \
                runBtn: Button { text:'" + utils.loc(this.runBtnName) + "', alignment:['right','center'] } \
            } \
        }"; 
        pal.gr = pal.add(res);
        
        pal.gr.gr2.gr21.dominoWidthEt.graphics.foregroundColor = 
        pal.gr.gr2.gr21.dominoHeightEt.graphics.foregroundColor = 
        pal.gr.gr2.gr22.dominoThicknessEt.graphics.foregroundColor = 
        pal.gr.gr3.gr31.finalCompWidthEt.graphics.foregroundColor = 
        pal.gr.gr3.gr31.finalCompHeightEt.graphics.foregroundColor = 
        pal.gr.gr3.gr32.finalCompFrameRateEt.graphics.foregroundColor = 
        pal.gr.gr3.gr33.finalCompDurationEt.graphics.foregroundColor = 
        pal.gr.gr4.gr41.numberOfDominoesEt.graphics.foregroundColor = 
        pal.gr.gr4.gr42.distanceBetweenDominoesEt.graphics.foregroundColor = 
        pal.gr.gr4.gr43.framesBeforeCollisionEt.graphics.foregroundColor = pal.graphics.newPen(pal.graphics.BrushType.SOLID_COLOR, [0,0,0], 1);
        
        // event callbacks
        pal.gr.gr1.aboutBtn.onClick = function () 
        { 
            utils.createAboutDlg(create3DFallingDominoes.scriptAbout); 
        };

        pal.gr.gr2.gr21.dominoWidthEt.onChange = function () 
        { 
            if (isNaN(this.text) || parseInt(this.text) < 1 || parseInt(this.text) > 30000) this.text = create3DFallingDominoes.dominoWidthEtDflt;
            else this.text = Math.round(this.text);
        };        

        pal.gr.gr2.gr21.dominoHeightEt.onChange = function () 
        { 
            if (isNaN(this.text) || parseInt(this.text) < 1 || parseInt(this.text) > 30000) this.text = create3DFallingDominoes.dominoHeightEtDflt;
            else this.text = Math.round(this.text);
        };

        pal.gr.gr2.gr22.dominoThicknessEt.onChange = function () 
        { 
            if (isNaN(this.text) || parseInt(this.text) < 1 || parseInt(this.text) > 30000) this.text = create3DFallingDominoes.dominoThicknessEtDflt;
            else this.text = Math.round(this.text);
        };

        pal.gr.gr3.gr31.finalCompWidthEt.onChange = function () 
        { 
            if (isNaN(this.text) || parseInt(this.text) < 1 || parseInt(this.text) > 30000) this.text = create3DFallingDominoes.finalCompWidthEtDflt;
            else this.text = Math.round(this.text);
        };        

        pal.gr.gr3.gr31.finalCompHeightEt.onChange = function () 
        { 
            if (isNaN(this.text) || parseInt(this.text) < 1 || parseInt(this.text) > 30000) this.text = create3DFallingDominoes.finalCompHeightEtDflt;
            else this.text = Math.round(this.text);
        };

        pal.gr.gr3.gr32.finalCompFrameRateEt.onChange = function () 
        { 
            if (isNaN(this.text) || parseInt(this.text) < 1 || parseInt(this.text) > 99) this.text = create3DFallingDominoes.finalCompFrameRateEtDflt;
            else this.text = Math.round(this.text);
        };
        
        pal.gr.gr3.gr33.finalCompDurationEt.onChange = function () 
        { 
            if (isNaN(this.text) || parseFloat(this.text) <= 0 || parseFloat(this.text) > 10800) this.text = create3DFallingDominoes.finalCompDurationEtDflt;
            else this.text = parseFloat(this.text);
        };
                        
        pal.gr.gr4.gr41.numberOfDominoesEt.onChange = function () 
        { 
            if (isNaN(this.text) || parseInt(this.text) < 1 || parseInt(this.text) > 1000) this.text = create3DFallingDominoes.numberOfDominoesEtDflt;
            else this.text = Math.round(this.text);
        };

        pal.gr.gr4.gr42.distanceBetweenDominoesEt.onChange = function () 
        { 
            if (isNaN(this.text) || parseFloat(this.text) <= 0 || parseFloat(this.text) >= pal.gr.gr2.gr21.dominoHeight) this.text = create3DFallingDominoes.distanceBetweenDominoesEtDflt;
            else this.text = parseFloat(this.text);
        };

        pal.gr.gr4.gr43.framesBeforeCollisionEt.onChange = function () 
        { 
            if (isNaN(this.text) || parseInt(this.text) < 1 || parseInt(this.text) > 10800) this.text = create3DFallingDominoes.framesBeforeCollisionEtDflt;
            else this.text = Math.round(this.text);
        };
        
        pal.gr.gr5.runBtn.onClick = function ()
        {
            create3DFallingDominoes.createFallingDominoes(pal);    
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
     Creates a domino precomp of given characteristics
     @param {Object} pal A palette or a dockable panel containing all user parameters
     @return {Object} A comp item object representing the domino precomp          
    */    
    this.createDomino = function (pal)
    {
        var dominoWidth = parseInt(pal.gr.gr2.gr21.dominoWidthEt.text);
        var dominoHeight = parseInt(pal.gr.gr2.gr21.dominoHeightEt.text);
        var dominoThickness = parseInt(pal.gr.gr2.gr22.dominoThicknessEt.text);
                          
        var compName = utils.loc(this.dominoPrecompName);
        var compW = dominoWidth;                    
        var compH = dominoHeight;                    
        var compPAR = 1.0;
        var compDur = parseFloat(pal.gr.gr3.gr33.finalCompDurationEt.text);                   
        var compFPS = parseInt(pal.gr.gr3.gr32.finalCompFrameRateEt.text);                   

        var comp = app.project.items.addComp(compName, compW, compH, compPAR, compDur, compFPS);
        
        var pos = [ 
        [dominoWidth/2, dominoHeight/2, 0], 
        [dominoWidth/2, dominoHeight/2, dominoThickness],
        [0, dominoHeight/2, dominoThickness/2],
        [dominoWidth, dominoHeight/2, dominoThickness/2],
        [dominoWidth/2, dominoHeight, dominoThickness/2],
        [dominoWidth/2, 0, dominoThickness/2] 
        ];
        var ori = [ 
        [0, 0, 0],        
        [0, 180, 0],
        [0, 90, 0],
        [0, 270, 0],
        [90, 0, 0],
        [270, 0, 0] 
        ];
        var widths = [dominoWidth, dominoWidth, dominoThickness, dominoThickness, dominoWidth, dominoWidth];
        var heights = [dominoHeight, dominoHeight, dominoHeight, dominoHeight, dominoThickness, dominoThickness];
        
        for (var i = 0; i < 6; i++)
        {
            var layer = comp.layers.addSolid(this.dominoColor, utils.loc(this.sideLayerNames)[i], widths[i], heights[i], compPAR, compDur);
            layer.threeDLayer = true;
            layer.position.setValue(pos[i]);
            layer.orientation.setValue(ori[i]);
        }
                
        return comp;
    };

    /**
     Creates and animates a chain of falling dominoes 
     @param {Object} pal A palette or a dockable panel containing all user parameters
     @param {Object} dominoPrecomp A comp item object representing the domino precomp used to build the chain          
    */    
    this.createDominoesChain = function (pal, dominoPrecomp)
    {
        var dominoWidth = parseInt(pal.gr.gr2.gr21.dominoWidthEt.text);
        var dominoHeight = parseInt(pal.gr.gr2.gr21.dominoHeightEt.text);
        var dominoThickness = parseInt(pal.gr.gr2.gr22.dominoThicknessEt.text);
        var numberOfDominoes = parseInt(pal.gr.gr4.gr41.numberOfDominoesEt.text); 
        var distanceBetweenDominoes = parseFloat(pal.gr.gr4.gr42.distanceBetweenDominoesEt.text);
        var framesBeforeCollision = parseFloat(pal.gr.gr4.gr43.framesBeforeCollisionEt.text);
        
        var compName = utils.loc(this.finalCompName);
        var compW = parseInt(pal.gr.gr3.gr31.finalCompWidthEt.text);                    
        var compH = parseInt(pal.gr.gr3.gr31.finalCompHeightEt.text);                    
        var compPAR = 1.0;
        var compDur = parseFloat(pal.gr.gr3.gr33.finalCompDurationEt.text);                   
        var compFPS = parseInt(pal.gr.gr3.gr32.finalCompFrameRateEt.text);                   

        var comp = app.project.items.addComp(compName, compW, compH, compPAR, compDur, compFPS);       
    
        // add controller
        var controllerLayer = comp.layers.addNull();
        controllerLayer.name = utils.loc(this.controllerLayerName);
        controllerLayer.threeDLayer = true;

        var halfZ = -(numberOfDominoes - 1) * (distanceBetweenDominoes + dominoThickness) / 2;
        controllerLayer.position.setValue([compW/2, compH/2, halfZ]);
        
        var distanceBetweenDominoesEffect = controllerLayer.Effects.addProperty("ADBE Slider Control");
        distanceBetweenDominoesEffect.name = utils.loc(this.distanceBetweenDominoesEffectName);
        distanceBetweenDominoesEffect.property(1).setValue(distanceBetweenDominoes);
        
        var framesBeforeCollisionEffect = controllerLayer.Effects.addProperty("ADBE Slider Control");
        framesBeforeCollisionEffect.name = utils.loc(this.framesBeforeCollisionEffectName);
        framesBeforeCollisionEffect.property(1).setValue(framesBeforeCollision);

        // add first domino
        var firstDomino = comp.layers.add(dominoPrecomp);
        firstDomino.name = utils.loc(this.firstDominoLayerName);
        firstDomino.threeDLayer = true;
        firstDomino.collapseTransformation = true;
        
        firstDomino.anchorPoint.setValue([dominoWidth/2, dominoHeight, 0]); 
        firstDomino.position.setValue([compW/2, compH/2 + dominoHeight/2, 0]);
        firstDomino.rotationX.expression = // this code is adapted from Pete Everett's Plot3D demo (http://www.codeproject.com/KB/GDI-plus/Plot3D.aspx) 
        "function solveQuadraticEquation(a, b, c)\r" +
        "{\r" +
        "    var solution1 = (-b + Math.sqrt(b * b - 4.0 * a * c)) / (2.0 * a);\r" +
        "    var solution2 = (-b - Math.sqrt(b * b - 4.0 * a * c)) / (2.0 * a);\r" +
        "    return Math.max(solution1, solution2);\r" +
        "}\r" +
        "\r" +
        "function findInnerAnglePhase1(bottomLength, dominoHeight, outerAngle)\r" +
        "{\r" +
        "    var tan = Math.tan(outerAngle);\r" +
        "    var a = (tan * tan) + 1;\r" +
        "    var b = 2 * bottomLength;\r" +
        "    var c = (bottomLength * bottomLength) - (dominoHeight * dominoHeight);\r" +
        "    var solution = solveQuadraticEquation(a, b, c);\r" +
        "    return Math.acos((bottomLength + solution) / dominoHeight);\r" +
        "}\r" +
        "\r" +
        "function getProjectedLength(tiltAngle, thickness)\r" +
        "{\r" +
        "    return thickness / Math.sin(tiltAngle);\r" +
        "}\r" +
        "\r" +
        "function findInnerAnglePhase2(outerAngle, thickness, distanceBetween)\r" +
        "{\r" +
        "    var y = thickness * Math.sin(Math.PI / 2 - outerAngle);\r" +
        "    var x = thickness * Math.cos(Math.PI / 2 - outerAngle);\r" +
        "    return Math.atan(y / (distanceBetween + thickness - x));\r" +        
        "}\r" +
        "\r" +
        "function findInnerAngle(outerAngle, dominoHeight, dominoThickness, distanceBetween)\r" +
        "{\r" +
        "    outerAngle = degreesToRadians(outerAngle);\r" +
        "    var projectedLength = getProjectedLength(outerAngle, dominoThickness);\r" +        
        "    var bottomLength = dominoThickness + distanceBetween - projectedLength;\r" +
        "    if (bottomLength > 0)\r" +
        "    {\r" +
        "        return radiansToDegrees(findInnerAnglePhase1(bottomLength, dominoHeight, outerAngle));\r" +            
        "    }\r" +
        "    else\r" +
        "    {\r" +
        "        return radiansToDegrees(findInnerAnglePhase2(outerAngle, dominoThickness, distanceBetween));\r" +
        "    }\r" +
        "}\r" +
        "\r" +
        "function Domino(height, thickness)\r" +
        "{\r" +
        "    var D = new Object();\r" +
        "    D.height = height;\r" +
        "    D.thickness = thickness;\r" +
        "    D.fallAngle = 90;\r" + 
        "    return D;\r" +
        "}\r" +
        "\r" +
        "function Dominoes(numberOfDominoes, dominoHeight, dominoThickness, distanceBetweenDominoes, framesBeforeCollision)\r" +
        "{\r" +
        "    var Ds = new Object();\r" +
        "    Ds.dominoArray = new Array(numberOfDominoes);\r" +
        "    for (var d = 0; d < Ds.dominoArray.length; d++)\r" +
        "    {\r" +
        "        Ds.dominoArray[d] = new Domino(dominoHeight, dominoThickness);\r" +
        "    }\r" +
        "    Ds.distanceBetweenDominoes = distanceBetweenDominoes;\r" +
        "    Ds.angleBetweenDominoes = radiansToDegrees(Math.acos(Ds.distanceBetweenDominoes / dominoHeight));\r" +
        "\r" +
        "    Ds.calculateRotation = function ()\r" +
        "    {\r" +         
        "        for (var lastFallingDomino = 0; lastFallingDomino < Ds.dominoArray.length; lastFallingDomino++)\r" +
        "        {\r" +
        "            for (var frame = 0; frame < framesBeforeCollision; frame++)\r" +
        "            {\r" +
        "                Ds.dominoArray[lastFallingDomino].fallAngle = 90 - ((90 - Ds.angleBetweenDominoes) * frame / framesBeforeCollision);\r" +
        "\r" +
        "                for (var parentDomino = lastFallingDomino - 1; parentDomino >= 0; parentDomino--)\r" +
        "                {\r" +
        "                    Ds.dominoArray[parentDomino].fallAngle = findInnerAngle(Ds.dominoArray[parentDomino + 1].fallAngle,\r" +
        "                                                                            Ds.dominoArray[0].height,\r" + 
        "                                                                            Ds.dominoArray[0].thickness,\r" +
        "                                                                            Ds.distanceBetweenDominoes);\r" +
        "\r" +
        "                    if (parentDomino == 0)\r" +
        "                    {\r" +
        "                        rotationArray[rotationArray.length] = Ds.dominoArray[parentDomino].fallAngle;\r" +
        "                    }\r" +
        "                }\r" +
        "            }\r" +
        "        }\r" +
        "\r" +
        "        var lastDomino = Ds.dominoArray[Ds.dominoArray.length - 1];\r" +
        "\r" +
        "        var fallAngle = lastDomino.fallAngle;\r" +
        "\r" +
        "        var distancePerFrame = Ds.angleBetweenDominoes / framesBeforeCollision;\r" +
        "\r" +
        "        while (fallAngle > 0)\r" +
        "        {\r" +
        "            fallAngle -= distancePerFrame;\r" +
        "\r" +
        "            lastDomino.fallAngle = Math.max(fallAngle, 0);\r" +
        "\r" +
        "            for (var parentDomino = Ds.dominoArray.length - 2; parentDomino >= 0; parentDomino--)\r" +
        "            {\r" +
        "                Ds.dominoArray[parentDomino].fallAngle = findInnerAngle(Ds.dominoArray[parentDomino + 1].fallAngle,\r" + 
        "                                                                        Ds.dominoArray[0].height,\r" + 
        "                                                                        Ds.dominoArray[0].thickness,\r" + 
        "                                                                        Ds.distanceBetweenDominoes);\r" +
        "\r" +
        "                if (parentDomino == 0)\r" +
        "                {\r" +
        "                    rotationArray[rotationArray.length] = Ds.dominoArray[parentDomino].fallAngle;\r" +
        "                }\r" +
        "            }\r" +
        "        }\r" +        
        "    };\r" +
        "\r" +
        "    return Ds;\r" +
        "}\r" +
        "\r" +
        "numberOfDominoes = " + numberOfDominoes + ";\r" +
        "dominoHeight = height;\r" +
        "dominoThickness = " + dominoThickness + ";\r" +
        "distanceBetweenDominoes = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\").effect(\"" + utils.loc(this.distanceBetweenDominoesEffectName) + "\")(1);\r" +
        "framesBeforeCollision = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\").effect(\"" + utils.loc(this.framesBeforeCollisionEffectName) + "\")(1);\r" +
        "Ds = new Dominoes(numberOfDominoes, dominoHeight, dominoThickness, distanceBetweenDominoes, framesBeforeCollision);\r" +
        "\r" +
        "rotationArray = new Array();\r" +        
        "Ds.calculateRotation();\r" +
        "\r" +
        "lastAngle = radiansToDegrees(Math.PI/2 - Math.asin(dominoThickness / (distanceBetweenDominoes + dominoThickness)));\r" +
        "f = timeToFrames(time);\r" +
        "\r" +
        "if (f <= framesBeforeCollision)\r" + 
        "{\r" +
        "   linear(time,0,framesBeforeCollision * thisComp.frameDuration,0,90 - rotationArray[0]);\r" +
        "}\r" +
        "else if (f < Ds.dominoArray.length * framesBeforeCollision)\r" +
        "{\r" +
        "   90 - rotationArray[f - framesBeforeCollision];\r" +
        "}\r" +
        "else\r" +
        "{\r" +
        "   lastAngle;\r" +
        "}";
        
        firstDomino.parent = controllerLayer;
        firstDomino.moveAfter(comp.layer(comp.numLayers));
        
        // add other dominoes
       for (var d = 1; d < numberOfDominoes; d++)
        {
            var curDomino = comp.layers.add(dominoPrecomp);
            curDomino.threeDLayer = true;
            curDomino.collapseTransformation = true;
            curDomino.anchorPoint.setValue([dominoPrecomp.width / 2, dominoPrecomp.height, 0]);                        
            //curDomino.position.setValue([comp.width / 2, comp.height / 2 + dominoComp.height / 2, -d * (G.ANIM_DISTANCE_BETWEEN + G.DOMINO_THICKNESS)]);
            
            curDomino.moveAfter(comp.layer(comp.numLayers)); // before applying expression since the expression uses index-1
            
            curDomino.position.expression = 
            "distanceBetweenDominoes = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\").effect(\"" + utils.loc(this.distanceBetweenDominoesEffectName) + "\")(1);\r" +
            "dominoThickness = " + dominoThickness + ";\r" +
            "thisComp.layer(index - 1).position - [0,0,distanceBetweenDominoes + dominoThickness];";            
            
            curDomino.rotationX.expression =
            "framesBeforeCollision = thisComp.layer(\"" + utils.loc(this.controllerLayerName) + "\").effect(\"" + utils.loc(this.framesBeforeCollisionEffectName) + "\")(1);\r" +
            "thisComp.layer(index - 1).rotationX.valueAtTime(time - framesBeforeCollision * thisComp.frameDuration);";                    
            
            curDomino.parent = controllerLayer;
            curDomino.selected = false;
        }            
        
        // something like Left View 
        controllerLayer.position.setValue([compW/2, compH/2, -halfZ]);
        controllerLayer.rotationY.setValue(-90); 
    };
    
    /**
     Creates a domino precomp and use it to build and animate a chain of falling dominoes
     @param {Object} pal A palette or a dockable panel containing all user parameters          
    */    
    this.createFallingDominoes = function (pal)
    {
        try
        {
            app.beginUndoGroup(this.scriptTitle);
            
            var dominoWidth = parseInt(pal.gr.gr2.gr21.dominoWidthEt.text);
            var dominoHeight = parseInt(pal.gr.gr2.gr21.dominoHeightEt.text);
            var dominoThickness = parseInt(pal.gr.gr2.gr22.dominoThicknessEt.text);
            
            var dominoPrecomp = this.createDomino(pal);
            
            this.createDominoesChain(pal, dominoPrecomp);
              
            app.endUndoGroup();
        }
        catch(e)//rr)
        {
            alert(e);
            //utils.throwErr(err);
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
 This class provides some utility functions used by Create3DFallingDominoes
 @class Some utility functions grouped in a class
*/
function Create3DFallingDominoesUtils()
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
new Create3DFallingDominoes().run(this);
