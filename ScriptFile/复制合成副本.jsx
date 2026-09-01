/* 

名称: 复制合成副本
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



var tcd_scriptName = "复制合成脚本";
var tcd_version = "3.9.11";
var tcd_folderNameDef = "Duplicated Comps";
var tcd_strHelpHeader = tcd_scriptName + " v" + tcd_version;
var tcd_strHelpText = "使用说明：\n\n脚本原名：True Comp Duplicator，这个脚本可以复制所选合成，层次结构的完整副本，包括子合成.\n\n如果合成被多次使用，则合成仅重复一次，所有剩余引用都指向第一个重复项.\n\n如果合成被安排在项目面板中的特殊文件夹层次结构中，则该文件夹层次结构将保留或复制（取决于用户首选项），以便复制合成.\n\n此版本为您节省更多的时间，通过在复制过程中添加更大的控制权.\n\n- 新项目命名\n- 您可以将前缀或后缀添加到重复项目的名称.\n\t这包括合成、文件夹和素材.\n- 您可以搜索，并在复制项目的名称替换文本.\n\t注意：搜索字符串不区分大小写.\n\n- 选项\n- 将复制的项目分组到具有指定名称的新文件夹中.\n- 排除其名称包含提供的前缀/后缀的项.\n\t这允许您仅复制一些嵌套的合成/素材.\n- 复制过程的深度限制.\n- 更新表达式，并更改由\n\t复制过程。注意：更新表达式时,\n\t仅更新以下项目引用.\n      comp(\"DUPLICATE ITEM'S NAME\")\n      comp(\"DUPLICATE ITEM'S NAME\").layer(\"DUPLICATE ITEM'S NAME\")\n      thisComp.layer(\"DUPLICATE ITEM'S NAME\")\n- 复制素材将复制项目面板中的素材引用.\n\t然后，您可以右键单击并替换重复的素材\n\t视频不同的素材/视频.\n\t注意：这实际上不会复制硬盘上的项目,\n\t只是他们在项目中的引用。这将不会复制纯色图层,\n\t调整图层或空对象.\n\n- 复制纯色图层将复制合成中使用的纯色图层.\n\n- 选择复制将在复制后选择新的顶级副本.\n\n- 您还可以指定要制作的副本数量.\n注意：每个副本名称中的最后一个数字将自动递增。如果没有数字，将添加一个数字.\
\n- 此版本的脚本需要After Effects CS3 或更高版本。它可以通过将脚本放在Script文件夹的ScriptUI文件夹中，然后从窗口菜单中选择此脚本，将其用作可停靠面板.\
\n2020年6月  视效网wanvfx.com汉化...";
var previousComps = [];
var previousFolders = [];
var previousFootage = [];
var tcd_prefsToSave = [];
var tcd_expFixCount = 0;
if (typeof String.prototype.startsWith != "function") {
    String.prototype.startsWith = function(str) {
        return this.indexOf(str) == 0;
    };
}
if (typeof String.prototype.endsWith != "function") {
    String.prototype.endsWith = function(str) {
        return this.slice(-str.length) == str;
    };
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function tcd_getColorNames() {
    var colors = [];
    var prefKeyBase = "Label Preference Text Section ";
    var prefKey = null;
    for (var i = 1; i <= 10; i += 1) {
        var newPrefKey = prefKeyBase + i;
        if (parseFloat(app.version) >= 12) {
            if (app.preferences.havePref(newPrefKey, "Label Text ID 2 # 1", PREFType.PREF_Type_MACHINE_INDEPENDENT)) {
                prefKey = newPrefKey;
                break;
            }
        } else {
            if (app.preferences.havePref(newPrefKey, "Label Text ID 2 # 1")) {
                prefKey = newPrefKey;
                break;
            }
        }
    }
    if (prefKey) {
        if (parseFloat(app.version) >= 12) {
            for (var i = 1; i <= 16; i += 1) {
                if (app.preferences.havePref(newPrefKey, "Label Text ID 2 # " + i, PREFType.PREF_Type_MACHINE_INDEPENDENT)) {
                    try {
                        var col = app.preferences.getPrefAsString(prefKey, "Label Text ID 2 # " + i, PREFType.PREF_Type_MACHINE_INDEPENDENT);
                        colors.push(col);
                    } catch (e) {

                    }
                }
            }
        } else {
            for (var i = 1; i <= 16; i += 1) {
                if (app.preferences.havePref(newPrefKey, "Label Text ID 2 # " + i)) {
                    try {
                        var col = app.preferences.getPrefAsString(prefKey, "Label Text ID 2 # " + i);
                        colors.push(col);
                    } catch (e) {

                    }
                }
            }
        }
    }
    return colors;
}

function tcd_loadAndRegPref(prop, def) {
    var name = null;
    for (var child in prop.parent) {
        if (prop.parent[child] == prop) {
            name = child;
        }
    }
    if (name != null) {
        var value = def;
        if (app.settings.haveSetting(tcd_scriptName, name)) {
            value = app.settings.getSetting(tcd_scriptName, name);
        }
        if (prop instanceof Checkbox) {
            prop.value = !/^true$/i.test(value);
            prop.notify();
        } else if (prop instanceof EditText) {
            prop.text = value;
        } else {
            if (prop instanceof DropDownList) {
                for (var i = 0; i < prop.items.length; i += 1) {
                    if (prop.items[i].text === value) {
                        prop.selection = i;
                    }
                }
            }
        }
    }
    tcd_prefsToSave.push(prop);
}

function tcd_savePrefs() {
    for (var i = 0; i < tcd_prefsToSave.length; i += 1) {
        var prop = tcd_prefsToSave[i];
        var value = "";
        if (prop instanceof Checkbox) {
            value = prop.value;
        } else if (prop instanceof EditText) {
            value = prop.text;
        } else {
            if (prop instanceof DropDownList && prop.selection) {
                value = prop.selection.text;
            }
        }
        var name = null;
        for (var child in prop.parent) {
            if (prop.parent[child] == prop) {
                name = child;
            }
        }
        if (name != null) {
            app.settings.saveSetting(tcd_scriptName, name, value);
        }
    }
}

function tcd_buildUI(thisObj) {
    if (thisObj instanceof Panel) {
        var myPal = thisObj;
    } else {
        var myPal = new Window("palette", tcd_scriptName + " v" + tcd_version, undefined, {
            resizeable: true
        });
    }
    if (myPal != null) {
        var res = "group { \n                alignment: ['fill', 'fill'], \n                alignChildren: ['left','top'], \n                orientation: 'column', \n            newNamesGrp: Panel { \n                alignment: ['fill','top'], \n                alignChildren: ['left','top'], \n                text:'新合成命名', \n                preSufGrp: Group { \n                    orientation: 'row', \n                    alignment: ['fill','top'], \n                    preSufChk: Checkbox {text:''}, \n                    preSufDrp: DropDownList {alignment: ['left', 'center']}, \n                    preSufTxt: EditText {alignment: ['fill','center']}, \n                }, \n                replGrp: Group { \n                    orientation: 'row', \n                    alignment: ['fill','top'], \n                    replChk: Checkbox {text:''}, \n                    replSrchLbl: StaticText {text:'搜索', aligment:['left','left']}, \n                    replSrchTxt: EditText {alignment: ['left','left'], preferredSize:[100,20]}, \n                    replReplLbl: StaticText {text:'替换', alignment:['left','left']}, \n                    replReplTxt: EditText {alignment:['fill','left'], preferredSize:[100,20]}, \n                }, \n                incGrp: Group { \n                    orientation: 'row', \n                    alignment: ['fill','top'], \n                    incChk: Checkbox {text:''}, \n                    incLbl: StaticText {text:'增量'}, \n                    incDrp: DropDownList {}, \n                    incLbl2: StaticText {text:' 编号名称', alignment:['fill','left']}, \n                }, \n                colGrp: Group { \n                    orientation: 'row', \n                    alignment: ['fill','top'], \n                    colChk: Checkbox {text:''}, \n                    colLbl: StaticText {text:'标签颜色'}, \n                    colDrp: DropDownList {alignment: ['left', 'center']}, \n                }, \n            }, \n            optionsGrp: Panel { \n                alignment: ['fill','top'], \n                alignChildren: ['left','top'], \n                text:'选项', \n                grpFldGrp: Group { \n                    orientation: 'row', \n                    alignment: ['fill','top'], \n                    grpFldChk: Checkbox {text:''}, \n                    grpFldLbl: StaticText {text:'合成分组到文件夹', alignment:['left','left']}, \n                    grpFldTxt: EditText {alignment:['fill','left']}, \n                }, \n                incExcGrp: Group { \n                    orientation: 'row', \n                    alignment: ['fill','top'], \n                    incExcChk: Checkbox {text:''}, \n                    incExcLbl: StaticText {text:'排除类型', alignment:['left','left']}, \n                    incExcDrp: DropDownList {alignment:['left','center']}, \n                    incExcTxt: EditText {alignment:['fill','left'], preferredSize:[100,20]}, \n                }, \n                depGrp: Group { \n                    orientation: 'row', \n                    alignment: ['fill','top'], \n                    depChk: Checkbox {text:''}, \n                    depLbl: StaticText {text:'深度限制'}, \n                    depTxt: EditText {alignment:['left','left'], text:'1', preferredSize:[30,20]}, \n                }, \n                expGrp: Group { \n                    orientation: 'row', \n                    alignment: ['fill','top'], \n                    expChk: Checkbox {text:''}, \n                    expLbl: StaticText {text:'更新表达式', alignment:['fill','left']}, \n                }, \n                dupFtgGrp: Group { \n                    orientation: 'row', \n                    alignment: ['fill','top'], \n                    dupFtgChk: Checkbox {text:''}, \n                    dupFtgLbl: StaticText {text:'复制素材 (慢)', alignment:['fill','left']}, \n                } \n                dupSldGrp: Group { \n                    orientation: 'row', \n                    alignment: ['fill','top'], \n                    dupSldChk: Checkbox {text:''}, \n                    dupSldLbl: StaticText {text:'复制纯色层', alignment:['fill','left']}, \n                } \n                selDupGrp: Group { \n                    orientation: 'row', \n                    alignment: ['fill','top'], \n                    selDupChk: Checkbox {text:''}, \n                    selDupLbl: StaticText {text:'选择复制', alignment:['fill','left']}, \n                } \n            }, \n            toolsGrp: Panel { \n                alignment: ['fill','top'], \n                alignChildren: ['left','top'], \n                text:'工具', \n                collectGrp: Group { \n                    orientation: 'row', \n                    collectBtn: Button {text:'归类到文件夹', alignment:['right','top']} \n                } \n            }, \n            btnGrp: Group { \n                orientation: 'row', \n                alignment: ['fill','top'], \n                helpBtn: Button {text:'说明', alignment:['left','top'], preferredSize:[40,25]}, \n                copyLbl: StaticText {text:'复制数量', alignment:['right','center']}, \n                copyTxt: EditText {text:'1', alignment:['right','top'], preferredSize:[30,20]}, \n                dupSelBtn: Button {text:' 复制所选 ', alignment:['right','top']}, \n            } \n        }";
        myPal.grp = myPal.add(res);
        myPal.grp.newNamesGrp.preSufGrp.preSufDrp.enabled = myPal.grp.newNamesGrp.preSufGrp.preSufChk.enabled.value;
        myPal.grp.newNamesGrp.preSufGrp.preSufTxt.enabled = myPal.grp.newNamesGrp.preSufGrp.preSufChk.enabled.value;
        myPal.grp.newNamesGrp.preSufGrp.preSufChk.onClick = function() {
            myPal.grp.newNamesGrp.preSufGrp.preSufDrp.enabled = this.value;
            myPal.grp.newNamesGrp.preSufGrp.preSufTxt.enabled = this.value;
        };
        myPal.grp.newNamesGrp.replGrp.replSrchTxt.enabled = myPal.grp.newNamesGrp.replGrp.replChk.enabled.value;
        myPal.grp.newNamesGrp.replGrp.replReplTxt.enabled = myPal.grp.newNamesGrp.replGrp.replChk.enabled.value;
        myPal.grp.newNamesGrp.replGrp.replChk.onClick = function() {
            myPal.grp.newNamesGrp.replGrp.replSrchTxt.enabled = this.value;
            myPal.grp.newNamesGrp.replGrp.replReplTxt.enabled = this.value;
        };
        myPal.grp.newNamesGrp.incGrp.incDrp.enabled = myPal.grp.newNamesGrp.incGrp.incChk.enabled.value;
        myPal.grp.newNamesGrp.incGrp.incChk.onClick = function() {
            myPal.grp.newNamesGrp.incGrp.incDrp.enabled = this.value;
        };
        myPal.grp.newNamesGrp.colGrp.colDrp.enabled = myPal.grp.newNamesGrp.colGrp.colChk.enabled.value;
        myPal.grp.newNamesGrp.colGrp.colChk.onClick = function() {
            myPal.grp.newNamesGrp.colGrp.colDrp.enabled = this.value;
        };
        myPal.grp.optionsGrp.incExcGrp.incExcDrp.enabled = myPal.grp.optionsGrp.incExcGrp.incExcChk.enabled.value;
        myPal.grp.optionsGrp.incExcGrp.incExcTxt.enabled = myPal.grp.optionsGrp.incExcGrp.incExcChk.enabled.value;
        myPal.grp.optionsGrp.incExcGrp.incExcChk.onClick = function() {
            myPal.grp.optionsGrp.incExcGrp.incExcDrp.enabled = this.value;
            myPal.grp.optionsGrp.incExcGrp.incExcTxt.enabled = this.value;
        };
        myPal.grp.optionsGrp.grpFldGrp.grpFldTxt.enabled = myPal.grp.optionsGrp.grpFldGrp.grpFldChk.enabled.value;
        myPal.grp.optionsGrp.grpFldGrp.grpFldChk.onClick = function() {
            myPal.grp.optionsGrp.grpFldGrp.grpFldTxt.enabled = this.value;
        };
        myPal.grp.optionsGrp.depGrp.depTxt.enabled = myPal.grp.optionsGrp.depGrp.depChk.enabled.value;
        myPal.grp.optionsGrp.depGrp.depChk.onClick = function() {
            myPal.grp.optionsGrp.depGrp.depTxt.enabled = this.value;
        };
        var preSufOptions = ["前缀", "后缀"];
        for (var i = 0; i < preSufOptions.length; i += 1) {
            myPal.grp.newNamesGrp.preSufGrp.preSufDrp.add("item", preSufOptions[i]);
        }
        myPal.grp.newNamesGrp.preSufGrp.preSufDrp.selection = 1;
        var incOptions = ["First", "Last"];
        for (var i = 0; i < incOptions.length; i += 1) {
            myPal.grp.newNamesGrp.incGrp.incDrp.add("item", incOptions[i]);
        }
        myPal.grp.newNamesGrp.incGrp.incDrp.selection = 1;
        var incExcOptionsB = ["前缀", "后缀", "匹配正则表达式"];
        for (var i = 0; i < incExcOptionsB.length; i += 1) {
            myPal.grp.optionsGrp.incExcGrp.incExcDrp.add("item", incExcOptionsB[i]);
        }
        myPal.grp.optionsGrp.incExcGrp.incExcDrp.selection = 1;
        var colors = tcd_getColorNames();
        for (var i = 0; i < colors.length; i += 1) {
            myPal.grp.newNamesGrp.colGrp.colDrp.add("item", colors[i]);
        }
        myPal.grp.newNamesGrp.colGrp.colDrp.selection = 0;
        myPal.grp.optionsGrp.depGrp.depTxt.onChange = function() {
            if (/^\d*$/.test(this.text) != true) {
                alert("错误：无效的深度限制。\必须为正整数。");
                this.text = "1";
            }
        };
        myPal.grp.btnGrp.copyTxt.onChange = function() {
            if (/^\d*$/.test(this.text) != true) {
                alert("错误：无效的复制值。\必须为大于零的正整数。");
                this.text = "1";
            }
        };
        var grp = myPal.grp;
        tcd_loadAndRegPref(grp.newNamesGrp.preSufGrp.preSufChk, false);
        tcd_loadAndRegPref(grp.newNamesGrp.preSufGrp.preSufTxt, "");
        tcd_loadAndRegPref(grp.newNamesGrp.replGrp.replChk, false);
        tcd_loadAndRegPref(grp.newNamesGrp.replGrp.replSrchTxt, "");
        tcd_loadAndRegPref(grp.newNamesGrp.replGrp.replReplTxt, "");
        tcd_loadAndRegPref(grp.newNamesGrp.incGrp.incChk, true);
        tcd_loadAndRegPref(grp.newNamesGrp.incGrp.incDrp, "Last");
        tcd_loadAndRegPref(grp.newNamesGrp.colGrp.colDrp, "Red");
        tcd_loadAndRegPref(grp.optionsGrp.grpFldGrp.grpFldChk, false);
        tcd_loadAndRegPref(grp.optionsGrp.grpFldGrp.grpFldTxt, "");
        tcd_loadAndRegPref(grp.optionsGrp.incExcGrp.incExcChk, false);
        tcd_loadAndRegPref(grp.optionsGrp.incExcGrp.incExcDrp, "Prefix");
        tcd_loadAndRegPref(grp.optionsGrp.incExcGrp.incExcTxt, "_");
        tcd_loadAndRegPref(grp.optionsGrp.depGrp.depChk, false);
        tcd_loadAndRegPref(grp.optionsGrp.depGrp.depTxt, "1");
        tcd_loadAndRegPref(grp.optionsGrp.expGrp.expChk, true);
        tcd_loadAndRegPref(grp.optionsGrp.dupFtgGrp.dupFtgChk, false);
        tcd_loadAndRegPref(grp.optionsGrp.dupSldGrp.dupSldChk, false);
        tcd_loadAndRegPref(grp.optionsGrp.selDupGrp.selDupChk, false);
        tcd_loadAndRegPref(grp.btnGrp.copyTxt, "1");
        myPal.grp.btnGrp.helpBtn.onClick = function() {
            if (typeof helpWindow_unitTest == "undefined") {
                new helpWindow().run();
            }
        };
        myPal.grp.btnGrp.dupSelBtn.onClick = function() {
            tcd_expFixCount = 0;
            var errors = [];
            if (myPal.grp.newNamesGrp.preSufGrp.preSufChk.value) {
                if (myPal.grp.newNamesGrp.preSufGrp.preSufTxt.text === "") {
                    errors.push("没有设置值 " + myPal.grp.newNamesGrp.preSufGrp.preSufDrp.selection.text);
                }
            }
            if (myPal.grp.newNamesGrp.replGrp.replChk.value) {
                if (myPal.grp.newNamesGrp.replGrp.replSrchTxt.text === "" || myPal.grp.newNamesGrp.replGrp.replReplTxt.text == "") {
                    errors.push("没有设置为“搜索和替换”的值");
                }
            }
            if (myPal.grp.optionsGrp.incExcGrp.incExcChk.value) {
                if (myPal.grp.optionsGrp.incExcGrp.incExcTxt.text == "") {
                    errors.push("没有设置值 " + myPal.grp.optionsGrp.incExcGrp.incExcLbl.text + " " + myPal.grp.optionsGrp.incExcGrp.incExcDrp.selection.text);
                }
                if (TRUECOMPDUP_PALETTE.grp.optionsGrp.incExcGrp.incExcDrp.selection.text == "Matching Regex") {
                    try {
                        var re = new RegExp(myPal.grp.optionsGrp.incExcGrp.incExcTxt.text, "g");
                    } catch (e) {
                        errors.push("排除的无效表达式： " + myPal.grp.optionsGrp.incExcGrp.incExcTxt.text);
                    }
                }
            }
            if (myPal.grp.optionsGrp.grpFldGrp.grpFldChk.value) {
                if (myPal.grp.optionsGrp.grpFldGrp.grpFldTxt.text == "") {
                    errors.push("没有设置值 " + myPal.grp.optionsGrp.grpFldGrp.grpFldLbl.text);
                }
            }
            var selItems = app.project.selection.slice(0);
            if (selItems.length <= 0) {
                errors.push("在项目面板中未选择任何合成。");
            }
            for (var i = 0; i < selItems.length; i += 1) {
                if (!(selItems[i] instanceof CompItem)) {
                    errors.push("选择中包含非合成的项目，请仅选择要复制的合成项目");
                    break;
                }
            }
            tcd_savePrefs();
            tcd_fixExp = TRUECOMPDUP_PALETTE.grp.optionsGrp.expGrp.expChk.value;
            if (TRUECOMPDUP_PALETTE.grp.optionsGrp.depGrp.depChk.value) {
                tcd_maxDepth = TRUECOMPDUP_PALETTE.grp.optionsGrp.depGrp.depTxt.text;
            } else {
                tcd_maxDepth = -1;
            }
            var copies = parseInt(myPal.grp.btnGrp.copyTxt.text);
            var expErrors = [];
            if (errors.length > 0) {
                alert("错误\n" + errors.join("\n"));
            } else {
                app.beginUndoGroup("True Comp Duplicator");
                app.beginSuppressDialogs();
                var max = app.project.numItems * copies;
                if (tcd_fixExp) {
                    max = max * 2;
                }
                tcd_progDlg = new progressDlg().create("Duplicating Selected...", max);
                var newComps = [];
                var newFolders = [];
                var newFootage = [];
                try {
                    for (var c = 0; c < copies; c += 1) {
                        tcd_progDlg.setTitle("Duplicating Selected...");
                        previousComps = [];
                        previousFolders = [];
                        previousFootage = [];
                        tcd_copyNum = c;
                        if (TRUECOMPDUP_PALETTE.grp.optionsGrp.grpFldGrp.grpFldChk.value) {
                            tcd_createGroupFolder(selItems[0]);
                        }
                        var result = {};
                        for (var s = 0; s < selItems.length; s += 1) {
                            result = tcd_duplicate(selItems[s]);
                        }
                        for (var i = 0; i < result.comps.length; i += 1) {
                            newComps.push(result.comps[i].dest);
                        }
                        for (var i = 0; i < result.folders.length; i += 1) {
                            newFolders.push(result.folders[i].dest);
                        }
                        for (var i = 0; i < result.footage.length; i += 1) {
                            newFootage.push(result.footage[i].dest);
                        }
                        if (tcd_fixExp) {
                            tcd_progDlg.setTitle("视效网汉化提示,更新表达式中...");
                            var expComps = [];
                            for (var i = 0; i < result.comps.length; i += 1) {
                                expComps.push(result.comps[i].dest);
                            }
                            var errors = tcd_updateExpressions(expComps);
                            expErrors.push.apply(expErrors, errors);
                        }
                        if (TRUECOMPDUP_PALETTE.grp.newNamesGrp.colGrp.colChk.value) {
                            for (var i = 0; i < newComps.length; i += 1) {
                                var index = TRUECOMPDUP_PALETTE.grp.newNamesGrp.colGrp.colDrp.selection.index + 1;
                                newComps[i].label = index;
                            }
                            for (var i = 0; i < newFolders.length; i += 1) {
                                var index = TRUECOMPDUP_PALETTE.grp.newNamesGrp.colGrp.colDrp.selection.index + 1;
                                newFolders[i].label = index;
                            }
                            for (var i = 0; i < newFootage.length; i += 1) {
                                var index = TRUECOMPDUP_PALETTE.grp.newNamesGrp.colGrp.colDrp.selection.index + 1;
                                newFootage[i].label = index;
                            }
                        }
                    }
                } catch (err) {
                    alert(err);
                }
                var statusTxt = newComps.length + newFolders.length + newFootage.length + " items duplicated";
                if (tcd_fixExp) {
                    statusTxt = statusTxt + ", " + tcd_expFixCount + " expressions updated";
                }
                if (TRUECOMPDUP_PALETTE.grp.optionsGrp.selDupGrp.selDupChk.value) {
                    var newSel = [];
                    for (var i = 0; i < result.comps.length; i += 1) {
                        for (var s = 0; s < selItems.length; s += 1) {
                            if (selItems[s] == result.comps[i].source) {
                                selItems[s].selected = false;
                                result.comps[i].dest.selected = true;
                            }
                        }
                    }
                }
                tcd_progDlg.complete("处理完成！", statusTxt);
                app.endSuppressDialogs(false);
                app.endUndoGroup();
            }
            if (expErrors.length > 0) {
                new expErrWindow().run(expErrors);
            }
        };
        myPal.grp.toolsGrp.collectGrp.collectBtn.onClick = function() {
            tcd_expFixCount = 0;
            var errors = [];
            if (myPal.grp.optionsGrp.incExcGrp.incExcChk.value) {
                if (myPal.grp.optionsGrp.incExcGrp.incExcTxt.text == "") {
                    errors.push("No value supplied for " + myPal.grp.optionsGrp.incExcGrp.incExcLbl.text + " " + myPal.grp.optionsGrp.incExcGrp.incExcDrp.selection.text);
                }
                if (TRUECOMPDUP_PALETTE.grp.optionsGrp.incExcGrp.incExcDrp.selection.text == "Matching Regex") {
                    try {
                        var re = new RegExp(myPal.grp.optionsGrp.incExcGrp.incExcTxt.text, "g");
                    } catch (e) {
                        errors.push("Invalid regex for exclude: " + myPal.grp.optionsGrp.incExcGrp.incExcTxt.text);
                    }
                }
            }
            if (myPal.grp.optionsGrp.grpFldGrp.grpFldChk.value) {
                if (myPal.grp.optionsGrp.grpFldGrp.grpFldTxt.text == "") {
                    errors.push("No value supplied for " + myPal.grp.optionsGrp.grpFldGrp.grpFldLbl.text);
                }
            } else {
                errors.push("想合成收集到文件夹归类，必须启用“合成分组到文件夹”");
            }
            var selItems = app.project.selection.slice(0);
            if (selItems.length <= 0) {
                errors.push("在项目面板中未选择任何合成。");
            }
            for (var i = 0; i < selItems.length; i += 1) {
                if (!(selItems[i] instanceof CompItem)) {
                    errors.push("Selection contains items other than comps, please only select the top-level comp(s) you want to collect dependencies for.");
                    break;
                }
            }
            tcd_savePrefs();
            if (TRUECOMPDUP_PALETTE.grp.optionsGrp.depGrp.depChk.value) {
                tcd_maxDepth = TRUECOMPDUP_PALETTE.grp.optionsGrp.depGrp.depTxt.text;
            } else {
                tcd_maxDepth = -1;
            }
            var expErrors = [];
            if (errors.length > 0) {
                alert("Error\n" + errors.join("\n"));
            } else {
                app.beginUndoGroup("Collect Dependencies");
                app.beginSuppressDialogs();
                tcd_progDlg = new progressDlg().create("Collecting Dependencies...");
                var newComps = [];
                var newFolders = [];
                var newFootage = [];
                try {
                    tcd_progDlg.setTitle("Collecting Dependencies...");
                    previousComps = [];
                    previousFolders = [];
                    previousFootage = [];
                    tcd_createGroupFolder(selItems[0]);
                    var results = [];
                    for (var s = 0; s < selItems.length; s += 1) {
                        results.push(tcd_collect(selItems[s]));
                    }
                    var newComps = [];
                    var newFolders = [];
                    var newFootage = [];
                    for (var r = 0; r < results.length; r += 1) {
                        var result = results[r];
                        newComps.push.apply(newComps, result.newComps);
                        newFolders.push.apply(newFolders, result.newFolders);
                        newFootage.push.apply(newFootage, result.newFootage);
                    }
                    if (TRUECOMPDUP_PALETTE.grp.newNamesGrp.colGrp.colChk.value) {
                        for (var i = 0; i < newComps.length; i += 1) {
                            var index = TRUECOMPDUP_PALETTE.grp.newNamesGrp.colGrp.colDrp.selection.index + 1;
                            newComps[i].label = index;
                        }
                        for (var i = 0; i < newFolders.length; i += 1) {
                            var index = TRUECOMPDUP_PALETTE.grp.newNamesGrp.colGrp.colDrp.selection.index + 1;
                            newFolders[i].label = index;
                        }
                        for (var i = 0; i < newFootage.length; i += 1) {
                            var index = TRUECOMPDUP_PALETTE.grp.newNamesGrp.colGrp.colDrp.selection.index + 1;
                            newFootage[i].label = index;
                        }
                    }
                } catch (err) {
                    alert(err);
                }
                var statusTxt = newComps.length + newFolders.length + newFootage.length + " items colected";
                if (TRUECOMPDUP_PALETTE.grp.optionsGrp.selDupGrp.selDupChk.value) {
                    var newSel = [];
                    for (var s = 0; s < selItems.length; s += 1) {
                        selItems[s].selected = false;
                    }
                    for (var i = 0; i < prevComps.length; i += 1) {
                        prevComps[i].selected = true;
                    }
                }
                tcd_progDlg.complete("处理完成！", statusTxt);
                app.endSuppressDialogs(false);
                app.endUndoGroup();
            }
            if (expErrors.length > 0) {
                new expErrWindow().run(expErrors);
            }
        };
        myPal.layout.layout(true);
        myPal.layout.resize();
        myPal.onResizing = myPal.onResize = function() {
            this.layout.resize();
        };
    }
    return myPal;
}

function progressDlg() {
    this.windowRef = null;
}
progressDlg.prototype.create = function(title, max) {
    var win = new Window("palette", tcd_scriptName + " 收集进度", undefined, {
        resizeable: true,
        closeButton: false
    });
    this.windowRef = win;
    var res = "group { \n        alignment: ['fill', 'fill'], \n        alignChildren: ['left','top'], \n        orientation: 'column', \n        titleTxt: StaticText {text:'" + title + "', alignment:['fill','left']}, \n        statusTxt: StaticText {text:'', alignment:['fill','left']}, \n        progGrp: Group { \n            orientation: 'row', \n            alignment: ['fill','top'], \n            progBar: Progressbar {alignment:['fill','center'], preferredSize:[200,-1], maxvalue:'" + max + "'}, \n            progBtn: Button {text:'Cancel', alignment:['right','center'], properties:{name:’cancel’}}, \n        }, \n    }";
    win.grp = win.add(res);
    win.cancelElement = win.grp.progGrp.progBtn;
    win.defaultElement = win.grp.progGrp.progBtn;
    this.cancel = false;
    win.grp.progGrp.progBtn.onClick = function() {
        this.cancel = true;
        win.close();
    };
    win.layout.layout(true);
    win.layout.resize();
    win.onResizing = win.onResize = function() {
        this.layout.resize();
    };
    win.center();
    win.show();
    return this;
};
progressDlg.prototype.setTitle = function(titleTxt) {
    this.windowRef.grp.titleTxt.text = titleTxt;
};
progressDlg.prototype.update = function(increment, statusTxt) {
    this.windowRef.grp.progGrp.progBar.value = this.windowRef.grp.progGrp.progBar.value + increment;
    this.windowRef.grp.statusTxt.text = statusTxt;
};
progressDlg.prototype.close = function() {
    this.windowRef.close();
};
progressDlg.prototype.complete = function(titleTxt, statusTxt) {
    this.windowRef.grp.titleTxt.text = titleTxt;
    this.windowRef.grp.statusTxt.text = statusTxt;
    this.windowRef.grp.progGrp.progBar.value = this.windowRef.grp.progGrp.progBar.maxvalue;
    this.windowRef.grp.progGrp.progBtn.text = "Ok";
    this.windowRef.grp.progGrp.progBtn.active = true;
};

function helpWindow() {
    this.windowRef = null;
}
helpWindow.prototype.run = function() {
    var win = new Window("palette", tcd_scriptName, [100, 0, 580, 600]);
    this.windowRef = win;
    win.btnPanel = win.add("group", [10, 10, 600, 600]);
    win.btnPanel.text = win.btnPanel.add("statictext", [10, 10, 400, 25], tcd_strHelpHeader);
    win.btnPanel.warnBtn = win.btnPanel.add("edittext", [10, 40, 450, 540], tcd_strHelpText, {
        multiline: true
    });
    win.btnPanel.aesBtn = win.btnPanel.add("button", [310, 550, 450, 580], "视效网了解更多");
    win.btnPanel.aesBtn.onClick = function() {
        openURL("https://wanvfx.com");
    };
    win.center();
    win.show();
    return true;
};

function expErrWindow() {
    this.windowRef = null;
}
expErrWindow.prototype.run = function(expErrors) {
    var win = new Window("palette", tcd_scriptName + " - Expression Errors", [100, 0, 580, 600]);
    this.windowRef = win;
    win.btnPanel = win.add("group", [10, 10, 600, 600]);
    win.btnPanel.text = win.btnPanel.add("statictext", [10, 10, 400, 25], "Duplication complete, but with " + expErrors.length + " expression error(s)...");
    win.btnPanel.warnBtn = win.btnPanel.add("edittext", [10, 40, 450, 540], expErrors.join("\n\n"), {
        multiline: true
    });
    win.btnPanel.aesBtn = win.btnPanel.add("button", [310, 550, 450, 580], "Ok");
    win.btnPanel.aesBtn.onClick = function() {
        win.close();
    };
    win.center();
    win.show();
    return true;
};

function openURL(url) {
    if ($.os.indexOf("Windows") != -1) {
        system.callSystem("cmd /c \"" + Folder.commonFiles.parent.fsName + "\\Internet Explorer\\iexplore.exe" + "\" " + url);
    } else {
        var cmd = "open \"" + url + "\"";
        system.callSystem(cmd);
    }
}

function tcd_saveProjItmSel() {
    var result = app.project.selection.slice(0);
    return result;
}

function tcd_loadProjItmSel(sel) {
    for (var i = 0; i < sel.length; i += 1) {
        sel[i].selected = true;
    }
}

function tcd_clearProjItmSel() {
    for (var i = 1; i <= app.project.numItems; i += 1) {
        app.project.item(i).selected = false;
    }
}

function tcd_duplicateProjItem(item) {
    var chk = tcd_checkPreviousFootage(item);
    var result = [];
    if (chk == null) {
        app.project.showWindow(true);
        var sel = tcd_saveProjItmSel();
        tcd_clearProjItmSel();
        var beforeIDs = [];
        for (var d = 1; d <= app.project.numItems; d += 1) {
            beforeIDs.push(app.project.item(d).id);
        }
        item.selected = true;
        app.executeCommand(2080);
        for (var d = 1; d <= app.project.numItems; d += 1) {
            var itm = app.project.item(d);
            var found = false;
            for (var i = 0; i < beforeIDs.length; i += 1) {
                if (itm.id == beforeIDs[i]) {
                    found = true;
                }
            }
            if (found == false) {
                result.push(itm);
            }
        }
        tcd_clearProjItmSel();
        tcd_loadProjItmSel(sel);
        if (result.length > 0 && result[0] != null) {
            for (var r = 0; r < result.length; r += 1) {
                result[r].name = tcd_changeName(item.name);
            }
            if (tcd_progDlg.cancel == false && TRUECOMPDUP_PALETTE.grp.optionsGrp.grpFldGrp.grpFldChk.value) {
                result[0].parentFolder = tcd_duplicateFolderStructure(result[0].parentFolder);
            }
            var ftg = {};
            ftg.source = item;
            ftg.dest = result[0];
            previousFootage.push(ftg);
        }
    } else {
        result.push(chk);
    }
    if (result.length > 1) {
        return result;
    } else if (result.length == 1) {
        return result[0];
    } else {
        return null;
    }
}

function tcd_collect_deps_for_comp(comp) {
    var prevComps = [];
    var prevFootage = [];
    var prevFolders = [];

    function _get_prevComp(comp) {
        for (var i = 0; i < prevComps.length; i += 1) {
            if (prevComps[i].id == comp.id) {
                return prevComps[i];
            }
        }
    }

    function _collect(comp, depth) {
        for (var i = 1; i <= comp.numLayers; i += 1) {
            var layer = comp.layer(i);
            if (tcd_progDlg.cancel) {
                break;
            }
            tcd_progDlg.update(1, comp.name);
            if (layer instanceof AVLayer && tcd_incExcFilter(layer.source.name)) {
                if (layer.source && layer.source instanceof CompItem) {
                    if (tcd_maxDepth == -1 || depth < tcd_maxDepth) {
                        check = _get_prevComp(layer.source);
                        if (check == null) {
                            _collect(layer.source, depth + 1);
                            prevComps.push(layer.source.id);
                        }
                    }
                } else if (layer.source.mainSource instanceof FileSource) {

                } else {
                    if (layer.source.mainSource instanceof SolidSource) {

                    }
                }
            }
        }
        if (tcd_progDlg.cancel == false && TRUECOMPDUP_PALETTE.grp.optionsGrp.grpFldGrp.grpFldChk.value) {
            comp.parentFolder = tcd_duplicateFolderStructure(comp.parentFolder);
        }
        return comp;
    }
    _collect(comp, 0);
    result = {
        prevComps: prevComps,
        prevFootage: prevFootage,
        prevFolders: prevFolders
    };
    return result;
}

function tcd_duplicateCompStructure(comp, tcd_depth) {
    var newCompName = tcd_changeName(comp.name);
    var compResult = {};
    compResult.source = comp;
    var comp = comp.duplicate();
    comp.name = newCompName;
    compResult.dest = comp;
    previousComps.push(compResult);
    for (var i = 1; i <= comp.numLayers; i += 1) {
        var layer = comp.layer(i);
        if (tcd_progDlg.cancel) {
            break;
        }
        tcd_progDlg.update(1, newCompName);
        if (layer instanceof AVLayer && tcd_incExcFilter(layer.source.name)) {
            if (layer.source && layer.source instanceof CompItem) {
                if (tcd_maxDepth == -1 || tcd_depth < tcd_maxDepth) {
                    check = tcd_checkPreviousComps(layer.source);
                    if (check != null) {
                        tcd_replaceSource(layer, check, tcd_fixExp);
                    } else {
                        var compResult = {};
                        compResult.source = layer.source;
                        var newComp = tcd_duplicateCompStructure(layer.source, tcd_depth + 1);
                        tcd_replaceSource(layer, newComp, tcd_fixExp);
                        compResult.dest = layer.source;
                        previousComps.push(compResult);
                    }
                }
            } else if (layer.source.mainSource instanceof FileSource) {
                if (TRUECOMPDUP_PALETTE.grp.optionsGrp.dupFtgGrp.dupFtgChk.value) {
                    var newItem = tcd_duplicateProjItem(layer.source);
                    if (newItem != null) {
                        tcd_replaceSource(layer, newItem, tcd_fixExp);
                    }
                }
            } else {
                if (layer.source.mainSource instanceof SolidSource) {
                    if (TRUECOMPDUP_PALETTE.grp.optionsGrp.dupSldGrp.dupSldChk.value) {
                        var newItem = tcd_duplicateProjItem(layer.source);
                        if (newItem != null) {
                            tcd_replaceSource(layer, newItem, tcd_fixExp);
                        }
                    }
                }
            }
        }
    }
    if (tcd_progDlg.cancel == false && TRUECOMPDUP_PALETTE.grp.optionsGrp.grpFldGrp.grpFldChk.value) {
        comp.parentFolder = tcd_duplicateFolderStructure(comp.parentFolder);
    }
    return comp;
}

function tcd_replaceSource(layer, newItem, fixExp) {
    layer.replaceSource(newItem, fixExp);
}

function tcd_incExcFilter(name) {
    if (TRUECOMPDUP_PALETTE.grp.optionsGrp.incExcGrp.incExcChk.value) {
        var preSufTypeB = TRUECOMPDUP_PALETTE.grp.optionsGrp.incExcGrp.incExcDrp.selection.text;
        var preSufTxt = TRUECOMPDUP_PALETTE.grp.optionsGrp.incExcGrp.incExcTxt.text;
        if (preSufTypeB.toLowerCase() == "prefix") {
            if (name.startsWith(preSufTxt)) {
                return false;
            }
        } else if (preSufTypeB.toLowerCase() == "suffix") {
            if (name.endsWith(preSufTxt)) {
                return false;
            }
        } else {
            if (preSufTypeB.toLowerCase() == "matching regex") {
                var re = new RegExp(preSufTxt, "g");
                if (re.test(name)) {
                    return false;
                }
            }
        }
    }
    return true;
}

function tcd_duplicateFolderStructure(folder) {
    var check = tcd_checkPreviousFolders(folder);
    if (folder == tcd_origParentFolder) {
        return tcd_parentFolder;
    } else if (check == null) {
        var sourceID = folder.id;
        var newFolder = app.project.items.addFolder(tcd_changeName(folder.name));
        var destID = newFolder.id;
        var fldr = {};
        fldr.source = folder;
        fldr.dest = newFolder;
        previousFolders.push(fldr);
        if (folder.parentFolder != null) {
            newFolder.parentFolder = tcd_duplicateFolderStructure(folder.parentFolder);
        }
        return newFolder;
    } else {
        return check;
    }
}

function tcd_checkPreviousComps(comp) {
    for (var i = 0; i < previousComps.length; i += 1) {
        if (previousComps[i].source.id == comp.id) {
            return previousComps[i].dest;
        }
    }
    return null;
}

function tcd_checkPreviousFolders(folder) {
    for (var i = 0; i < previousFolders.length; i += 1) {
        if (previousFolders[i].source.id == folder.id) {
            return previousFolders[i].dest;
        }
    }
    return null;
}

function tcd_checkPreviousFootage(footage) {
    for (var i = 0; i < previousFootage.length; i += 1) {
        if (previousFootage[i].source.id == footage.id) {
            return previousFootage[i].dest;
        }
    }
    return null;
}

function tcd_getItemWithID(id) {
    for (var x = 1; x <= app.project.numItems; x += 1) {
        if (app.project.item(x).id == id) {
            return app.project.item(x);
        }
    }
    return null;
}

function tcd_changeName(name) {
    var origName = name;
    if (TRUECOMPDUP_PALETTE.grp.newNamesGrp.preSufGrp.preSufChk.value) {
        var typ = TRUECOMPDUP_PALETTE.grp.newNamesGrp.preSufGrp.preSufDrp.selection.text;
        var txt = TRUECOMPDUP_PALETTE.grp.newNamesGrp.preSufGrp.preSufTxt.text;
        if (typ.toLowerCase() == "prefix") {
            name = txt + name;
            if (parseFloat(app.version) < 9) {
                name = name.substring(0, 29)
            }
        } else {
            if (typ.toLowerCase() == "suffix") {
                if (parseFloat(app.version) < 9) {
                    name = name.substring(0, 29 - txt.length)
                }
                name = name + txt;
            }
        }
    }
    if (TRUECOMPDUP_PALETTE.grp.newNamesGrp.replGrp.replChk.value) {
        var srchTxt = TRUECOMPDUP_PALETTE.grp.newNamesGrp.replGrp.replSrchTxt.text;
        var replTxt = TRUECOMPDUP_PALETTE.grp.newNamesGrp.replGrp.replReplTxt.text;
        var srchClean = srchTxt.replace(/[-[\]{}()*+?.\\^$|,#\:\s]/g, "\\$&");
        var srchTermRegex = new RegExp(srchClean, "gi");
        name = name.replace(srchTermRegex, replTxt);
        if (parseFloat(app.version) < 9) {
            name = name.substring(0, 29)
        }
    }
    if (TRUECOMPDUP_PALETTE.grp.newNamesGrp.incGrp.incChk.value) {
        if (TRUECOMPDUP_PALETTE.grp.newNamesGrp.incGrp.incDrp.selection.text == "First") {
            name = name.replace(/(\d+)/, function(match, c1) {
                var num = ++c1 + tcd_copyNum;
                return tcd_pad(num, match.length);
            });
        } else {
            if (TRUECOMPDUP_PALETTE.grp.newNamesGrp.incGrp.incDrp.selection.text == "Last") {
                name = name.replace(/(\d+)(?=\D*$)/g, function(match, c1) {
                    var num = ++c1 + tcd_copyNum;
                    return tcd_pad(num, match.length);
                });
            }
        }
    }
    return name;
}

function tcd_updateExpressions(newComps) {
    var expErrors = [];
    for (var i = 0; i < newComps.length; i += 1) {
        if (tcd_progDlg.cancel) {
            break;
        }
        if (newComps[i] != null) {
            var myComp = newComps[i];
            for (var j = 1; j <= myComp.numLayers; j += 1) {
                if (tcd_progDlg.cancel) {
                    break;
                }
                tcd_progDlg.update(1, "Comp: " + myComp.name + " - Layer: " + myComp.layer(j).name);
                var errors = tcd_processExpressions(myComp.layer(j), myComp, tcd_progDlg);
                if (errors.length > 0) {
                    for (var e = 0; e < errors.length; e += 1) {
                        expErrors.push(errors[e]);
                    }
                }
            }
        }
    }
    return expErrors;
}
var exp_compCheckRegExp = new RegExp("comp(\"*.\")", "g");
var exp_compLyrRegEx = /comp\(\"(.+?)\"\)\.layer\(\"(.+?)\"\)/g;
var exp_thisCompLyrRegEx = /thisComp.layer\(\"(.+?)\"\)/g;

function tcd_processExpressions(myLayer, myComp) {
    var errors = [];
    for (var j = 1; j <= myLayer.numProperties; j += 1) {
        var prop = myLayer.property(j);
        if (prop.isModified == false) {
            continue;
        }
        if (prop.numProperties != undefined && prop.numProperties > 0) {
            var err = tcd_processExpressions(prop, myComp);
            errors.push.apply(errors, err);
        }
        if (prop.canSetExpression && prop.expression != "") {
            var origExpression = prop.expression;
            if (prop.expressionEnabled && prop.expressionError == "") {
                var changed = false;
                var expression = origExpression;
                if (exp_compCheckRegExp.test(expression)) {
                    for (var k = 0; k < previousComps.length; k += 1) {
                        var oldCompName = previousComps[k].source.name;
                        if (expression.indexOf("comp(\"" + oldCompName + "\")") != -1) {
                            var newCompName = previousComps[k].dest.name;
                            expression = expression.split("comp(\"" + oldCompName + "\")").join("comp(\"" + newCompName + "\")");
                        }
                    }
                }
                var expLines = expression.split(/\r|\n/g);
                var result = null;
                for (var l = 0; l < expLines.length; l += 1) {
                    result = exp_thisCompLyrRegEx.exec(expLines[l]);
                    if (result != null) {
                        var sourceLayerName = result[1];
                        var sourceComp = null;
                        for (var c = 0; c < previousComps.length; c += 1) {
                            if (previousComps[c].dest == myComp) {
                                sourceComp = previousComps[c].source;
                            }
                        }
                        if (sourceComp != null) {
                            expLines[l] = fixLyrExpr(expLines[l], sourceLayerName, sourceComp, myComp);
                        }
                    }
                    result = null;
                    while (result = exp_compLyrRegEx.exec(expLines[l])) {
                        var sourceComp = null;
                        var destComp = null;
                        for (var c = 0; c < previousComps.length; c += 1) {
                            if (previousComps[c].dest.name == result[1]) {
                                destComp = previousComps[c].dest;
                                sourceComp = previousComps[c].source;
                            }
                        }
                        var sourceLayerName = result[2];
                        if (sourceComp != null && destComp != null) {
                            expLines[l] = fixLyrExpr(expLines[l], sourceLayerName, sourceComp, destComp);
                        }
                    }
                }
                expression = expLines.join("\r");
                if (expression === origExpression) {
                    continue;
                }
                try {
                    myLayer.property(j).expression = expression;
                } catch (err) {
                    errors.push(err.toString().replace("\r\r", "\n"));
                }
                tcd_expFixCount++;
            }
        }
    }
    return errors;
}

function fixLyrExpr(expression, layerName, sourceComp, destComp) {
    var lyrNum = null;
    for (var l = 1; l <= sourceComp.numLayers; l += 1) {
        if (sourceComp.layer(l).name === layerName) {
            lyrNum = sourceComp.layer(l).index;
        }
    }
    var newLyrName = null;
    if (lyrNum != null) {
        newLyrName = destComp.layer(lyrNum).name;
    }
    if (newLyrName != null) {
        expression = expression.replace("layer(\"" + layerName + "\")", "layer(\"" + newLyrName + "\")");
    }
    return expression;
}

function tcd_createGroupFolder(sampleItem) {
    var folderName = TRUECOMPDUP_PALETTE.grp.optionsGrp.grpFldGrp.grpFldTxt.text;
    if (tcd_copyNum > 0) {
        if (/\d+(?!.*\d)/.test(folderName) != true) {
            folderName = folderName + "0";
        }
    }
    var num = /\d+(?!.*\d)/.exec(folderName);
    var numPadding = 1;
    if (num != null) {
        var numPadding = num.toString().length;
    }
    folderName = folderName.replace(/\d+(?!.*\d)/, function(n) {
        return tcd_pad((++n + tcd_copyNum) - 1, numPadding);
    });
    tcd_parentFolder = app.project.items.addFolder(folderName);
    var fldr = {};
    fldr.source = {
        id: "0",
        name: "root"
    };
    fldr.dest = tcd_parentFolder;
    previousFolders.push(fldr);
    if (sampleItem.parentFolder.parentFolder) {
        tcd_parentFolder.parentFolder = sampleItem.parentFolder.parentFolder;
    } else {
        tcd_parentFolder.parentFolder = sampleItem.parentFolder;
    }
    var folder = {};
    folder.source = sampleItem.parentFolder;
    folder.dest = tcd_parentFolder;
    previousFolders.push(folder);
    tcd_origParentFolder = sampleItem.parentFolder;
    return tcd_parentFolder;
}

function tcd_duplicate(item) {
    if (item instanceof CompItem) {
        tcd_duplicateCompStructure(item, 0);
    } else {
        tcd_duplicateProjItem(item);
    }
    var result = {};
    result.comps = previousComps.slice(0);
    result.folders = previousFolders.slice(0);
    result.footage = previousFootage.slice(0);
    return result;
}

function tcd_collect(item) {
    if (item instanceof CompItem) {
        result = tcd_collect_deps_for_comp(item);
    }
    return result;
}

function tcd_pad(num, size) {
    var s = num + "";
    while (s.length < size) {
        s = "0" + s
    }
    return s;
}
var TRUECOMPDUP_PALETTE = tcd_buildUI(this);
if (parseFloat(app.version) < 8) {
    alert("This script requires Adobe After Effects CS3 or later.", tcd_scriptName);
} else {
    if (TRUECOMPDUP_PALETTE != null && TRUECOMPDUP_PALETTE instanceof Window) {
        TRUECOMPDUP_PALETTE.show();
    }
}