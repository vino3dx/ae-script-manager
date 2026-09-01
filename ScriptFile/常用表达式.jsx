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

{
	function myroot(thisObj)
	{
		var scriptName = "常用表达式 by 视效网";

		function onliuguang()
		{
var rootcom=app.project.activeItem;
var myavi=rootcom.selectedLayers[0];
e1=myavi.effect.addProperty("ADBE Slider Control");
e1.name="振幅系数";
e1(1).setValue(0.1);
e2=myavi.effect.addProperty("ADBE Slider Control");
e2.name="频率系数";
e2(1).setValue(2);
e3=myavi.effect.addProperty("ADBE Slider Control");
e3.name="阻力系数";
e3(1).setValue(2);
e4=myavi.effect.addProperty("ADBE Checkbox Control");
e4.name="单向弹动";
e4(1).setValue(0);
myavi.position.expression=
"""amp = effect("振幅系数")(1);
freq = effect("频率系数")(1);
decay = effect("阻力系数")(1);
flag=effect("单向弹动")(1)
n = 0;
if (numKeys > 0){
n = nearestKey(time).index;
if (key(n).time > time){n--;}
					}
if (n == 0){ t = 0;}else{t = time - key(n).time;}
if (n > 0){
     v = velocityAtTime(key(n).time - thisComp.frameDuration/10);
	if(flag==0){temp=Math.sin(freq*t*2*Math.PI);}
	else{temp=-Math.abs(Math.sin(freq*t*2*Math.PI))}
	value + v*amp*temp/Math.exp(decay*t);
}else{value}""";
alert("表达式添加结束！");
		}
		function onliuguangHP()
		{
			alert(
				"　　添加弹性表达式要求：\n\n" +
				"　　1、选定要添加表达式的层，点击要添加表达式名称按钮。\n\n" +
				"　　2、单向弹动是小球落地的方式的弹动。\n\n" +
				"　　3、根据个人需要调节参数控制滑块。\n\n"
,"弹性表达式 by 视效网");
		}


		function onyinying()
		{
var rootcom=app.project.activeItem;
var myavi=rootcom.selectedLayers[0];
e1=myavi.effect.addProperty("ADBE Slider Control");
e1.name="放大倍数(%)";
e1(1).setValue(300)
e2=myavi.effect.addProperty("ADBE Slider Control");
e2.name="过渡帧数";
e2(1).setValue(5)

myavi.scale.expression=
"""snapScale = effect("放大倍数(%)")(1);
trans = effect("过渡帧数")(1);
n = 0;
trans = trans * thisComp.frameDuration; 
inTrans  = easeOut(time, inPoint, inPoint + trans, [snapScale,snapScale], [0,0]); 
outTrans = easeIn(time, outPoint, outPoint - trans, [0,0], [snapScale, snapScale]); 
value+ inTrans + outTrans """
		}


		function onyinyingHP()
		{
			alert(
				"　　文字飞入飞出表达式要求：\n\n" +
				"　　１、选择的必须是文字层。\n\n" +
				"　　２、根据自己需要调整滑杆。\n\n","文字飞入飞出 by 视效网");
		}
	
		function onsaoguang()
		{
var rootcom=app.project.activeItem;
var myavi=rootcom.selectedLayers[0];
e1=myavi.effect.addProperty("ADBE Slider Control");
e1.name="过渡帧数";
e1(1).setValue(20);
myavi.opacity.expression=
"""transition = effect("过渡帧数")(1);
if (marker.numKeys<2){ 
tSecs = transition / ( 1 / thisComp.frameDuration); 
linear(time, inPoint, inPoint + tSecs, 0, 100) - linear(time, outPoint - tSecs, outPoint, 0, 100); 
}else{ 
linear(time, inPoint, marker.key(1).time, 0, 100) - linear(time, marker.key(2).time, outPoint, 0, 100); 
} """

		}
	
			function onsaoguangHP()
		{
			alert(
				"　　渐变过渡表达式：\n\n" +
				"　　１、选择一个任意对象图层，点击表达式添加按钮。\n\n" +
"　　２、根据自己需要调节过渡帧数滑块。\n\n","渐变过渡 by 视效网");
		}
			function onlitizi()
		{
var rootcom=app.project.activeItem;
var myavi=rootcom.selectedLayers[0];
e1=myavi.effect.addProperty("ADBE Slider Control");
e1.name="晃动几率";
e1(1).setValue(8);
e2=myavi.effect.addProperty("ADBE Slider Control");
e2.name="晃动幅度";
e2(1).setValue(50);
e4=myavi.effect.addProperty("ADBE Checkbox Control");
e4.name="交换轴向";
e4(1).setValue(0);
myavi.position.expression=
"""probability = effect("晃动几率")(1);
pos = effect("晃动幅度")(1);
flag=effect("交换轴向")(1);
val  = random(-probability-2, 1);
m = clamp(val, 0, 1);
y = wiggle(10, pos*m)-position;
if(flag==0){value + [0, y[1]];}
else{value + [y[0],0];}
"""


		}
			function onlitiziHP()
		{
			alert(
				"　　随机晃动表达式：\n\n" +
				"　　１、选择要发生晃动的对象层，点击表达式添加按钮。\n\n" +
				"　　２、根据个人喜好调整滑杆，注意晃动几率的数值越大实际几率越小。\n\n"+
				"　　３、默认只在Y轴有晃动，如果勾选交换轴向，那么只在X轴有晃动。","随机晃动表达式 by 视效网");
		}
		function onqitaHP()
		{
			var myact=app.project.activeItem
			var ly=myact.layer(1)
			alert( ly.width);
		}

	

		
	

		
		if (parseFloat(app.version) < 8)
		{
			alert("这个脚本只能运行在CS3以上版本", scriptName);
			return;
		}
		else
		{

			var my_palette = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptName, undefined, {resizeable:true});
			if (my_palette != null)
			{
				var res = 
				"group { \
					orientation:'column', alignment:['fill','fill'], alignChildren:['left','top'], spacing:5, margins:[0,0,0,0], \
					cmds: Group { \
						alignment:['fill','top'], \
						liuguang: Button { text:'弹性表达式', alignment:['fill','center'] }, \
						liuguangHP: Button { text:'?', alignment:['right','center'], preferredSize:[25,20] }, \
						yinying: Button { text:'文字飞入飞出', alignment:['fill','center'] }, \
						yinyingHP: Button { text:'?', alignment:['right','center'], preferredSize:[25,20] }, \
					}, \
					cmds1: Group { \
						alignment:['fill','top'], \
						saoguang: Button { text:'透明过渡', alignment:['fill','center'] }, \
						saoguangHP: Button { text:'?', alignment:['right','center'], preferredSize:[25,20] }, \
						litizi: Button { text:'随机振动', alignment:['fill','center'] }, \
						litiziHP: Button { text:'?', alignment:['right','center'], preferredSize:[25,20] }, \
					}, \
				}";
				
				my_palette.margins = [10,10,10,10];
				my_palette.grp = my_palette.add(res);
				
				my_palette.grp.cmds.liuguang.onClick    = onliuguang;
				my_palette.grp.cmds.yinying.onClick = onyinying;
				my_palette.grp.cmds.liuguangHP.onClick    = onliuguangHP;
				my_palette.grp.cmds.yinyingHP.onClick    = onyinyingHP;
				my_palette.grp.cmds1.saoguang.onClick = onsaoguang;
				my_palette.grp.cmds1.saoguangHP.onClick    = onsaoguangHP;
				my_palette.grp.cmds1.litizi.onClick = onlitizi;
				my_palette.grp.cmds1.litiziHP.onClick    = onlitiziHP;
				
				my_palette.layout.layout(true);
				my_palette.layout.resize();
				my_palette.onResizing = my_palette.onResize = function () {this.layout.resize();}
			
				if (my_palette instanceof Window) {
					my_palette.center();
					my_palette.show();
				} else {
					my_palette.layout.layout(true);
				}
			}
			else {
				alert("不能打开用户界面", scriptName);
			}
		}
	}
	
	
	myroot(this);

}