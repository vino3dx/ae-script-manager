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

vers = "1.0";
var win = new Window('palette', '选中的图层改名 (v' + vers + ')',[300,100,645,396]);
var w = buildUI();
if (w != null) {
    w.show();
}

function buildUI() {
    if (win != null) {
        win.nameSearchLabel = win.add('statictext', [14,15,314,37], '搜索名字:');
        win.nameSearchT = win.add('edittext', [25,40,325,62], '');
        win.nameReplaceLabel = win.add('statictext', [14,73,314,95], '替换为:');
        win.nameReplaceT = win.add('edittext', [25,98,325,120], '');
        win.typePnl = win.add('panel', [16,138,206,243+25], '改名方式:');
        win.progLbl = win.add('statictext', [20,271,206,308], '');
        
        win.repRad = win.typePnl.add('radiobutton', [14,13,174,35], '搜索并替换');
        win.repRad.value = true;
        win.repRad.onClick = function () {
            doTextChange(win.nameSearchLabel, '在名字中搜索:');
            doTextChange(win.nameReplaceLabel, '替换为:');
            
            doViz(win.startNumLabel, true);
            doViz(win.startNumT, true);
            doViz(win.countNumLabel, true);
            doViz(win.countNumT, true);
        };
        win.appRad = win.typePnl.add('radiobutton', [14,39,174,61], '添加');
        win.appRad.onClick = function () {
            doTextChange(win.nameSearchLabel, '开头添加:');
            doTextChange(win.nameReplaceLabel, '结尾添加:');
            doViz(win.startNumLabel, true);
            doViz(win.startNumT, true);
            doViz(win.countNumLabel, true);
            doViz(win.countNumT, true);
        };
        win.remRad = win.typePnl.add('radiobutton', [14,65,174,87], '移除字符');
        win.remRad.onClick = function () {
            doTextChange(win.nameSearchLabel, '从开头移除多少字符:');
            doTextChange(win.nameReplaceLabel, '从结尾移除多少字符:');
            doViz(win.startNumLabel, true);
            doViz(win.startNumT, true);
            doViz(win.countNumLabel, true);
            doViz(win.countNumT, true);
            
        };
        win.numRad = win.typePnl.add('radiobutton', [14,90,174,112], '数字');
        win.numRad.onClick = function () {
            doTextChange(win.nameSearchLabel, '数字前的字符 (或者为空白):');
            doTextChange(win.nameReplaceLabel, '数字后的字符 (或者为空白):');
            doViz(win.startNumLabel, false);
            doViz(win.startNumT, false);
            doViz(win.countNumLabel, false);
            doViz(win.countNumT, false);
            
        };
        
        win.startNumLabel = win.add('statictext', [225,143,270,165], '开始:');
        win.startNumLabel.visible = false;
        win.startNumT = win.add('edittext', [279,140,324,162], '0');
        win.startNumT.visible = false;
        win.countNumLabel = win.add('statictext', [225,176,270,198], '相隔:');
        win.countNumLabel.visible = false;
        win.countNumT = win.add('edittext', [279,173,324,195], '1');
        win.countNumT.visible = false;
        
        win.okBtn = win.add('button', [240,210,320,232], '确认', {name:'OK'});
        win.okBtn.onClick = function () { doRenaming(this.parent); };
        
        win.cancBtn = win.add('button', [240,245,320,267], '退出', {name:'Cancel'});
         win.cancBtn.onClick = function () {this.parent.close(1)};}
     
    return win
}


function doTextChange(target, newText) {
    target.text = newText;
}

function doViz(target, bool) {
    target.visible = !bool;
}

function splitReplace(st, ss, rs) {
    var stArray = st.split(ss);
    var patchedString = "";
    var i = 0;
    while (i < (stArray.length)) {
        if (i == (stArray.length-1)) {rs = "";}
        patchedString = (patchedString + (stArray[i] + rs) );
        i = (i + 1);
    }
  //  alert(patchedString);
    return patchedString
}


function doRenaming(theDialog) {
    // make sure a comp is selected
    var activeItem = app.project.activeItem;
    if (activeItem == null || !(activeItem instanceof CompItem)){
        alert("You need to select some layers first.");
    } else {
        
        var s = activeItem.selectedLayers;
        var selNum = s.length;
        if (selNum < 2) {
            alert("You need to select at least two layers first.");
        } else {
            
            app.beginUndoGroup("layer rename");
            var inputError = false;
            theDialog.progLbl.text = 'WORKING ............. PLEASE WAIT';
            theDialog.hide();
            theDialog.show();
            
            for (var n = (selNum-1); n >= 0; n--) {
                if ( ! inputError ) {
                    item = s[n];
                    oldName = item.name;
                    sear = theDialog.nameSearchT.text;
                    repl = theDialog.nameReplaceT.text
                    
                    newName = oldName;
                    
                    if (theDialog.repRad.value) {
                        
                    newName = splitReplace(newName, sear, repl);
                    
                    //now we check for pre-cs4 app version, for which we truncate:
                    if ((parseFloat(app.version) < 9.0)) { newName=(newName.substr(0,25));}
                    } else if (theDialog.appRad.value) {
                        newName=(sear + oldName + repl );
                    } else if (theDialog.remRad.value) {
                        if (sear == "") {sear = 0;}
                        if (repl == "") {repl = 0;}
                        sear = ( parseFloat(sear) );
                        repl = ( parseFloat(repl) );
                        if ( (isNaN(sear)) || (isNaN(repl)) ) {
                            alert('Error: Not a number?');
                            inputError = true;
                        } else {
                            newName=(newName.substr( sear, oldName.length-repl ));
                            sear="";
                            repl="";
                        }
                        
                    } else if (theDialog.numRad.value) {
                        
                        sear = theDialog.startNumT.text;
                        repl = theDialog.countNumT.text
                        if (sear == "") {sear = 0;}
                        if ( (repl == "") || (repl == 0) ) {repl = "NaN";}
                        sear = ( parseFloat(sear) );
                        repl = ( parseFloat(repl) );
                        
                        if ( (isNaN(sear)) || (isNaN(repl)) ) {
                            alert('Error: Not a number, or invalid number to count by.');
                            inputError = true;
                        } else {
                            h = theDialog.nameSearchT.text;
                            t = theDialog.nameReplaceT.text;
                            numNum = ((n * repl) + sear);
                            newName = (h + numNum.toString() + t);
                     //now we check for pre-cs4 app version and we error if name too long:
                    if ((parseFloat(app.version) < 9.0)) {
                            if (newName.length > 25) {
                                inputError = true ;
                                // this generates 'error', at beginning of loop,
                                // which is largest number (highest number)
                                alert('Error: Name too long.');
                            }
                     }
                            sear="";
                            repl="";
                        }
                    }
                    
                    //////////////////////
                    if (! inputError) { item.name = newName;
                        
                    } else {
                        theDialog.progLbl.text = '(ERROR)';
                    }
                    //////////////////////
                }
            }
            if (! inputError) {theDialog.progLbl.text = '';}
            app.endUndoGroup();
            
        }
    }
    
}