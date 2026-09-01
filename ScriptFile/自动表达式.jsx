/* 

名称: pt_AutoExpress
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

function pt_AutoExpress(thisObj) {
    var ptAE_Data = new Object();
    ptAE_Data.helpWindow;
    ptAE_Data.defaultFreq = 1;
    ptAE_Data.defaultMag = 20;
    ptAE_Data.defaultOctaves = 1;
    ptAE_Data.defaultAmpMult = 0.5;
    ptAE_Data.defaultWidth = 0.2;
    ptAE_Data.defaultSamples = 5;
    ptAE_Data.mainDropDown = "[\"摆动\", \"摇摆专业版\", \"平稳化\", \"循环\"]";
    ptAE_Data.loopDropDown = "[\"cycle\", \"pingpong\", \"offset\", \"continue\"]";
    ptAE_Data.keyDurDropDown = "[\"Keyframes\", \"Duration\"]";
    ptAE_Data.loopKeyframes = 0;
    ptAE_Data.scriptName = "自动表达式";
    if ($.os.indexOf("Windows XP") != -1) {
        ptAE_Data.winProgramFiles = Folder.commonFiles.parent.fsName;
        ptAE_Data.winBrowserCmd = ptAE_Data.winProgramFiles + "\\Internet Explorer\\iexplore.exe";
    } else {
        ptAE_Data.winBrowserCmd = "start "
    }
    ptAE_Data.macBrowserCmdStart = "open \"";
    ptAE_Data.macBrowserCmdEnd = "\"";
    ptAE_Data.strErrScriptAccess = "This script requires the scripting security preference to be set.\nGo to the General panel of the application preferences and make sure Allow Scripts to Write Files and Access Network is checked.";
    ptAE_Data.strHelp = "?";
    ptAE_Data.strHelpHeader = ptAE_Data.scriptTitle + " © 2006-2010 Paul Tuersley";
    ptAE_Data.strHelpText = "该脚本可以向任何选定的属性添加摆动，平滑或循环表达式。.";

    function pt_AutoExpress_buildUI(thisObj) {
        var pal = thisObj instanceof Panel ? thisObj : new Window("palette", "自动表达式", undefined);
        if (pal != null) {
            var res = "group { \n\t\t\t\t\torientation: 'column' ,alignment:['left','top'], \n\t\t\t\t\theader: Group { alignment:['fill', 'top'], \n\t\t\t\t\t\ttextST: StaticText { text:'表达式:' }, \n\t\t\t\t\t\tdropdown: DropDownList { properties:{items:" + ptAE_Data.mainDropDown + "}, alignment:['fill','center'] }, \n\t\t\t\t\t}, \n\t\t\t\t\tallGroups: Group { orientation: 'stack', alignment:['fill','top'], alignChildren:['left','top'], \n\t\t\t\t\t\twiggle: Group { orientation: 'column', alignment:['fill','top'], alignChildren:['left','top'], \n\t\t\t\t\t\t\tdimensions: Group { \n\t\t\t\t\t\t\t\ttitle: StaticText { text:'定位:' }, \n\t\t\t\t\t\t\t\tx: Checkbox { text: 'X'}, \n\t\t\t\t\t\t\t\ty: Checkbox { text: 'Y'}, \n\t\t\t\t\t\t\t\tz: Checkbox { text: 'Z'}, \n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t\tfreq: Group { \n\t\t\t\t\t\t\t\tfreqST: StaticText { text:'摆动次数/秒:' }, \n\t\t\t\t\t\t\t\tfreqET: EditText { text:'100' }, \n\t\t\t\t\t\t\t\tmagST: StaticText { text:'数值:' }, \n\t\t\t\t\t\t\t\tmagET: EditText { text:'100' }, \n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t\tsliders: Group { \n\t\t\t\t\t\t\t\ttitle: StaticText { text:'使用滑块控制数量:' }, \n\t\t\t\t\t\t\t\tmag: Checkbox { }, \n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t\tfooter: Group { \n\t\t\t\t\t\t\t\tabout: Button { text:'帮助', maximumSize:[0,0]}, \n\t\t\t\t\t\t\t\tapply: Button { text:'应用', alignment:['left','center'] }, \n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t}, \n\t\t\t\t\t\twigglePro: Group { orientation: 'column', alignment:['fill','top'], alignChildren:['left','top'], \n\t\t\t\t\t\t\tdimensions: Group { \n\t\t\t\t\t\t\t\ttitle: StaticText { text:'定位:' }, \n\t\t\t\t\t\t\t\tx: Checkbox { text: 'X'}, \n\t\t\t\t\t\t\t\ty: Checkbox { text: 'Y'}, \n\t\t\t\t\t\t\t\tz: Checkbox { text: 'Z'}, \n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t\tfreq: Group { \n\t\t\t\t\t\t\t\tfreqST: StaticText { text:'频率:' }, \n\t\t\t\t\t\t\t\tfreqET: EditText { text:'100' }, \n\t\t\t\t\t\t\t\tmagST: StaticText { text:'数值:' }, \n\t\t\t\t\t\t\t\tmagET: EditText { text:'100' }, \n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t\toctaves: Group { \n\t\t\t\t\t\t\t\toctavesST: StaticText { text:'重复次数:' }, \n\t\t\t\t\t\t\t\toctavesET: EditText { text:'100' }, \n\t\t\t\t\t\t\t\tampmultST: StaticText { text:'倍数:' }, \n\t\t\t\t\t\t\t\tampmultET: EditText { text:'100' }, \n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t\tsliders: Group { \n\t\t\t\t\t\t\t\ttitle: StaticText { text:'滑块控制:' }, \n\t\t\t\t\t\t\t\tfreq: Checkbox { text: '频率'}, \n\t\t\t\t\t\t\t\tmag: Checkbox { text: '数量'}, \n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t\tfooter: Group { \n\t\t\t\t\t\t\t\ttimeST: StaticText { text:'时间偏移' }, \n\t\t\t\t\t\t\t\ttimeET: EditText { text:'100' }, \n\t\t\t\t\t\t\t\ttempWiggle: Checkbox { text: '取样期间'}, \n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t\tfooter2: Group { \n\t\t\t\t\t\t\t\tabout: Button { text:'?', maximumSize:[0,0] }, \n\t\t\t\t\t\t\t\tapply: Button { text:'应用' }, \n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t}, \n\t\t\t\t\t\tsmooth: Group { orientation: 'column',  alignment:['fill','top'], alignChildren:['left','top'], \n\t\t\t\t\t\t\tdimensions: Group { \n\t\t\t\t\t\t\t\ttitle: StaticText { text:'定位:' }, \n\t\t\t\t\t\t\t\tx: Checkbox { text: 'X'}, \n\t\t\t\t\t\t\t\ty: Checkbox { text: 'Y'}, \n\t\t\t\t\t\t\t\tz: Checkbox { text: 'Z'}, \n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t\tfreq: Group { \n\t\t\t\t\t\t\t\tfreqST: StaticText { text:'范围（秒）:' }, \n\t\t\t\t\t\t\t\tfreqET: EditText { text:'100' }, \n\t\t\t\t\t\t\t\tmagST: StaticText { text:'样品:' }, \n\t\t\t\t\t\t\t\tmagET: EditText { text:'100' }, \n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t\tfooter: Group { \n\t\t\t\t\t\t\t\tabout: Button { text:'帮助', maximumSize:[0,0] }, \n\t\t\t\t\t\t\t\tapply: Button { text:'应用' }, \n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t}, \n\t\t\t\t\t\tloop: Group { orientation: 'column', alignment:['left', 'top'], alignChildren:['left','center'], \n\t\t\t\t\t\t\ttheLoops: Group { orientation: 'row', \n\t\t\t\t\t\t\t\tloopIn: Group { orientation: 'column', alignment:['left','top'], alignChildren:['left','center']\n\t\t\t\t\t\t\t\t\tloopCheck: Checkbox { text: '关键帧之前'}, \n\t\t\t\t\t\t\t\t\tdropDownIn: DropDownList { properties:{items:" + ptAE_Data.loopDropDown + "}, alignment:['fill','center'] }, \n\t\t\t\t\t\t\t\t\tkeys: Group { orientation: 'row', \n\t\t\t\t\t\t\t\t\t\tkeyframesST: StaticText { text: '关键帧:' }, \n\t\t\t\t\t\t\t\t\t\tkeyframesET: EditText { text:'000'}, \n\t\t\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t\t\tloopOut: Group { orientation: 'column', alignment:['left','top'], alignChildren:['left','center'] \n\t\t\t\t\t\t\t\t\tloopCheck: Checkbox { text: '关键帧之后'}, \n\t\t\t\t\t\t\t\t\tdropDownOut: DropDownList { properties:{items:" + ptAE_Data.loopDropDown + "}, alignment:['fill','center'] }, \n\t\t\t\t\t\t\t\t\tkeys: Group { orientation: 'row', \n\t\t\t\t\t\t\t\t\t\tkeyframesST: StaticText { text: '(0=所有帧)' }, \n\t\t\t\t\t\t\t\t\t\talignment:['right','center'], \n\t\t\t\t\t\t\t\t\t\tkeyframesET: EditText { text:'000'}, \n\t\t\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t\tloopDuration: Checkbox { text: '循环持续时间', alignment:['left','center']}, \n\t\t\t\t\t\t\tfooter: Group { alignment:['fill', 'top'], \n\t\t\t\t\t\t\t\tabout: Button { text:'?', maximumSize:[0,0], alignment:['left','center'] }, \n\t\t\t\t\t\t\t\tapply: Button { text:'应用', alignment:['left','center'] }, \n\t\t\t\t\t\t\t}, \n\t\t\t\t\t\t}, \n\t\t\t\t\t}, \n\t\t\t\t}";
            pal.grp = pal.add(res);
            pal.grp.header.dropdown.selection = 0;
            pal.grp.header.dropdown.onChange = onDropDownListChange;
            pal.grp.allGroups.wiggle.footer.about.onClick = pal.grp.allGroups.wigglePro.footer2.about.onClick = pal.grp.allGroups.smooth.footer.about.onClick = pal.grp.allGroups.loop.footer.about.onClick = function() {
                if (ptAE_Data.helpWindow instanceof Window) {
                    ptAE_Data.helpWindow.show()
                } else {
                    helpWindow()
                }
            };
            pal.grp.allGroups.wigglePro.visible = false;
            pal.grp.allGroups.smooth.visible = false;
            pal.grp.allGroups.loop.visible = false;
            pal.grp.allGroups.wiggle.dimensions.x.value = true;
            pal.grp.allGroups.wiggle.dimensions.y.value = true;
            pal.grp.allGroups.wiggle.dimensions.z.value = true;
            pal.grp.allGroups.wigglePro.dimensions.x.value = true;
            pal.grp.allGroups.wigglePro.dimensions.y.value = true;
            pal.grp.allGroups.wigglePro.dimensions.z.value = true;
            pal.grp.allGroups.smooth.dimensions.x.value = true;
            pal.grp.allGroups.smooth.dimensions.y.value = true;
            pal.grp.allGroups.smooth.dimensions.z.value = true;
            pal.grp.allGroups.wigglePro.octaves.octavesST.preferredSize = pal.grp.allGroups.wigglePro.freq.freqST.preferredSize;
            pal.grp.allGroups.wigglePro.freq.magST.preferredSize = pal.grp.allGroups.wigglePro.octaves.ampmultST.preferredSize;
            pal.layout.layout(true);
            pal.grp.allGroups.wiggle.freq.freqET.text = ptAE_Data.defaultFreq;
            pal.grp.allGroups.wiggle.freq.magET.text = ptAE_Data.defaultMag;
            pal.grp.allGroups.wigglePro.freq.freqET.text = ptAE_Data.defaultFreq;
            pal.grp.allGroups.wigglePro.freq.magET.text = ptAE_Data.defaultMag;
            pal.grp.allGroups.wigglePro.octaves.octavesET.text = ptAE_Data.defaultOctaves;
            pal.grp.allGroups.wigglePro.octaves.ampmultET.text = ptAE_Data.defaultAmpMult;
            pal.grp.allGroups.smooth.freq.freqET.text = ptAE_Data.defaultWidth;
            pal.grp.allGroups.smooth.freq.magET.text = ptAE_Data.defaultSamples;
            pal.grp.allGroups.wigglePro.footer.timeET.text = 0;
            pal.grp.allGroups.wigglePro.footer.timeET.onChange = onTimeAmountChange;
            pal.grp.allGroups.wiggle.freq.freqET.onChange = onFreqAmountChange;
            pal.grp.allGroups.wiggle.freq.magET.onChange = onMagAmountChange;
            pal.grp.allGroups.wigglePro.freq.freqET.onChange = onFreqAmountChange;
            pal.grp.allGroups.wigglePro.freq.magET.onChange = onMagAmountChange;
            pal.grp.allGroups.wigglePro.octaves.octavesET.onChange = onOctavesAmountChange;
            pal.grp.allGroups.wigglePro.octaves.ampmultET.onChange = onAmpMultAmountChange;
            pal.grp.allGroups.smooth.freq.freqET.onChange = onWidthAmountChange;
            pal.grp.allGroups.smooth.freq.magET.onChange = onSamplesAmountChange;
            pal.grp.allGroups.loop.theLoops.loopOut.loopCheck.value = true;
            pal.grp.allGroups.loop.theLoops.loopIn.dropDownIn.selection = 0;
            pal.grp.allGroups.loop.theLoops.loopOut.dropDownOut.selection = 0;
            pal.grp.allGroups.loop.theLoops.loopIn.keys.keyframesET.text = 0;
            pal.grp.allGroups.loop.theLoops.loopOut.keys.keyframesET.text = 0;
            pal.grp.allGroups.loop.theLoops.loopIn.dropDownIn.onChange = pal.grp.allGroups.loop.theLoops.loopOut.dropDownOut.onChange = function() {
                this.parent.loopCheck.value = true;
            };
            pal.grp.allGroups.loop.theLoops.loopIn.keys.keyframesET.onChange = onLoopKeyframesChange;
            pal.grp.allGroups.loop.theLoops.loopOut.keys.keyframesET.onChange = onLoopKeyframesChange;
            pal.grp.allGroups.loop.loopDuration.onClick = onLoopDurationClick;
            pal.grp.allGroups.wiggle.footer.apply.onClick = applyWiggle;
            pal.grp.allGroups.wigglePro.footer2.apply.onClick = applyWiggle;
            pal.grp.allGroups.smooth.footer.apply.onClick = applyWiggle;
            pal.grp.allGroups.loop.footer.apply.onClick = applyLoop;
            if (Math.floor(parseFloat(app.version)) == 8) {
                var winGfx = pal.graphics;
                var darkColorBrush = winGfx.newPen(winGfx.BrushType.SOLID_COLOR, [0, 0, 0], 1);
                pal.grp.header.dropdown.graphics.foregroundColor = darkColorBrush;
                pal.grp.allGroups.wiggle.freq.freqET.graphics.foregroundColor = darkColorBrush;
                pal.grp.allGroups.wiggle.freq.magET.graphics.foregroundColor = darkColorBrush;
                pal.grp.allGroups.wigglePro.freq.freqET.graphics.foregroundColor = darkColorBrush;
                pal.grp.allGroups.wigglePro.freq.magET.graphics.foregroundColor = darkColorBrush;
                pal.grp.allGroups.wigglePro.octaves.octavesET.graphics.foregroundColor = darkColorBrush;
                pal.grp.allGroups.wigglePro.octaves.ampmultET.graphics.foregroundColor = darkColorBrush;
                pal.grp.allGroups.wigglePro.footer.timeET.graphics.foregroundColor = darkColorBrush;
                pal.grp.allGroups.smooth.freq.freqET.graphics.foregroundColor = darkColorBrush;
                pal.grp.allGroups.smooth.freq.magET.graphics.foregroundColor = darkColorBrush;
                pal.grp.allGroups.loop.theLoops.loopIn.dropDownIn.graphics.foregroundColor = darkColorBrush;
                pal.grp.allGroups.loop.theLoops.loopIn.keys.keyframesET.graphics.foregroundColor = darkColorBrush;
                pal.grp.allGroups.loop.theLoops.loopOut.dropDownOut.graphics.foregroundColor = darkColorBrush;
                pal.grp.allGroups.loop.theLoops.loopOut.keys.keyframesET.graphics.foregroundColor = darkColorBrush;
            }
        }
        return pal;
    }

    function onDropDownListChange() {
        if (this.selection.index == 0) {
            ptAEPal.grp.allGroups.loop.visible = false;
            ptAEPal.grp.allGroups.wigglePro.visible = false;
            ptAEPal.grp.allGroups.smooth.visible = false;
            ptAEPal.grp.allGroups.wiggle.visible = true;
        } else if (this.selection.index == 1) {
            ptAEPal.grp.allGroups.loop.visible = false;
            ptAEPal.grp.allGroups.wiggle.visible = false;
            ptAEPal.grp.allGroups.smooth.visible = false;
            ptAEPal.grp.allGroups.wigglePro.visible = true;
        } else if (this.selection.index == 2) {
            ptAEPal.grp.allGroups.loop.visible = false;
            ptAEPal.grp.allGroups.wiggle.visible = false;
            ptAEPal.grp.allGroups.wigglePro.visible = false;
            ptAEPal.grp.allGroups.smooth.visible = true;
        } else {
            if (this.selection.index == 3) {
                ptAEPal.grp.allGroups.wiggle.visible = false;
                ptAEPal.grp.allGroups.wigglePro.visible = false;
                ptAEPal.grp.allGroups.smooth.visible = false;
                ptAEPal.grp.allGroups.loop.visible = true;
            }
        }
    }

    function onTimeAmountChange() {
        if (isNaN(this.text)) {
            this.text = "0";
        }
    }

    function onFreqAmountChange() {
        if (isNaN(this.text) || parseFloat(this.text) < 0) {
            this.text = ptAE_Data.defaultFreq;
        }
    }

    function onMagAmountChange() {
        if (isNaN(this.text)) {
            this.text = ptAE_Data.defaultMag;
        }
    }

    function onOctavesAmountChange() {
        if (isNaN(this.text) || parseFloat(this.text) <= 0) {
            this.text = ptAE_Data.defaultOctaves;
        }
    }

    function onAmpMultAmountChange() {
        if (isNaN(this.text) || parseFloat(this.text) < 0) {
            this.text = ptAE_Data.defaultAmpMult;
        }
    }

    function onWidthAmountChange() {
        if (isNaN(this.text) || parseFloat(this.text) <= 0) {
            this.text = ptAE_Data.defaultWidth;
        }
    }

    function onSamplesAmountChange() {
        if (isNaN(this.text) || parseFloat(this.text < 1) || parseFloat(this.text) > 100) {
            this.text = ptAE_Data.defaultSamples;
        }
    }

    function onLoopKeyframesChange() {
        if (isNaN(this.text) || parseFloat(this.text) <= 0) {
            if (ptAEPal.grp.allGroups.loop.loopDuration.value == true) {
                this.text = 1
            } else {
                this.text = 0
            }
        } else {
            if (ptAEPal.grp.allGroups.loop.loopDuration.value == false) {
                this.text = Math.floor(this.text);
            }
        }
    }

    function onLoopDurationClick() {
        if (this.value == true) {
            ptAEPal.grp.allGroups.loop.theLoops.loopIn.keys.keyframesST.text = "Duration:";
            ptAEPal.grp.allGroups.loop.theLoops.loopOut.keys.keyframesST.text = "(seconds)";
            if (ptAEPal.grp.allGroups.loop.theLoops.loopIn.keys.keyframesET.text == "0") {
                ptAEPal.grp.allGroups.loop.theLoops.loopIn.keys.keyframesET.text = "1";
            }
            if (ptAEPal.grp.allGroups.loop.theLoops.loopOut.keys.keyframesET.text == "0") {
                ptAEPal.grp.allGroups.loop.theLoops.loopOut.keys.keyframesET.text = "1";
            }
        } else {
            ptAEPal.grp.allGroups.loop.theLoops.loopIn.keys.keyframesST.text = "Keyframes:";
            ptAEPal.grp.allGroups.loop.theLoops.loopOut.keys.keyframesST.text = "(0=All Keys)";
            ptAEPal.grp.allGroups.loop.theLoops.loopIn.keys.keyframesET.text = "0";
            ptAEPal.grp.allGroups.loop.theLoops.loopOut.keys.keyframesET.text = "0";
        }
    }

    function addControlLayer(activeItem) {
        var highestIndex = 0;
        for (var a = 1; a <= activeItem.numLayers; a += 1) {
            var layerName = activeItem.layer(a).name;
            thisIndex = layerName.indexOf("Wiggle Controls ");
            if (thisIndex != -1) {
                var splitArray = layerName.split(" ");
                thisIndex = parseInt(splitArray[2]);
                if (thisIndex > highestIndex) {
                    highestIndex = thisIndex;
                }
            }
        }
        controlLayer = activeItem.layers.addNull();
        controlLayer.startTime = 0;
        controlLayer.enabled = false;
        controlLayer.source.name = "Wiggle Controls " + highestIndex + 1;
        return controlLayer;
    }

    function addControl(controlLayer, controlName, controlValue) {
        for (var b = 1; b <= controlLayer.Effects.numProperties; b += 1) {
            if (controlLayer.Effects.property(b).name == controlName) {
                theControl = controlLayer.Effects.property(b);
                if (theControl.property(1).numKeys == 0) {
                    theControl.property(1).setValue(controlValue);
                }
                return theControl;
            }
        }
        theControl = controlLayer.Effects.addProperty("ADBE Slider Control");
        theControl.name = controlName;
        if (theControl.property(1).numKeys == 0) {
            theControl.property(1).setValue(controlValue);
        }
        return theControl;
    }

    function applyWiggle() {
        var activeItem = app.project.activeItem;
        if (activeItem == null || !(activeItem instanceof CompItem)) {
            alert("No suitable properties were selected.\nSelect one or more properties then click Apply.");
        } else {
            var selectIndex = ptAEPal.grp.header.dropdown.selection.index;
            if (selectIndex == 0) {
                var selectGroup = ptAEPal.grp.allGroups.wiggle;
                var wigString = "result";
                var wiggleString = "wiggle";
            } else if (selectIndex == 1) {
                var selectGroup = ptAEPal.grp.allGroups.wigglePro;
                var wigString = "result";
                selectGroup.octaves.octavesET.notify();
                selectGroup.octaves.ampmultET.notify();
                selectGroup.footer.timeET.notify();
                if (ptAEPal.grp.allGroups.wigglePro.footer.tempWiggle.value == true) {
                    var wiggleString = "temporalWiggle"
                } else {
                    var wiggleString = "wiggle"
                }
            } else {
                if (selectIndex == 2) {
                    var selectGroup = ptAEPal.grp.allGroups.smooth;
                    var wigString = "result";
                    var wiggleString = "smooth";
                }
            }
            selectGroup.freq.freqET.notify();
            selectGroup.freq.magET.notify();
            var xyzCheckArray = new Array(selectGroup.dimensions.x.value, selectGroup.dimensions.y.value, selectGroup.dimensions.z.value);
            var selectedProps = new Array();
            var propLengthsArray = new Array();
            for (var a = 0; a < activeItem.selectedProperties.length; a += 1) {
                thisProp = activeItem.selectedProperties[a];
                if (thisProp.propertyType == PropertyType.PROPERTY && thisProp.canVaryOverTime && thisProp.propertyValueType != PropertyValueType.CUSTOM_VALUE && thisProp.propertyValueType != PropertyValueType.SHAPE && thisProp.propertyValueType != PropertyValueType.TEXT_DOCUMENT) {
                    if (thisProp.propertyValueType == PropertyValueType.OneD) {
                        selectedProps.push(thisProp);
                        propLengthsArray.push(1);
                    } else {
                        if (!xyzCheckArray[0] && !xyzCheckArray[1] && !xyzCheckArray[2]) {
                            continue;
                        }
                        theLayer = thisProp.propertyGroup(thisProp.propertyDepth);
                        propLength = thisProp.value.length;
                        if (propLength == 3 && theLayer instanceof AVLayer && !thisProp.propertyGroup(thisProp.propertyDepth).threeDLayer) {
                            propLength = 2
                        }
                        if (propLength < 3 && !xyzCheckArray[0] && !xyzCheckArray[1]) {
                            continue;
                        }
                        selectedProps.push(thisProp);
                        propLengthsArray.push(propLength);
                    }
                }
            }
            if (selectedProps.length == 0) {
                alert("No suitable properties were selected.\nSelect one or more properties then click Apply.");
            } else {
                app.beginUndoGroup("Add Expressions");
                var freqString = selectGroup.freq.freqET.text;
                var ampString = selectGroup.freq.magET.text;
                if (selectIndex == 1) {
                    var octaves = parseFloat(selectGroup.octaves.octavesET.text);
                    var amp_mult = parseFloat(selectGroup.octaves.ampmultET.text);
                    var timeOffset = parseFloat(selectGroup.footer.timeET.text);
                }
                var expStartString = "";
                var addControlEffect = false;
                if (selectIndex == 1 && selectGroup.sliders.freq.value || selectIndex < 2 && selectGroup.sliders.mag.value) {
                    addControlEffect = true;
                    var singleLayer = true;
                    if (selectedProps.length > 1) {
                        var thisProp = selectedProps[0];
                        var firstIndex = thisProp.propertyGroup(thisProp.propertyDepth).index;
                        for (var a = 1; a < selectedProps.length; a += 1) {
                            thisProp = selectedProps[a];
                            if (thisProp.propertyGroup(thisProp.propertyDepth).index != firstIndex) {
                                singleLayer = false;
                                break;
                            }
                        }
                    }
                    if (singleLayer) {
                        var layerMatchName = selectedProps[0].propertyGroup(selectedProps[0].propertyDepth).matchName;
                        if (layerMatchName == "ADBE Light Layer" || layerMatchName == "ADBE Camera Layer") {
                            singleLayer = false
                        }
                    }
                    if (singleLayer) {
                        var controlLayer = selectedProps[0].propertyGroup(selectedProps[0].propertyDepth);
                        for (var a = 0; a < selectedProps.length; a += 1) {
                            if (selectedProps[a].propertyGroup(selectedProps[a].propertyDepth - 1).matchName == "ADBE Effect Parade") {
                                var selectedProps2 = new Array();
                                var thisLayer = thisProp.propertyGroup(thisProp.propertyDepth);
                                var theEffects = thisLayer.property("ADBE Effect Parade");
                                for (var a = 0; a < selectedProps.length; a += 1) {
                                    thisProp = selectedProps[a];
                                    if (thisProp.propertyGroup(thisProp.propertyDepth - 1).matchName == "ADBE Effect Parade") {
                                        for (var b = 1; b <= theEffects.numProperties; b += 1) {
                                            if (theEffects.property(b) == thisProp.propertyGroup(1)) {
                                                effectIndex = b;
                                                break;
                                            }
                                        }
                                        selectedProps2.push([thisProp, thisProp.matchName, effectIndex, thisLayer.index]);
                                    } else {
                                        selectedProps2.push(thisProp)
                                    }
                                }
                                selectedProps = selectedProps2;
                                break;
                            }
                        }
                    } else {
                        var controlLayer = addControlLayer(activeItem)
                    }
                }
                if (selectIndex < 2) {
                    if (selectIndex == 1 && selectGroup.sliders.freq.value) {
                        var freqControl = addControl(controlLayer, "Wiggle Freq", freqString);
                        if (singleLayer) {
                            expStartString += "freq = thisLayer.effect(\"Wiggle Freq\")(1);\r"
                        } else {
                            expStartString += "freq = thisComp.layer(\"" + controlLayer.name + "\").effect(\"Wiggle Freq\")(1);\r"
                        }
                    } else {
                        expStartString += "freq = " + freqString + ";\r"
                    }
                    freqString = "freq";
                    if (selectGroup.sliders.mag.value) {
                        var magControl = addControl(controlLayer, "Wiggle Amount", ampString);
                        if (singleLayer) {
                            expStartString += "amp = thisLayer.effect(\"Wiggle Amount\")(1);\r"
                        } else {
                            expStartString += "amp = thisComp.layer(\"" + controlLayer.name + "\").effect(\"Wiggle Amount\")(1);\r"
                        }
                    } else {
                        expStartString += "amp = " + ampString + ";\r"
                    }
                    ampString = "amp";
                }
                if (selectIndex == 2) {
                    expStartString += "range = " + freqString + ";\r";
                    expStartString += "samples = " + ampString + ";\r";
                    freqString = "range";
                    ampString = "samples";
                }
                for (var a = 0; a < selectedProps.length; a += 1) {
                    if (selectedProps[a].length > 1) {
                        thisProp = activeItem.layer(selectedProps[a][3]).property("ADBE Effect Parade").property(selectedProps[a][2]).property(selectedProps[a][1]);
                    } else {
                        thisProp = selectedProps[a]
                    }
                    easyWiggle = true;
                    scaleLock = false;
                    propLength = propLengthsArray[a];
                    if (propLength > 1) {
                        for (var b = 0; b < Math.min(propLength, 3); b += 1) {
                            if (xyzCheckArray[b] != true) {
                                easyWiggle = false;
                                break;
                            }
                        }
                        if (easyWiggle == true && thisProp.matchName == "ADBE Scale" && selectIndex != 2) {
                            scaleLock = true
                        }
                    }
                    if (easyWiggle == true && scaleLock == false) {
                        if (selectIndex == 1 && octaves != 1 || amp_mult != 0.5 || timeOffset != 0) {
                            if (timeOffset != 0) {
                                expressionString = expStartString + wiggleString + "(" + freqString + ", " + ampString + ", " + octaves + ",  " + amp_mult + ", time+" + timeOffset + ");";
                            } else {
                                expressionString = expStartString + wiggleString + "(" + freqString + ", " + ampString + ", " + octaves + ", " + amp_mult + ");";
                            }
                        } else {
                            expressionString = expStartString + wiggleString + "(" + freqString + ", " + ampString + ");"
                        }
                        thisProp.expression = expressionString;
                    } else {
                        if (selectIndex == 1 && octaves != 1 || amp_mult != 0.5 || timeOffset != 0) {
                            if (timeOffset != 0) {
                                var expressionString = expStartString + wigString + " = " + wiggleString + "(" + freqString + ", " + ampString + ", " + octaves + ", " + amp_mult + ", time+" + timeOffset + ");\r[";
                            } else {
                                var expressionString = expStartString + wigString + " = " + wiggleString + "(" + freqString + ", " + ampString + ", " + octaves + ", " + amp_mult + ");\r[";
                            }
                        } else {
                            var expressionString = expStartString + wigString + " = " + wiggleString + "(" + freqString + ", " + ampString + ");\r["
                        }
                        for (var b = 0; b < propLength - 1; b += 1) {
                            if (xyzCheckArray[b] == true) {
                                if (scaleLock == true) {
                                    expressionString += wigString + "[0],"
                                } else {
                                    expressionString += wigString + "[" + b + "],"
                                }
                            } else {
                                expressionString += "value[" + b + "],"
                            }
                        }
                        if (xyzCheckArray[propLength - 1] == true) {
                            if (scaleLock == true) {
                                expressionString += wigString + "[0]];"
                            } else {
                                expressionString += wigString + "[" + (propLength - 1) + "]];"
                            }
                        } else {
                            expressionString += "value[" + (propLength - 1) + "]];"
                        }
                        thisProp.expression = expressionString;
                    }
                }
                app.endUndoGroup();
            }
        }
    }

    function applyLoop() {
        if (ptAEPal.grp.allGroups.loop.theLoops.loopIn.loopCheck.value == true || ptAEPal.grp.allGroups.loop.theLoops.loopOut.loopCheck.value == true) {
            var activeItem = app.project.activeItem;
            if (activeItem == null || !(activeItem instanceof CompItem)) {
                alert("No suitable properties were selected.\nSelect one or more properties then click Apply.");
            } else {
                var selectedProps = new Array();
                for (var a = 0; a < activeItem.selectedProperties.length; a += 1) {
                    thisProp = activeItem.selectedProperties[a];
                    if (thisProp.propertyType == PropertyType.PROPERTY && thisProp.canVaryOverTime && thisProp.propertyValueType != PropertyValueType.CUSTOM_VALUE && thisProp.propertyValueType != PropertyValueType.SHAPE && thisProp.propertyValueType != PropertyValueType.TEXT_DOCUMENT && thisProp.numKeys > 0) {
                        selectedProps.push(thisProp);
                    }
                }
                if (selectedProps.length == 0) {
                    alert("No suitable properties were selected.\nSelect one or more properties with keyframes, then click Apply.");
                } else {
                    app.beginUndoGroup("Add Expressions");
                    var selectGroup = ptAEPal.grp.allGroups.loop;
                    var loopIn = selectGroup.theLoops.loopIn;
                    var loopOut = selectGroup.theLoops.loopOut;
                    loopIn.keys.keyframesET.notify();
                    loopOut.keys.keyframesET.notify();
                    var loopInString = "loopIn";
                    var loopOutString = "loopOut";
                    if (selectGroup.loopDuration.value == true) {
                        loopInString += "Duration";
                        loopOutString += "Duration";
                    }
                    loopInString += "(\"" + loopIn.dropDownIn.selection.toString() + "\"";
                    loopOutString += "(\"" + loopOut.dropDownOut.selection.toString() + "\"";
                    if (loopIn.keys.keyframesET.text != "0" && loopIn.dropDownIn.selection.toString() != "continue") {
                        loopInString += ", " + loopIn.keys.keyframesET.text;
                    }
                    if (loopOut.keys.keyframesET.text != "0" && loopOut.dropDownOut.selection.toString() != "continue") {
                        loopOutString += ", " + loopOut.keys.keyframesET.text;
                    }
                    loopInString += ");";
                    loopOutString += ");";
                    if (loopIn.loopCheck.value == true && loopOut.loopCheck.value == true) {
                        var finalString = "if (time <= key(1).time) " + loopInString + "\relse " + loopOutString;
                    } else if (loopIn.loopCheck.value == true) {
                        var finalString = loopInString
                    } else {
                        var finalString = loopOutString
                    }
                    for (var a = 0; a < selectedProps.length; a += 1) {
                        selectedProps[a].expression = finalString;
                    }
                    app.endUndoGroup();
                }
            }
        }
    }

    function helpWindow() {
        ptAE_Data.helpWindow = new Window("palette { \n\t\t\t\torientation: 'column' , text:'" + ptAE_Data.scriptName + "', \n\t\t\t\theaderST: StaticText { text:'" + ptAE_Data.strHelpHeader + "', alignment:['left','top'] }, \n\t\t\t\thelpET: EditText { text:'', alignment:['fill','fill'], properties:{multiline:true}}, \n\t\t\t\tbuttons: Group{ orientation: 'row', alignment:['fill','bottom'], \n\t\t\t\t\thelpBtn1: Button { text:'" + ptAE_Data.strHelpBtn1 + "', alignment:['fill','center'] }, \n\t\t\t\t\thelpBtn2: Button { text:'" + ptAE_Data.strHelpBtn2 + "', alignment:['fill','center'] }, \n\t\t\t\t}, \n\t\t\t}");
        var win = ptAE_Data.helpWindow;
        if (ptAEPal instanceof Window) {
            win.helpET.text = ptAE_Data.strHelpText + ptAE_Data.strHelpText2
        } else {
            win.helpET.text = ptAE_Data.strHelpText
        }
        win.buttons.helpBtn1.preferredSize.height = win.buttons.helpBtn2.preferredSize.height = win.buttons.helpBtn2.preferredSize.height * 1.5;
        win.buttons.helpBtn1.onClick = function() {
            if (isSecurityPrefSet()) {
                openURL(ptAE_Data.strHelpBtn1Url)
            } else {
                alert(ptAE_Data.strErrScriptAccess, ptAE_Data.scriptName)
            }
        };
        win.buttons.helpBtn2.onClick = function() {
            if (isSecurityPrefSet()) {
                openURL(ptAE_Data.strHelpBtn2Url)
            } else {
                alert(ptAE_Data.strErrScriptAccess, ptAE_Data.scriptName)
            }
        };
        win.layout.layout(true);
        win.size = [550, 620];
        win.show();
    }

    function openURL(url) {
        if ($.os.indexOf("Windows") != -1) {
            system.callSystem("cmd /c \"" + ptAE_Data.winBrowserCmd + "\" " + url);
        } else {
            system.callSystem(ptAE_Data.macBrowserCmdStart + url + ptAE_Data.macBrowserCmdEnd);
        }
    }

    function isSecurityPrefSet() {
        var securitySetting = app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY");
        return securitySetting == 1;
    }
    if (parseFloat(app.version) < 8) {
        alert("This script requires After Effects CS3 or greater");
    } else {
        var ptAEPal = pt_AutoExpress_buildUI(thisObj);
        if (ptAEPal != null) {
            if (ptAEPal instanceof Window) {
                ptAEPal.center();
                ptAEPal.show();
            }
        }
    }
}
pt_AutoExpress(this);