/* 

名称: Mask居中
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

function RampLight(thisObj){
var hueBin="\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\u00C8\x00\x00\x00\x14\b\x02\x00\x00\x00G\u00C6\u00E5\u009D\x00\x00\x00\tpHYs\x00\x00\x00\x01\x00\x00\x00\x01\x018\"\u00F4@\x00\x00\x00$zTXtCreator\x00\x00x\u009CsL\u00C9OJUpL+I-RpMKKM.)\x06\x00Az\x06\u00CE\u00E7\u00CDsf\x00\x00\x00\u0094IDATh\u0081\u00ED\u00D2\u00B1\x0E\u0082@\x10\x06\u00E1_Q\x0B\u00E4\u00FD\u009F\u00F4l rVW\x01J\u0090\u00E9\u00E6\u00CB\x15\x1B\u00B2\u00C5\u0086\u00CC\u00A5&\u00B9'C\u00F2hou>\u00B6\u00D0\u0086\u00F7-%\x19\u00DB+\u008Bak\u00DE\u00B90%cR\u00D3\u00FFw\u00EE\u00AF\u0085\u00F9y\u00CE\u00B9_\u00E6W\u00BA\u00F9\u00F0o\u00DE\u00BFPO:}\u00F5\u00E3\u0094\u0094k$\u0080a\taXB\x18\u0096\x10\u0086%\u0084a\taXB\x18\u0096\x10\u0086%\u0084a\taXB\x18\u0096\x10\u0086%\u0084a\taXB\x18\u0096\x10\u0086%\u0084a\taXB|\x00\"\u0087h07\x15\u00F2\u00EA\x00\x00\x00\x00IEND\u00AEB`\u0082";
var thisFolder=new Folder(Folder.userData.fullName+"/RampLight");
thisFolder.create();
var hueImage=new File(thisFolder.fullName+"/hue.png");
hueImage.encoding="BINARY";
hueImage.open("w");
hueImage.write(hueBin);
hueImage.close();
function buideUI(obj){
    var myPanel=(obj instanceof Panel)? obj : new Window("palette","添加调光（带通道）", [0,0,220,140]);
    with(myPanel){
	myPanel.image_hue = add( "image", [10,5,210,25],hueImage);
	myPanel.slider_hue = add( "slider", [0,25,222,45],200,0,360);
	myPanel.but_zs = add( "button", [10,45,40,75], '↘' );
	myPanel.but_s = add( "button", [40,45,70,75], '↓' );
	myPanel.but_ys = add( "button", [70,45,100,75], '↙' );
	myPanel.but_z = add( "button", [10,75,40,105], '→' );
	myPanel.but_m = add( "button", [40,75,70,105], '+' );
	myPanel.but_y = add( "button", [70,75,100,105], '←' );
	myPanel.but_zx = add( "button", [10,105,40,135], '↗' );
	myPanel.but_x = add( "button", [40,105,70,135], '↑' );
	myPanel.but_yx = add( "button", [70,105,100,135], '↖' );
	}
    return myPanel;
}
var win=buideUI(thisObj);
if(win instanceof Window){
    win.center();
    win.show();
}
//
var thisComp,sl,cw,ch,pix,dur;
function selComp(){
    thisComp=app.project.activeItem;
    if(!(thisComp instanceof CompItem)){
        alert("没有选中合成");
        return false;
    }else{
        cw=thisComp.width;
        ch=thisComp.height;
        pix=thisComp.pixelAspect;
        dur=thisComp.duration;
        return true;
    }
}
function selLayer(){
    thisComp=app.project.activeItem;
    if(!(thisComp instanceof CompItem)){
        //alert("没有选中合成");
        return false;
    }else if(thisComp.selectedLayers.length<1){
        //alert("没有选中层");
        return false;
    }else{
        sl=thisComp.selectedLayers;
        return true;
    }
}
//
function thisCount(){
    var count=1;
    for(var i=1;i<=thisComp.numLayers;i++){
        if(thisComp.layer(i).name.substr(0,9)=="RampLight"){
            count++;
        }
    }
    return count;
}
//
function addLight(startPoint,endPoint){
    app.beginUndoGroup("RampLight");
    var tempLayer=0;
    if(selLayer()==true){
        tempLayer=sl[0];
    }
    var tSolid=thisComp.layers.addSolid([0,0,0],"RampLight"+thisCount(),cw,ch,pix,dur);
    if(tempLayer != 0){
        tSolid.moveBefore(tempLayer);
        tSolid.inPoint=tempLayer.inPoint;
        tSolid.outPoint=tempLayer.outPoint;
    }
    var tRamp=tSolid.effect.addProperty('ADBE Ramp');
    tRamp(1).setValue(startPoint);
    tRamp(3).setValue(endPoint);
    tRamp(4).setValue([0,0,0,1]);
    tRamp(2).expression="hslToRgb(["+win.slider_hue.value/360+",1,0.5,1]);";
    tRamp(2).setValue(tRamp(2).value);
    tRamp(2).expression="";
    tRamp(5).setValue(2);
    var tExtract=tSolid.effect.addProperty('ADBE Extract');
    tExtract(3).setValue(128);
    tExtract(5).expression="thisProperty.propertyGroup(1)(3);";
    tSolid.blendingMode=BlendingMode.SCREEN;
    tSolid.effect(1).selected=true;
    app.endUndoGroup();
}
//
win.but_zs.onClick=function (){
    if(selComp()==true){
         addLight([0,0],[cw,ch]);
    }
}
win.but_s.onClick=function (){
    if(selComp()==true){
         addLight([cw/2,0],[cw/2,ch]);
    }
}
win.but_ys.onClick=function (){
    if(selComp()==true){
         addLight([cw,0],[0,ch]);
    }
}
win.but_z.onClick=function (){
    if(selComp()==true){
         addLight([0,ch/2],[cw,ch/2]);
    }
}
win.but_m.onClick=function (){
    if(selComp()==true){
         addLight([cw/2,ch/2],[cw,ch]);
    }
}
win.but_y.onClick=function (){
    if(selComp()==true){
         addLight([cw,ch/2],[0,ch/2]);
    }
}
win.but_zx.onClick=function (){
    if(selComp()==true){
         addLight([0,ch],[cw,0]);
    }
}
win.but_x.onClick=function (){
    if(selComp()==true){
         addLight([cw/2,ch],[cw/2,0]);
    }
}
win.but_yx.onClick=function (){
    if(selComp()==true){
         addLight([cw,ch],[0,0]);
    }
}
}
RampLight(this);












