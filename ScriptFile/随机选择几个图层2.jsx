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

//全局变量:
var scriptVer = "1.1";
var wt = 50.0;
var keepSel = true;

function doRando(winObj){
    var alertMsg = "";
    var activeItem = app.project.activeItem;
    if (activeItem == null || !(activeItem instanceof CompItem)){
        alert("You need to select some layers first.");
    } else {
        var selectedLayers = activeItem.selectedLayers;
        var selNum = activeItem.selectedLayers.length;
        if (selNum == 0) {
            alert("未选择任何图层。");
        } else {
            app.beginUndoGroup("Layer On Randomization");
            winObj.randoBttn.text = "Wait ... "
            winObj.randoBttn.enabled = false;
            for (var la = (selNum-1); la >= 0; la--) {//working backwards here.
                var rando=(Math.floor( Math.random() * 100)+1);
                var bool=true;
                if (rando<=wt) {bool=false;}
                currLayer = selectedLayers[la];
                currLayer.enabled = bool;
                if (!keepSel) {currLayer.selected = bool;}
            }
            winObj.randoBttn.text = "开始随机选择"
            winObj.randoBttn.enabled = true;
            app.endUndoGroup();
        }
    }
}

function buildUI(this_obj_) {
    var win = (this_obj_ instanceof Panel)
    ? this_obj_
    : new Window('palette', '随机选择选图层 (v' + scriptVer + ')',[237,170,708,290]);
    
    win.theSlider = win.add('slider', [22,32,449,65], 50, 0, 100);
    
    win.theSlider.onChange = function () { wt=(win.theSlider.value);}
    
    win.ctl_label4 = win.add('statictext', [22,18,449,38], '选择多一些                                  ← 随机偏向 →                                     选择少一些');
    win.ctl_label4.justify = 'center';
    
    win.selAllBttn = win.add('checkbox', [47,80,146,100], '保持选择');
    win.selAllBttn.value = keepSel;
    win.selAllBttn.onClick = function () { keepSel = win.selAllBttn.value; }
    
    win.randoBttn = win.add('button', [174,74,314,100], '开始随机选择层');
    win.closeBttn = win.add('button', [340,74,410,100], '退出');
    win.closeBttn.onClick = function () { this.parent.close(1) ;}
    win.randoBttn.onClick = function () { doRando(win) ;}
    
    return win
}
var w = buildUI(this);
if (w.toString() == "[object Panel]") {
    w;
} else {
    w.show();
}