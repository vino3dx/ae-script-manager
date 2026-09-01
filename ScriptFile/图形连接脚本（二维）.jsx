// Copyright (c) 2015 MONTER AECLUB :)
function ConnectLayers() {
    var connectLayers, utils;
    connectLayers = this;
    utils = new ConnectLayersUtils();
    this.scriptName = "图形连线脚本";
    this.scriptVersion = "1.0";
    this.scriptCopyright = "这是版权Copyright (c) 2014 Motion Boutique 反正这脚本不是我做的";
    this.scriptHomepage = "大神网站www.motionboutique.com 估计不FQ你不进去";
    this.scriptDescription = {
        en: "该脚本将所选图层与使用形状图层创建的线段或三角形连接起来。\\r\\r绳索：使用连接选定图层的路径创建单个形状图层（仅限2D）。 使用“自动贝塞尔曲线”或“张力”选项可获得圆形的关节样式。\\r\\r分支：计算最小生成分支，并使用形状图层（2D和3D支持）绘制每个边缘。\\r\\r三角连线：对选定的图层进行三角连线，并用形状图层（2D和3D支撑）绘制每个边缘。 如果要填充三角形（而不仅仅是边缘），请在“选项”对话框中激活“填充三角形”开关。 默认情况下，它们将以相同的颜色填充，但是您也可以选择源图层来对其进行着色。\\r\\r请注意，对于创建形状关键帧的功能（启用“填充三角形”的三角连线并启用“绳索”），关键帧是在合成工作区域内完成的。　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　汉化于：2020.6.25",
        fr: "Ce script relie les calques s\xe9lectionn\xe9s avec des segments ou des triangles cr\xe9\xe9s avec des calques de formes.\\r\\rCorde: cr\xe9e un calque de forme avec un trac\xe9 connectant les calques s\xe9lectionn\xe9s (2D seulement). Utilisez les options AutoBezier ou Tension pour avoir des joints arrondis.\\r\\rArbre: calcule un arbre couvrant minimum et dessine chaque ar\xeate avec un calque de forme (supporte 2D et 3D).\\r\\rTriangulation: triangule les calques s\xe9lectionn\xe9s et dessine chaque ar\xeate avec un calque de forme (supporte 2D and 3D). Si vous souhaitez des triangles remplis (pas seulement les ar\xeates), activez l\\'option Remplir les triangles dans le dialogue des options. Par d\xe9faut ils seront remplis en blanc, mais vous pouvez aussi choisir un calque source pour les colorer.\\r\\rNotez que pour les fonctions cr\xe9ant des images cl\xe9s pour le Trac\xe9 (Triangulation lorsque Remplir les triangles est coch\xe9 et Corde), la cr\xe9ation de cl\xe9s se fait sur la dur\xe9e de la zone de travail."
    };
    this.scriptAbout = {
        en: (this.scriptName + ", v" + this.scriptVersion + "\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription)),
        fr: (this.scriptName + ", v" + this.scriptVersion + "\\r" + this.scriptCopyright + "\\r" + this.scriptHomepage + "\\r\\r" + utils.loc(this.scriptDescription))
    };
    this.scriptUsage = {
        en: "\u25ba 总之点就行了，多尝试，你总能会的，不可能学不会！\\r\u25ba 选项里面可以调整连线粗细颜色等可怜的几个参数 \\r\ \\r\u25ba强调一下，我不是脚本编辑的大神，我只是不懂英语，所以才想汉化的，脚本问题不要找我，我只是个木得感情的机翻人+搬运工。",
        fr: "\u25ba Cliquez sur la fonction \xe0 ex\xe9cuter\\r\u25ba Optionnellement ouvrez le dialogue des Options pour ajuster les param\xe8tres"
    };
    
    this.optionsBtnName = {
        en: "选项",
        fr: "Options"
    };
    this.aboutBtnName = "?";
    this.ropeBtnName = {
        en: "K帧连线",
        fr: "Corde"
    };
    this.treeBtnName = {
        en: "分支",
        fr: "Arbre"
    };
    this.triangulationBtnName = {
        en: "三角连线",
        fr: "Triangulation"
    };
    this.optionsTitle = {
        en: "选项",
        fr: "Options"
    };
    this.optionsBtnHlp = {
        en: "选项...",
        fr: "Options..."
    };
    this.aboutBtnHlp = {
        en: "关于...",
        fr: "\xc0 propos de..."
    };
    this.strokeGrpName = {
        en: "笔划",
        fr: "Trait"
    };
    this.strokeWidthStName = {
        en: "笔划宽度（像素）",
        fr: "Largeur du trait (px)"
    };
    this.strokeColorStName = {
        en: "描边颜色",
        fr: "Couleur du trait"
    };
    this.strokeWidthEtVal = 1;
    this.strokeColorClrVal = [1, 1, 1];
    this.ropeGrpName = {
        en: "K帧连线",
        fr: "Corde"
    };
    this.autoBezierRbName = {
        en: "自动贝塞尔曲线",
        fr: "AutoBezier"
    };
    this.autoBezierRbVal = true;
    this.tensionRbName = {
        en: "张力（％）",
        fr: "Tension (%)"
    };
    this.tensionRbVal = false;
    this.tensionEtVal = 0;
    this.closedCbName = {
        en: "关闭",
        fr: "Ferm\xe9"
    };
    this.closedCbVal = false;
    this.triangulationGrpName = {
        en: "三角连线",
        fr: "Triangulation"
    };
    this.fillTrianglesName = {
        en: "填充三角形",
        fr: "Remplir les triangles"
    };
    this.fillTrianglesCbVal = false;
    this.useColorsFromLayerCbName = {
        en: "使用图层中的颜色",
        fr: "Utiliser les couleurs du calque"
    };
    this.useColorsFromLayerCbVal = false;
    this.useColorsFromLayerId = 0;
    this.refreshBtnName = {
        en: "刷新",
        fr: "Rafra\xeechir"
    };
    this.pgsBr = null;
    this.optionsPal = null;
    this.buildUI = function(thisObj) {
        var pal, res;
        pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", this.scriptName, undefined, {
            resizeable: false
        });
        pal.margins = 5;
        res = "group { orientation:'column', alignment:['left','top'], alignChildren:['right','top'], spacing:5, \n\t\t\tgr0: Group { alignment:['fill','fill'], \n\t\t\t\theader: Image { } \n\t\t\t}, \n\t\t\tgr1: Group { spacing:0, \n\t\t\t\toptionsBtn: Button { text:'" + utils.loc(this.optionsBtnName) + "', preferredSize:[55,20] }, \n\t\t\t\taboutBtn: Button { text:'" + this.aboutBtnName + "', preferredSize:[25,20] } \n\t\t\t}, \n\t\t\tgr2: Group { orientation:'row', alignment:['fill','top'], spacing:0, \n\t\t\t\tropeBtn: Button { text:'" + utils.loc(this.ropeBtnName) + "', alignment:['fill','top'], preferredSize:[70,-1] }, \n\t\t\t\ttreeBtn: Button { text:'" + utils.loc(this.treeBtnName) + "', alignment:['fill','top'], preferredSize:[50,-1] }, \n\t\t\t\ttriangulationBtn: Button { text:'" + utils.loc(this.triangulationBtnName) + "', alignment:['fill','top'] } \n\t\t\t}, \n\t\t\tgr3: Group { orientation:'column', alignment:['fill','top'], \n\t\t\t\tpgsBr: Progressbar { alignment:['fill','top'], preferredSize:[-1,5] } \n\t\t\t} \n\t\t}";
        pal.gr = pal.add(res);
        connectLayers.pgsBr = pal.gr.gr3.pgsBr;
        pal.gr.gr1.aboutBtn.onClick = function() {
            utils.createAboutDlg(connectLayers.scriptAbout, connectLayers.scriptUsage);
        };
        pal.gr.gr1.optionsBtn.onClick = function() {
            var optionsPal, res, selCompErr, latestColorInt;

            function populateLst() {
                var comp, i;
                optionsPal.gr.gr2.gr22.gr221.useColorsFromLayerLst.removeAll();
                comp = app.project.activeItem;
                if (comp && (comp instanceof CompItem)) {
                    for (i = 1; i <= comp.numLayers; i = i + 1) {
                        optionsPal.gr.gr2.gr22.gr221.useColorsFromLayerLst.add("item", comp.layer(i).name);
                    }
                    if (optionsPal.gr.gr2.gr22.gr221.useColorsFromLayerLst.items.length) {
                        optionsPal.gr.gr2.gr22.gr221.useColorsFromLayerLst.selection = 0;
                        connectLayers.useColorsFromLayerId = 1;
                    }
                }
            }
            selCompErr = {
                en: "You must select a composition first.",
                fr: "Vous devee d'abord s\xe9lectionner une composition."
            };
            optionsPal = new Window("dialog", utils.loc(connectLayers.optionsTitle), undefined);
            res = "group { orientation:'column', \n\t\t\t\tgr0: Panel { alignment:['fill','top'], \n\t\t\t\t\tgr01: Group { alignment:['fill','top'], \n\t\t\t\t\t\tstrokeWidthSt: StaticText { text:'" + utils.loc(connectLayers.strokeWidthStName) + "', alignment:['left','top'] }, \n\t\t\t\t\t\tstrokeWidthEt: EditText { text:'" + connectLayers.strokeWidthEtVal + "', preferredSize:[65,20], alignment:['right','top'] } \n\t\t\t\t\t}, \n\t\t\t\t\tgr02: Group { alignment:['fill','top'], \n\t\t\t\t\t\tstrokeColorSt: StaticText { text:'" + utils.loc(connectLayers.strokeColorStName) + "', alignment:['left','top'] }, \n\t\t\t\t\t\tgr021: Group { alignment:['right','top'], orientation:'stack', margins:[0,0,1,0], \n\t\t\t\t\t\t\tcoloredGrp: Group { preferredSize:[65,20], alignment:['center','center'] }, \n\t\t\t\t\t\t\tcolorPickerBtn: IconButton { preferredSize:[12,7], alignment:['center','center'] } \n\t\t\t\t\t\t} \n\t\t\t\t\t} \n\t\t\t\t}, \n\t\t\t\tgr1: Panel { text:'" + utils.loc(connectLayers.ropeGrpName) + "', alignment:['fill','top'], \n\t\t\t\t\tgr11: Group { alignment:['fill','top'], \n\t\t\t\t\t\tautoBezierRb: RadioButton { text:'" + utils.loc(connectLayers.autoBezierRbName) + "', value:" + connectLayers.autoBezierRbVal + ", alignment:['left','top'] } \n\t\t\t\t\t}, \n\t\t\t\t\tgr12: Group { alignment:['fill','top'], \n\t\t\t\t\t\ttensionRb: RadioButton { text:'" + utils.loc(connectLayers.tensionRbName) + "', value:" + connectLayers.tensionRbVal + ", alignment:['left','top'] }, \n\t\t\t\t\t\ttensionEt: EditText { text:'" + connectLayers.tensionEtVal + "', preferredSize:[65,20], enabled:" + connectLayers.tensionRbVal + ", alignment:['right','top'] } \n\t\t\t\t\t}, \n\t\t\t\t\tgr13: Group { alignment:['fill','top'], \n\t\t\t\t\t\tclosedCb: Checkbox { text:'" + utils.loc(connectLayers.closedCbName) + "', value:" + connectLayers.closedCbVal + ", alignment:['left','top'] } \n\t\t\t\t\t} \n\t\t\t\t}, \n\t\t\t\tgr2: Panel { text:'" + utils.loc(connectLayers.triangulationGrpName) + "', alignment:['fill','top'], \n\t\t\t\t\tgr21: Group { alignment:['fill','top'], \n\t\t\t\t\t\tfillTrianglesCb: Checkbox { text:'" + utils.loc(connectLayers.fillTrianglesName) + "', value:" + connectLayers.fillTrianglesCbVal + ", alignment:['left','top'] } \n\t\t\t\t\t} \n\t\t\t\t\tgr22: Group { alignment:['fill','top'], orientation:'column', spacing:0, \n\t\t\t\t\t\tuseColorsFromLayerCb: Checkbox { text:'" + utils.loc(connectLayers.useColorsFromLayerCbName) + "', value:" + connectLayers.useColorsFromLayerCbVal + ", alignment:['left','top'] } \n\t\t\t\t\t\tgr221: Group { alignment:['fill','top'], orientation:'row', spacing:0, \n\t\t\t\t\t\t\tuseColorsFromLayerLst: DropDownList { preferredSize:[95,20], alignment:['fill','top'], enabled:" + connectLayers.useColorsFromLayerCbVal + " }, \n\t\t\t\t\t\t\trefreshBtn: Button { text:'" + utils.loc(connectLayers.refreshBtnName) + "', preferredSize:[65,20], alignment:['right','top'], enabled:" + connectLayers.useColorsFromLayerCbVal + " } \n\t\t\t\t\t\t} \n\t\t\t\t\t} \n\t\t\t\t} \n\t\t\t\tgr3: Group { \n\t\t\t\t\tokBtn: Button { text:'OK' } \n\t\t\t\t} \n\t\t\t};";
            optionsPal.gr = optionsPal.add(res);
            if (connectLayers.useColorsFromLayerId) {
                optionsPal.gr.gr2.gr22.gr221.useColorsFromLayerLst.selection = connectLayers.useColorsFromLayerId;
            }
            latestColorInt = 255 * (65536 * connectLayers.strokeColorClrVal[0] + 256 * connectLayers.strokeColorClrVal[1] + connectLayers.strokeColorClrVal[2]);
            optionsPal.gr.gr0.gr02.gr021.coloredGrp.graphics.backgroundColor = optionsPal.graphics.newBrush(optionsPal.graphics.BrushType.SOLID_COLOR, [connectLayers.strokeColorClrVal[0], connectLayers.strokeColorClrVal[1], connectLayers.strokeColorClrVal[2], 1]);
            populateLst();
            optionsPal.gr.gr0.gr01.strokeWidthEt.onChange = function() {
                if (isNaN(parseFloat(this.text))) this.text = 1;
                connectLayers.strokeWidthEtVal = parseFloat(this.text);
            };
            optionsPal.gr.gr0.gr02.gr021.colorPickerBtn.onClick = function() {
                var r, g, b, c;
                this.value = false;
                c = $.colorPicker(latestColorInt);
                if (c == -1) return;
                r = ((c >> 16) & 255) / 255;
                g = ((c >> 8) & 255) / 255;
                b = (c & 255) / 255;
                latestColorInt = c;
                optionsPal.gr.gr0.gr02.gr021.coloredGrp.graphics.backgroundColor = optionsPal.graphics.newBrush(pal.graphics.BrushType.SOLID_COLOR, [r, g, b, 1]);
                connectLayers.strokeColorClrVal = [r, g, b];
            };
            optionsPal.gr.gr1.gr11.autoBezierRb.onClick = function() {
                connectLayers.autoBezierRbVal = this.value;
                connectLayers.tensionRbVal = !this.value;
                optionsPal.gr.gr1.gr12.tensionRb.value = !this.value;
                optionsPal.gr.gr1.gr12.tensionEt.enabled = !this.value;
            };
            optionsPal.gr.gr1.gr12.tensionRb.onClick = function() {
                connectLayers.autoBezierRbVal = !this.value;
                connectLayers.tensionRbVal = this.value;
                optionsPal.gr.gr1.gr11.autoBezierRb.value = !this.value;
                optionsPal.gr.gr1.gr12.tensionEt.enabled = this.value;
            };
            optionsPal.gr.gr1.gr12.tensionEt.onChange = function() {
                if (isNaN(parseFloat(this.text))) this.text = 0;
                connectLayers.tensionEtVal = parseInt(this.text) / 200;
            };
            optionsPal.gr.gr1.gr13.closedCb.onClick = function() {
                connectLayers.closedCbVal = this.value;
            };
            optionsPal.gr.gr2.gr21.fillTrianglesCb.onClick = function() {
                connectLayers.fillTrianglesCbVal = this.value;
                if (!this.value) {
                    optionsPal.gr.gr2.gr22.useColorsFromLayerCb.value = false;
                    optionsPal.gr.gr2.gr22.gr221.useColorsFromLayerLst.enabled = false;
                    optionsPal.gr.gr2.gr22.gr221.refreshBtn.enabled = false;
                    connectLayers.fillTrianglesCbVal = false;
                }
            };
            optionsPal.gr.gr2.gr22.useColorsFromLayerCb.onClick = function() {
                this.parent.gr221.useColorsFromLayerLst.enabled = this.value;
                this.parent.gr221.refreshBtn.enabled = this.value;
                connectLayers.useColorsFromLayerCbVal = this.value;
                if (this.value) {
                    optionsPal.gr.gr2.gr21.fillTrianglesCb.value = true;
                    connectLayers.fillTrianglesCbVal = true;
                }
            };
            optionsPal.gr.gr2.gr22.gr221.useColorsFromLayerLst.onChange = function() {
                connectLayers.useColorsFromLayerId = this.selection.index + 1;
            };
            optionsPal.gr.gr2.gr22.gr221.refreshBtn.onClick = function() {
                var comp;
                comp = app.project.activeItem;
                if (comp && (comp instanceof CompItem)) {
                    populateLst();
                    if (optionsPal.gr.gr2.gr22.gr221.useColorsFromLayerLst.items.length) {
                        optionsPal.gr.gr2.gr22.gr221.useColorsFromLayerLst.selection = 0;
                    }
                }
                else {
                    utils.throwErr(selCompErr);
                }
            };
            optionsPal.gr.gr3.okBtn.onClick = function() {
                optionsPal.close();
            };
            optionsPal.center();
            optionsPal.show();
            connectLayers.optionsPal = optionsPal;
        };
        pal.gr.gr2.ropeBtn.onClick = function() {
            connectLayers.doRope();
        };
        pal.gr.gr2.treeBtn.onClick = function() {
            connectLayers.doTree();
        };
        pal.gr.gr2.triangulationBtn.onClick = function() {
            connectLayers.doTriangulation();
        };
        if (pal instanceof Window) {
            pal.center();
            pal.show();
        }
        else {
            pal.layout.layout(true);
        }
    };
    this.doRope = function() {
        new Rope(this.strokeWidthEtVal, this.strokeColorClrVal, this.autoBezierRbVal, this.tensionRbVal, this.tensionEtVal, this.closedCbVal, this.pgsBr).run();
    };
    this.doTree = function() {
        new SpanningTree(this.strokeWidthEtVal, this.strokeColorClrVal, this.pgsBr).run();
    };
    this.doTriangulation = function() {
        new DelaunayTriangulation(this.strokeWidthEtVal, this.strokeColorClrVal, this.fillTrianglesCbVal, this.useColorsFromLayerCbVal, this.useColorsFromLayerId, this.pgsBr).run();
    };
    this.run = function(thisObj) {
        this.buildUI(thisObj);
    };
}
function Rope(strokeWidth, strokeColor, autoBezier, customTension, tensionFactor, isClosed, pgsBr) {
    var simpleConnection, utils;
    simpleConnection = this;
    utils = new ConnectLayersUtils();
    this.epsilon = 0.001;
    this.createJoints = function(comp, layers) {
        var i, stroke, layer, strokeColorProp, strokeWidthProp, j, start, end, t, str, path, step, shapes, keyTimes, isSafeB, pt, verts, shape, inTangents, outTangents, u, shapeLayer, rootVectorsGroup, shapeProp;
        start = comp.workAreaStart;
        end = start + comp.workAreaDuration;
        step = comp.frameDuration;
        shapes = [];
        keyTimes = [];
        pgsBr.minvalue = 0;
        pgsBr.maxvalue = Math.floor(((end - this.epsilon) - start) / step);
        pgsBr.value = 0;
        isSafeB = true;
        if (((end - start) * layers.length) > 100) {
            str = {
                en: "The script is going to create many keyframes, and this operation might be slow. Note that comp work area is taken into account when keyframing. Would you like to continue ?",
                fr: "Le script s'appr\xeate \xe0 cr\xe9er de nombreuses images cl\xe9s et cette op\xe9ration pourrait \xeatre longue. Notez que la zone de travail est prise en compte lors de la cr\xe9ation de cl\xe9s. Souhaitez-vous continuer ?"
            };
            isSafeB = confirm(utils.loc(str));
            if (!isSafeB) {
                return;
            }
        }
        for (t = start; t <= (end - this.epsilon); t += step) {
            pgsBr.value++;
            try {
                if (pgsBr.parent.parent.parent instanceof Window) pgsBr.parent.parent.parent.update();
                writeLn("Frame " + pgsBr.value + "/" + pgsBr.maxvalue);
            }
            catch (e) {}
            verts = [];
            for (i = 0; i < layers.length; i = i + 1) {
                layer = layers[i];
                pt = toWorld(layer, layer.anchorPoint.valueAtTime(t, false), t);
                verts.push([pt[0], pt[1]]);
            }
            keyTimes.push(t);
            shape = new Shape();
            shape.vertices = verts;
            if (customTension) {
                inTangents = [];
                outTangents = [];
                if (!isClosed) {
                    inTangents.push([0, 0]);
                    outTangents.push([0, 0]);
                }
                else {
                    u = verts[1] - verts[verts.length - 1];
                    inTangents.push(-tensionFactor * u);
                    outTangents.push(tensionFactor * u);
                }
                for (j = 1; j < verts.length - 1; j = j + 1) {
                    u = verts[j + 1] - verts[j - 1];
                    inTangents.push(-tensionFactor * u);
                    outTangents.push(tensionFactor * u);
                }
                if (!isClosed) {
                    inTangents.push([0, 0]);
                    outTangents.push([0, 0]);
                }
                else {
                    u = verts[0] - verts[verts.length - 2];
                    inTangents.push(-tensionFactor * u);
                    outTangents.push(tensionFactor * u);
                }
                shape.inTangents = inTangents;
                shape.outTangents = outTangents;
            }
            else if (autoBezier) {
                inTangents = [];
                for (j = 0; j < verts.length; j = j + 1) {
                    inTangents.push([this.epsilon, this.epsilon]);
                }
                shape.inTangents = inTangents;
            }
            shape.closed = isClosed;
            shapes.push(shape);
        }
        shapeLayer = comp.layers.addShape();
        shapeLayer.name = ("Rope  [" + (100000 * Math.random()).toFixed(0)) + "]";
        rootVectorsGroup = shapeLayer.property("ADBE Root Vectors Group");
        path = rootVectorsGroup.addProperty("ADBE Vector Shape - Group");
        shapeProp = path.property("ADBE Vector Shape");
        shapeProp.setValuesAtTimes(keyTimes, shapes);
        if (autoBezier) {
            path.selected = true;
            app.executeCommand(app.findMenuCommandId("RotoBezier"));
        }
        stroke = rootVectorsGroup.addProperty("ADBE Vector Graphic - Stroke");
        strokeColorProp = stroke.property("ADBE Vector Stroke Color");
        strokeColorProp.setValue(strokeColor);
        strokeWidthProp = stroke.property("ADBE Vector Stroke Width");
        strokeWidthProp.setValue(strokeWidth);
        shapeLayer.position.setValue([0, 0]);
        pgsBr.value = 0;
    };
    this.run = function() {
        var comp, i, areLayers2D, layers, err;
        comp = app.project.activeItem;
        err = {
            en: "选择至少两层。",
            fr: "S\xe9lectionez au moins deux calques"
        };
        if (!comp || !(comp instanceof CompItem)) {
            utils.throwErr(err);
            return;
        }
        layers = comp.selectedLayers;
        if (layers.length < 2) {
            utils.throwErr(err);
            return;
        }
        err = {
            en: "选定的图层必须是2D图层。",
            fr: "Les calques s\xe9lectionn\xe9s doivent \xeatre des calques 2D."
        };
        areLayers2D = true;
        for (i = 0; areLayers2D && (i < layers.length); i++) {
            if (layers[i].threeDLayer) {
                areLayers2D = false;
            }
        }
        if (!areLayers2D) {
            utils.throwErr(err);
            return;
        }
        try {
            app.beginUndoGroup("Rope");
            this.createJoints(comp, layers);
            app.endUndoGroup();
        }
        catch (e) {
            alert(e);
        }
    };
}
function DelaunayTriangulation(strokeWidth, strokeColor, fillTrianglesB, useColorsFromLayerB, useColorsFromLayerId, pgsBr) {
    var utils;
    utils = new ConnectLayersUtils();
    this.pts = [];
    this.Triangle = function(a, b, c) {
        var E, A, B, C, D, F, G, minx, miny, dx, dy; {
            this.a = a;
            this.b = b;
            this.c = c; {
                A = b.x - a.x;
                B = b.y - a.y;
                C = c.x - a.x;
                D = c.y - a.y;
                E = (A * (a.x + b.x)) + (B * (a.y + b.y));
                F = (C * (a.x + c.x)) + (D * (a.y + c.y));
                G = 2 * ((A * (c.y - b.y)) - (B * (c.x - b.x)));
            }
            if (Math.abs(G) < 0.000001) {
                minx = Math.min(a.x, b.x, c.x);
                miny = Math.min(a.y, b.y, c.y);
                dx = (Math.max(a.x, b.x, c.x) - minx) * 0.5;
                dy = (Math.max(a.y, b.y, c.y) - miny) * 0.5;
                this.x = minx + dx;
                this.y = miny + dy;
                this.r = (dx * dx) + (dy * dy);
            }
            else {
                this.x = ((D * E) - (B * F)) / G;
                this.y = ((A * F) - (C * E)) / G;
                dx = this.x - a.x;
                dy = this.y - a.y;
                this.r = (dx * dx) + (dy * dy);
            }
        }
    };
    this.byX = function(a, b) {
        return b.x - a.x;
    };
    this.dedup = function(edges) {
        var m, i, j, a, b, n;
        j = edges.length;
        outer: while (j) {
            b = edges[--j];
            a = edges[--j];
            i = j;
            while (i) {
                n = edges[--i];
                m = edges[--i];
                if (((a === m) && (b === n)) || ((a === n) && (b === m))) {
                    edges.splice(j, 2);
                    edges.splice(i, 2);
                    j -= 2;
                    continue outer;
                }
            }
        }
    };
    this.triangulate = function(vertices) {
        var xmid, ymid, i, j, open, dx, dy, a, b, closed, edges, xmin, xmax, ymin, ymax, dmax;
        if (vertices.length < 3) return [];
        vertices.sort(this.byX); {
            i = vertices.length - 1;
            xmin = vertices[i].x;
            xmax = vertices[0].x;
            ymin = vertices[i].y;
            ymax = ymin;
        }
        while (i--) {
            if (vertices[i].y < ymin) ymin = vertices[i].y;
            if (vertices[i].y > ymax) ymax = vertices[i].y;
        } {
            dx = xmax - xmin;
            dy = ymax - ymin;
            dmax = (dx > dy) ? dx : dy;
            xmid = (xmax + xmin) * 0.5;
            ymid = (ymax + ymin) * 0.5;
            open = [new this.Triangle({
                x: xmid - (20 * dmax),
                y: ymid - dmax,
                __sentinel: true
            }, {
                x: xmid,
                y: ymid + (20 * dmax),
                __sentinel: true
            }, {
                x: xmid + (20 * dmax),
                y: ymid - dmax,
                __sentinel: true
            })];
            closed = [];
            edges = [];
        }
        i = vertices.length;
        while (i--) {
            edges.length = 0;
            j = open.length;
            while (j--) {
                dx = vertices[i].x - open[j].x;
                if ((dx > 0) && ((dx * dx) > open[j].r)) {
                    closed.push(open[j]);
                    open.splice(j, 1);
                    continue;
                }
                dy = vertices[i].y - open[j].y;
                if (((dx * dx) + (dy * dy)) > open[j].r) continue;
                edges.push(open[j].a, open[j].b, open[j].b, open[j].c, open[j].c, open[j].a);
                open.splice(j, 1);
            }
            this.dedup(edges);
            j = edges.length;
            while (j) {
                b = edges[--j];
                a = edges[--j];
                open.push(new this.Triangle(a, b, vertices[i]));
            }
        }
        Array.prototype.push.apply(closed, open);
        i = closed.length;
        while (i--)
        if ((closed[i].a.__sentinel || closed[i].b.__sentinel) || closed[i].c.__sentinel) closed.splice(i, 1);
        return closed;
    };
    this.findLayerFromPoint = function(layers, point) {
        var i, layer, layerPos;
        for (i = 0; i < layers.length; i = i + 1) {
            layer = layers[i];
            layerPos = this.pts[i];
            if ((Math.abs(layerPos[0] - point.x) < 0.005) && (Math.abs(layerPos[1] - point.y) < 0.005)) {
                return layer;
            }
        }
    };
    this.containsEdge = function(edgeArray, edge) {
        var i, isIn;
        isIn = false;
        for (i = 0; !isIn && (i < edgeArray.length); i++) {
            if (((edgeArray[i][0] == edge[0]) && (edgeArray[i][1] == edge[1])) || ((edgeArray[i][0] == edge[1]) && (edgeArray[i][1] == edge[0]))) {
                isIn = true;
            }
        }
        return isIn;
    };
    this.createJoints = function(comp, layers) {
        var i, layer, start, end, str, err, triangles, useColorsFromLayerName, pt, isSafeB, tabuEdges, tri, layerA, layerB, layerC, e1, e2, e3, vertices;
        this.pts = [];
        vertices = new Array(layers.length);
        for (i = 0; i < layers.length; i = i + 1) {
            layer = layers[i];
            pt = toWorld(layer, layer.anchorPoint.valueAtTime(comp.time, false), comp.time);
            this.pts.push(pt);
            vertices[i] = {
                x: pt[0],
                y: pt[1]
            };
        }
        if (vertices.length == 2) {
            utils.createJoint(comp, layers[0].name, layers[1].name);
        }
        else {
            triangles = this.triangulate(vertices);
            if (triangles.length == 0) {
                err = {
                    en: "对选定的图层（对齐的图层？）进行三角连线时发生错误。",
                    fr: "Une erreur est survenue lors de la triangulation des calques s\xe9lectionn\xe9s (calques align\xe9s ?)"
                };
                utils.throwErr(err);
                return;
            }
            pgsBr.minvalue = 0;
            pgsBr.maxvalue = triangles.length;
            pgsBr.value = 0;
            if (fillTrianglesB) {
                isSafeB = true;
                start = comp.workAreaStart;
                end = start + comp.workAreaDuration;
                if (((end - start) * layers.length) > 100) {
                    str = {
                        en: "该脚本将创建许多关键帧，并且此操作可能很慢。 请注意，在进行关键帧设置时会考虑到comp工作区。 你想继续吗 ？",
                        fr: "Le script s'appr\xeate \xe0 cr\xe9er de nombreuses images cl\xe9s et cette op\xe9ration pourrait \xeatre longue. Notez que la zone de travail est prise en compte lors de la cr\xe9ation de cl\xe9s. Souhaitez-vous continuer ?"
                    };
                    isSafeB = confirm(utils.loc(str));
                    if (!isSafeB) {
                        return;
                    }
                }
            }
            tabuEdges = [];
            for (i = 0; i < triangles.length; i = i + 1) {
                pgsBr.value++;
                try {
                    if (pgsBr.parent.parent.parent instanceof Window) pgsBr.parent.parent.parent.update();
                    writeLn("Triangle " + pgsBr.value + "/" + pgsBr.maxvalue);
                }
                catch (e) {}
                tri = triangles[i];
                layerA = this.findLayerFromPoint(layers, tri.a);
                layerB = this.findLayerFromPoint(layers, tri.b);
                layerC = this.findLayerFromPoint(layers, tri.c);
                if (fillTrianglesB) {
                    if (i == 0) {
                        useColorsFromLayerName = useColorsFromLayerB ? comp.layer(useColorsFromLayerId).name : null;
                    }
                    utils.createTriangle(strokeWidth, strokeColor, useColorsFromLayerB, useColorsFromLayerName, comp, layerA, layerB, layerC);
                }
                else {
                    e1 = [layerA.name, layerB.name];
                    e2 = [layerB.name, layerC.name];
                    e3 = [layerC.name, layerA.name];
                    if (!this.containsEdge(tabuEdges, e1)) {
                        utils.createJoint(strokeWidth, strokeColor, comp, layerA.name, layerB.name);
                        tabuEdges.push(e1);
                    }
                    if (!this.containsEdge(tabuEdges, e2)) {
                        utils.createJoint(strokeWidth, strokeColor, comp, layerB.name, layerC.name);
                        tabuEdges.push(e2);
                    }
                    if (!this.containsEdge(tabuEdges, e3)) {
                        utils.createJoint(strokeWidth, strokeColor, comp, layerC.name, layerA.name);
                        tabuEdges.push(e3);
                    }
                }
            }
            pgsBr.value = 0;
        }
    };
    this.run = function() {
        var comp, layers, err;
        comp = app.project.activeItem;
        err = {
            en: "选择至少两层。",
            fr: "S\xe9lectionez au moins deux calques"
        };
        if (!comp || !(comp instanceof CompItem)) {
            utils.throwErr(err);
            return;
        }
        layers = comp.selectedLayers;
        if (layers.length < 2) {
            utils.throwErr(err);
            return;
        }
        utils.autoRenameLayers(comp);
        try {
            app.beginUndoGroup("Delaunay Triangulation");
            this.createJoints(comp, layers);
            app.endUndoGroup();
        }
        catch (e) {
            alert(e);
        }
    };
}

function SpanningTree(strokeWidth, strokeColor, pgsBr) {
    var spanningTree, utils;
    spanningTree = this;
    utils = new ConnectLayersUtils();
    this.getLength = function(u) {
        {
            return Math.sqrt(u.x * u.x + u.y * u.y + u.z * u.z);
        }
    };
    this.Point = function(x, y, z, name) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.name = name;
    };
    this.Edge = function(a, b) {
        this.a = a;
        this.b = b;
        this.cost = spanningTree.getLength(new spanningTree.Point(b.x - a.x, b.y - a.y, b.z - a.z, ""));
    };
    this.byCost = function(e1, e2) {
        return e1.cost - e2.cost;
    };
    this.contain = function(component, name) {
        var i, found;
        found = false;
        for (i = 0; !found && (i < component.length); i++) {
            if (component[i].name == name) {
                found = true;
            }
        }
        return found;
    };
    this.doesEdgeConnectTwoDifferentComponents = function(components, edge) {
        var connectB, i, component;
        connectB = false;
        for (i = 0; !connectB && (i < components.length); i++) {
            component = components[i];
            if ((this.contain(component, edge.a.name) && !this.contain(component, edge.b.name)) || (!this.contain(component, edge.a.name) && this.contain(component, edge.b.name))) {
                connectB = true;
            }
        }
        return connectB;
    };
    this.getComponentIndexFromPoint = function(components, point) {
        var i, component, idx;
        idx = -1;
        for (i = 0;
        (idx == -1) && (i < components.length); i++) {
            component = components[i];
            if (this.contain(component, point.name)) {
                idx = i;
            }
        }
        return idx;
    };
    this.mergeComponents = function(components, edge) {
        var i, k, j;
        i = this.getComponentIndexFromPoint(components, edge.a);
        j = this.getComponentIndexFromPoint(components, edge.b);
        for (k = 0; k < components[j].length; k = k + 1) {
            components[i].push(components[j][k]);
        }
        components.splice(j, 1);
        return components;
    };
    this.createJoints = function(comp, layers) {
        var i, layer, tabuNodes, j, edge, pts, pt, p, tree, edges, component, n, components;
        n = layers.length;
        edges = [];
        pts = [];
        for (i = 0; i < n; i = i + 1) {
            layer = layers[i];
            p = toWorld(layer, layer.anchorPoint.valueAtTime(comp.time, false), comp.time);
            if (p.length == 2) p.push(0);
            pt = new this.Point(p[0], p[1], p[2], layer.name);
            pts.push(pt);
        }
        for (i = 0; i < n - 1; i = i + 1) {
            for (j = i + 1; j < n; j++) {
                edge = new this.Edge(pts[i], pts[j]);
                edges.push(edge);
            }
        }
        edges.sort(this.byCost);
        components = [];
        for (i = 0; i < n; i = i + 1) {
            component = [];
            component.push(pts[i]);
            components.push(component);
        }
        tree = [];
        tabuNodes = [];
        for (i = 0; i < edges.length; i = i + 1) {
            edge = edges[i];
            if (this.doesEdgeConnectTwoDifferentComponents(components, edge)) {
                tree.push(edge);
                components = this.mergeComponents(components, edge);
                if (tree.length == (n - 1)) break;
            }
        }
        pgsBr.minvalue = 0;
        pgsBr.maxvalue = tree.length;
        pgsBr.value = 0;
        for (i = 0; i < tree.length; i = i + 1) {
            pgsBr.value++;
            try {
                if (pgsBr.parent.parent.parent instanceof Window) pgsBr.parent.parent.parent.update();
                writeLn("Edge " + pgsBr.value + "/" + pgsBr.maxvalue);
            }
            catch (e) {}
            utils.createJoint(strokeWidth, strokeColor, comp, tree[i].a.name, tree[i].b.name);
        }
        pgsBr.value = 0;
    };
    this.run = function() {
        var comp, layers, err;
        comp = app.project.activeItem;
        err = {
            en: "选择至少两层。",
            fr: "S\xe9lectionez au moins deux calques"
        };
        if (!comp || !(comp instanceof CompItem)) {
            utils.throwErr(err);
            return;
        }
        layers = comp.selectedLayers;
        if (layers.length < 2) {
            utils.throwErr(err);
            return;
        }
        utils.autoRenameLayers(comp);
        try {
            app.beginUndoGroup("Spanning Tree");
            this.createJoints(comp, layers);
            app.endUndoGroup();
        }
        catch (e) {
            alert(e);
        }
    };
}

function ConnectLayersUtils() {
    var utils;
    utils = this;
    this.loc = function(str) {
        var localLang; {
            localLang = (parseFloat(app.version) < 9) ? $.locale : app.isoLanguage;
            return localLang.toLowerCase().match("fr") ? str.fr : str.en;
        }
    };
    this.throwErr = function(err) {
        alert(this.loc(err), "Script Error", true);
    };
    this.isInArray = function(array, element) {
        var i, found;
        found = false;
        for (i = 0; !found && (i < array.length); i++) {
            if (array[i] == element) found = true;
        }
        return found;
    };
    this.autoRenameLayers = function(comp) {
        var i, layers, j, elementsRenameMsg, originalNames, affectedIndices, reportInfo, msg;
        elementsRenameMsg = {
            en: "为避免混淆，脚本已通过在原始元素名称中添加适当数量的尾随空白字符来重命名以下元素：\r\r%s",
            fr: "Afin d'\xe9viter la confusion le script a renomm\xe9 les \xe9l\xe9ments suivants en ajoutant un nombre appropri\xe9 de caract\xe8res blanc \xe0 la fin du nom initial de l'\xe9l\xe9ment:\r\r"
        };
        layers = comp.layers;
        originalNames = new Array();
        affectedIndices = new Array();
        for (i = 1; i <= layers.length; i = i + 1)
        originalNames.push(layers[i].name);
        for (i = 1; i <= layers.length - 1; i = i + 1)
        for (j = i + 1; j <= layers.length; j++)
        if (layers[i].name == layers[j].name) {
            if (!this.isInArray(affectedIndices, j)) affectedIndices.push(j);
            layers[j].name += " ";
        }
        reportInfo = "";
        for (i = 0; i < affectedIndices.length; i = i + 1)
        reportInfo += ("\tLayer " + affectedIndices[i] + ": " + originalNames[affectedIndices[i] - 1] + "\r");
        if (reportInfo.length) {
            msg = elementsRenameMsg;
            msg.en = this.loc(msg).replace("%s", reportInfo);
            msg.fr = this.loc(msg).replace("%s", reportInfo);
        }
    };
    this.createJoint = function(strokeWidth, strokeColor, comp, layerAName, layerBName) {
        var stroke, strokeColorProp, strokeWidthProp, is3D, rootVectorsGrp, vectorGrp, rectPath, rectSizeProp, trim, trimEndProp, trimStartProp, shapeLayer;
        shapeLayer = comp.layers.addShape();
        shapeLayer.name = "Joint " + layerAName + " - " + layerBName;
        is3D = comp.layer(layerAName).threeDLayer && comp.layer(layerBName).threeDLayer;
        if (is3D) shapeLayer.threeDLayer = true;
        rootVectorsGrp = shapeLayer.property("ADBE Root Vectors Group");
        vectorGrp = rootVectorsGrp.addProperty("ADBE Vector Group");
        vectorGrp.name = "Joint";
        rectPath = vectorGrp.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect");
        rectPath.name = "Joint Path";
        rectSizeProp = rectPath.property("ADBE Vector Rect Size");
        rectSizeProp.expression = "strokeW = 1;\rL1 = thisComp.layer(\"" + layerAName + "\");\r" + "L2 = thisComp.layer(\"" + layerBName + "\");\r" + "p1 = L1.toWorld(L1.anchorPoint);\r" + "p2 = L2.toWorld(L2.anchorPoint);\r" + "dist = length(p2-p1);\r" + "[dist, strokeW];";
        stroke = vectorGrp.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
        stroke.name = "Stroke";
        strokeColorProp = stroke.property("ADBE Vector Stroke Color");
        strokeColorProp.setValue(strokeColor);
        strokeWidthProp = stroke.property("ADBE Vector Stroke Width");
        strokeWidthProp.setValue(strokeWidth);
        trim = vectorGrp.property("ADBE Vectors Group").addProperty("ADBE Vector Filter - Trim");
        trim.name = "Trim Path";
        trimEndProp = trim.property("ADBE Vector Trim End");
        trimEndProp.setValue(50);
        trimStartProp = trim.property("ADBE Vector Trim Start");
        trimStartProp.expression = "L = content(\"Joint\").content(\"Joint Path\").size[0];\rl = content(\"Joint\").content(\"Joint Path\").size[1];\r1e-6 + 100* (l / (2*(L+l)));";
        shapeLayer.anchorPoint.expression = "s = content(\"Joint\").content(\"Joint Path\").size;\r[-s[0]/2,0,0];";
        shapeLayer.position.expression = "L1 = thisComp.layer(\"" + layerAName + "\");\r" + "p1 = L1.toWorld(L1.anchorPoint);";
        if (is3D) {
            shapeLayer.orientation.expression = "function angleBetween(v1, v2)\r{\rvar n = length(v1) * length(v2);\rreturn n == 0 ? 0 : radiansToDegrees(Math.acos(clamp(dot(v1, v2), -1, 1) / n));\r}\rfunction toEuler(x, y, z, angle)\r{\rvar bank, heading, attitude; // rotx, roty, rotz\rvar s = Math.sin(angle);\rvar c = Math.cos(angle);\rvar t = 1-c;\rif ((x*y*t + z*s) > 0.9999)\r{\rheading = 2*Math.atan2(x*Math.sin(angle/2),Math.cos(angle/2));\rattitude = Math.PI/2;\rbank = 0;\r}\relse if ((x*y*t + z*s) < -0.9999)\r{\rheading = -2*Math.atan2(x*Math.sin(angle/2),Math.cos(angle/2));\rattitude = -Math.PI/2;\rbank = 0;\r}\relse\r{\rheading = Math.atan2(y * s- x * z * t , 1 - (y*y+ z*z ) * t);\rattitude = Math.asin(x * y * t + z * s);\rbank = Math.atan2(x * s - y * z * t , 1 - (x*x + z*z) * t);\r}\rreturn [bank, heading, attitude];\r}\rtry{\rL1 = thisComp.layer(\"" + layerAName + "\");\r" + "L2 = thisComp.layer(\"" + layerBName + "\");\r" + "compPar = thisComp.pixelAspect;\r" + "A = L1.toWorld(L1.anchorPoint);\r" + "B = L2.toWorld(L2.anchorPoint);\r" + "u = normalize(toWorldVec([1,0,0]));\r" + "temp = [ (B[0]-A[0])*compPar,  B[1]-A[1], B[2]-A[2] ];\r" + "v = normalize(temp);\r" + "angle = angleBetween(u,v);\r" + "axis = cross(u,v);\r" + "if (axis[0] == 0 && axis[1] == 0 && axis[2] == 0) axis = [0,1,0];\r" + "axis = normalize(axis);\r" + "rots = toEuler(axis[0],axis[1],axis[2], degreesToRadians(angle));\r" + "[0, radiansToDegrees(rots[1]), radiansToDegrees(rots[2])];\r" + "}\r" + "catch(e){ value; }";
        }
        else {
            shapeLayer.rotation.expression = "L1 = thisComp.layer(\"" + layerAName + "\");\r" + "L2 = thisComp.layer(\"" + layerBName + "\");\r" + "try\r" + "{\r" + "   p1 = L1.toWorld(L1.anchorPoint);\r" + "   p2 = L2.toWorld(L2.anchorPoint);\r" + "   u = p2-p1;\r" + "   a = Math.atan2(u[1],u[0]);\r" + "   radiansToDegrees(a);\r" + "}catch(e){value;}";
        }
    };
    this.createTriangle = function(strokeWidth, strokeColor, useColorsFromLayerB, useColorsFromLayerName, comp, layerA, layerB, layerC) {
        var strokeWidthProp, t, pos, is3D, contentGrp, shapeGrp, contentsGrp, pt3d, pt3dProp, pathGrp, pathProp, keyShapeValues, keyPosValues, startT, endT, v0, v1, v2, strokeGrp, fillGrp, fillColorProp, keyTimes, verts, shape, shapeLayer;
        is3D = (layerA.threeDLayer || layerB.threeDLayer) || layerC.threeDLayer;
        shapeLayer = comp.layers.addShape();
        shapeLayer.name = "Triangle  [" + (100000 * Math.random()).toFixed(0) + "]";
        shapeLayer.threeDLayer = is3D;
        if (is3D) {
            shapeLayer.orientation.expression = "LA = thisComp.layer(\"" + layerA.name + "\");\r" + "LB = thisComp.layer(\"" + layerB.name + "\");\r" + "LC = thisComp.layer(\"" + layerC.name + "\");\r" + "a = LA.toWorld(LA.anchorPoint);\r" + "b = LB.toWorld(LB.anchorPoint);\r" + "c = LC.toWorld(LC.anchorPoint);\r" + "n = cross(b-a, c-a);\r" + "lookAt(position,position+n);";
        }
        contentGrp = shapeLayer.property("ADBE Root Vectors Group");
        shapeGrp = contentGrp.addProperty("ADBE Vector Group");
        shapeGrp.name = "Triangle";
        contentsGrp = shapeGrp.property("ADBE Vectors Group");
        pt3d = shapeLayer.Effects.addProperty("ADBE Point3D Control");
        pt3dProp = pt3d.property(1);
        pathGrp = contentsGrp.addProperty("ADBE Vector Shape - Group");
        pathProp = pathGrp.property("ADBE Vector Shape");
        keyTimes = [];
        keyShapeValues = [];
        keyPosValues = [];
        startT = comp.workAreaStart;
        endT = (comp.workAreaStart + comp.workAreaDuration) + 0.005;
        for (t = startT; t < endT; t += comp.frameDuration) {
            shapeLayer.position.expression = "LA = thisComp.layer(\"" + layerA.name + "\");\r" + "LB = thisComp.layer(\"" + layerB.name + "\");\r" + "LC = thisComp.layer(\"" + layerC.name + "\");\r" + "a = LA.toWorld(LA.anchorPoint);\r" + "b = LB.toWorld(LB.anchorPoint);\r" + "c = LC.toWorld(LC.anchorPoint);\r" + "(a + b + c) / 3;";
            pos = shapeLayer.position.valueAtTime(t, false);
            shape = new Shape();
            verts = [];
            pt3dProp.expression = "L = thisComp.layer(\"" + layerA.name + "\");\r" + "fromWorld(L.toWorld(L.anchorPoint));";
            v0 = pt3dProp.valueAtTime(t, false);
            v0.pop();
            pt3dProp.expression = "L = thisComp.layer(\"" + layerB.name + "\");\r" + "fromWorld(L.toWorld(L.anchorPoint));";
            v1 = pt3dProp.valueAtTime(t, false);
            v1.pop();
            pt3dProp.expression = "L = thisComp.layer(\"" + layerC.name + "\");\r" + "fromWorld(L.toWorld(L.anchorPoint));";
            v2 = pt3dProp.valueAtTime(t, false);
            v2.pop();
            verts.push(v0);
            verts.push(v1);
            verts.push(v2);
            shape.vertices = verts;
            shape.closed = true;
            keyTimes.push(t);
            keyShapeValues.push(shape);
            keyPosValues.push(pos);
        }
        pt3d.remove();
        shapeLayer.position.expression = "";
        shapeLayer.position.setValuesAtTimes(keyTimes, keyPosValues);
        pathProp.setValuesAtTimes(keyTimes, keyShapeValues);
        strokeGrp = contentsGrp.addProperty("ADBE Vector Graphic - Stroke");
        strokeWidthProp = strokeGrp.property("ADBE Vector Stroke Width");
        strokeWidthProp.setValue(strokeWidth);
        fillGrp = contentsGrp.addProperty("ADBE Vector Graphic - Fill");
        fillColorProp = fillGrp.property("ADBE Vector Fill Color");
        if (useColorsFromLayerB) {
            fillColorProp.expression = "L = thisComp.layer(\"" + useColorsFromLayerName + "\");\r" + "pt = L.fromCompToSurface(toWorld(anchorPoint));\r" + "L.sampleImage(pt);";
        }
        else {
            fillColorProp.setValue(strokeColor);
        }
    };
    this.createAboutDlg = function(aboutStr, usageStr) {
        var dlg = new Window("dialog", "About");
        var res = "group { orientation:'column', alignment:['fill','fill'], alignChildren:['fill','fill'], \
			pnl: Panel { type:'tabbedpanel', \
				aboutTab: Panel { type:'tab', text:'描述', \
					aboutEt: EditText { text:'" + this.loc(aboutStr) + "', preferredSize:[360,200], properties:{multiline:true} } \
				}, \
				usageTab: Panel { type:'tab', text:'教程', \
					usageEt: EditText { text:'" + this.loc(usageStr) + "', preferredSize:[360,200], properties:{multiline:true} } \
				} \
			}, \
			btns: Group { orientation:'row', alignment:['fill','bottom'], \
				otherScriptsBtn: Button { text:'更多脚本', alignment:['left','center'] }, \
				okBtn: Button { text:'明白了', alignment:['right','center'] } \
			} \
		}";
        dlg.gr = dlg.add(res);
        dlg.gr.pnl.aboutTab.aboutEt.onChange = dlg.gr.pnl.aboutTab.aboutEt.onChanging = function() {
            this.text = utils.loc(aboutStr).replace(/\\r/g, '\r');
        };
        dlg.gr.pnl.usageTab.usageEt.onChange = dlg.gr.pnl.usageTab.usageEt.onChanging = function() {
            this.text = utils.loc(usageStr).replace(/\\r/g, '\r').replace(/\\'/g, "'");
        };
        dlg.gr.btns.otherScriptsBtn.onClick = function() {
            var cmd = "";
            var url = "https://www.wanvfx.com";
            if ($.os.indexOf("Win") != -1) {
                if (File("C:/Program Files/Mozilla Firefox/firefox.exe").exists) cmd += "C:/Program Files/Mozilla Firefox/firefox.exe " + url;
                else if (File("C:/Program Files (x86)/Mozilla Firefox/firefox.exe").exists) cmd += "C:/Program Files (x86)/Mozilla Firefox/firefox.exe " + url;
                else cmd += "C:/Program Files/Internet Explorer/iexplore.exe " + url;
            }
            else cmd += "open \"" + url + "\"";
            try {
                system.callSystem(cmd);
            }
            catch (e) {
                alert(e);
            }
        };
        dlg.gr.btns.okBtn.onClick = function() {
            dlg.close();
        };
        dlg.center();
        dlg.show();
    };
}

function toWorld(layer, point, time) {
    // returns the given angle in radians
    function degToRad(deg) {
        return deg * Math.PI / 180;
    }
    // returns cosinus of the given angle (in radians)
    function c(angle) {
        return Math.cos(angle);
    }
    // returns sinus of the given angle (in radians)
    function s(angle) {
        return Math.sin(angle);
    }
    // returns 3D vector filled with the given elements
    function vec3(v0, v1, v2) {
        var v = new Array(3);
        v[0] = v0,
        v[1] = v1;
        v[2] = v2;
        return v;
    }
    // returns 3x3 matrix filled with the given elements
    function matrix3(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
        var M = new Array(3);
        M[0] = new Array(3);
        M[1] = new Array(3);
        M[2] = new Array(3);
        M[0][0] = m00;
        M[0][1] = m01;
        M[0][2] = m02;
        M[1][0] = m10;
        M[1][1] = m11;
        M[1][2] = m12;
        M[2][0] = m20;
        M[2][1] = m21;
        M[2][2] = m22;
        return M;
    }
    // returns 3D vector obtained by multiplying components of the two given vectors
    function multVec3Vec3(v1, v2) {
        return vec3(v1[0] * v2[0], v1[1] * v2[1], v1[2] * v2[2]);
    }
    // returns 3D vector obtained by multiplying the given 3x3 matrix by the given 3D vector
    function multMat3Vec3(M, v) {
        var v0 = M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2];
        var v1 = M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2];
        var v2 = M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2];
        return vec3(v0, v1, v2);
    }
    // returns 3x3 matrix obtained by multiplying the two given 3x3 matrices
    function multMat3Mat3(M1, M2) {
        var M3 = matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
        for (var i = 0; i < 3; i++)
        for (var j = 0; j < 3; j++)
        for (var k = 0; k < 3; k++) {
            M3[i][j] += M1[i][k] * M2[k][j];
        }
        return M3;
    }
    // returns 3D point obtained by rotating the given point about the x-axis
    function rotatePointAboutX(p, angle) {
        var newp = p;
        var a = degToRad(angle);
        if (a != 0) {
            newp = multMat3Vec3(matrix3(1, 0, 0, 0, c(a), -s(a), 0, s(a), c(a)), p);
        }
        return newp;
    }
    // returns 3D point obtained by rotating the given point about the y-axis
    function rotatePointAboutY(p, angle) {
        var newp = p;
        var a = degToRad(angle);
        if (a != 0) {
            newp = multMat3Vec3(matrix3(c(a), 0, s(a), 0, 1, 0, -s(a), 0, c(a)), p);
        }
        return newp;
    }
    // returns 3D point obtained by rotating the given point about the z-axis
    function rotatePointAboutZ(p, angle) {
        var newp = p;
        var a = degToRad(angle);
        if (a != 0) {
            newp = multMat3Vec3(matrix3(c(a), -s(a), 0, s(a), c(a), 0, 0, 0, 1), p);
        }
        return newp;
    }
    // returns 3D point obtained by rotating the given point about the x/y/z-axis
    function rotatePointAboutXYZ(p, angleX, angleY, angleZ) {
        var newp = p;
        if (angleZ != 0) {
            newp = rotatePointAboutZ(newp, angleZ);
        }
        if (angleY != 0) {
            newp = rotatePointAboutY(newp, angleY);
        }
        if (angleX != 0) {
            newp = rotatePointAboutX(newp, angleX);
        }
        return newp;
    }
    // returns 3D point obtained by rotating the given point about the x/y/z-axis
    function orientPointAboutXYZ(p, ori) {
        return rotatePointAboutXYZ(p, ori[0], ori[1], ori[2]);
    }
    // returns pixel aspect ratio of the given layer
    function getPar(layer) {
        var par = layer.source ? layer.source.pixelAspect : 1;
        if (layer.adjustmentLayer) {
            par = layer.containingComp.pixelAspect;
        }
        return par;
    }
    // returns accurate value of the given pixel aspect ratio
    function getAccurate(par) {
        var accPar;
        switch (par) {
        case 0.9:
            accPar = 0.9;
            break;
        case 1:
            accPar = 1;
            break;
        case 1.07:
            accPar = 1.066666666666667;
            break;
        case 1.2:
            accPar = 1.2;
            break;
        case 1.33:
            accPar = 1.333333333333333;
            break;
        case 1.42:
            accPar = 1.422222222222222;
            break;
        case 1.5:
            accPar = 1.5;
            break;
        case 2:
            accPar = 2;
            break;
        default:
            accPar = 1;
            break;
        }
        return accPar;
    }
    // returns value of the given transform property (post-expression value)
    function getTransValueAtCompTime(layer, transName) {
        return layer.property(transName).valueAtTime(time, false);
    }
    function getResult() {
        // retrieves layer transforms
        var anc = getTransValueAtCompTime(layer, "anchorPoint");
        var pos = getTransValueAtCompTime(layer, "position");
        var sca = getTransValueAtCompTime(layer, "scale");
        var ori = getTransValueAtCompTime(layer, "orientation");
        var rox = getTransValueAtCompTime(layer, "rotationX");
        var roy = getTransValueAtCompTime(layer, "rotationY");
        var roz = getTransValueAtCompTime(layer, "rotationZ");
        var pPar = getAccurate(layer.parent ? getPar(layer.parent) : layer.containingComp.pixelAspect);
        var lPar = getAccurate(getPar(layer));
        var ratio = lPar / pPar;
        // initializes resulting point
        var newp = point;
        // compensates anchor point
        newp -= anc;
        // scales according to pixel aspect ratio
        newp = multVec3Vec3(newp, vec3(ratio * (sca[0] / 100), sca[1] / 100, sca[2] / 100));
        newp = multVec3Vec3(newp, vec3(pPar, 1, 1));
        // rotates
        newp = rotatePointAboutXYZ(newp, rox, roy, roz);
        newp = orientPointAboutXYZ(newp, ori);
        // scales back
        newp = multVec3Vec3(newp, vec3(1 / pPar, 1, 1));
        // translates
        newp += pos;
        // reccurse if layer has parent
        if (layer.parent) {
            newp = toWorld(layer.parent, newp, time);
        }
        return newp;
    }
    return getResult();
}
new ConnectLayers().run(this);