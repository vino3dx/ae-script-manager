var w = buildUI();
if (w != null) {
    w.show();
}

function buildUI(thisObj) {
    var win = new Window("palette", "实用表达式集", [300, 100, 560, 355]);
    currentPA = 1;
    if (win != null) {
        win.originPnl = win.add("statictext", [110, 10, 260, 25], "　说明:");
        win.originPnl = win.add("statictext", [117, 30, 258, 50], "丨脚本由视效网搬运丨");
        win.originPnl = win.add("statictext", [117, 50, 258, 70], "丨公众号：视效网    丨");
        win.originPnl = win.add("statictext", [117, 70, 258, 90], "丨网站：wanvfx.com  丨");
        win.originPnl = win.add("statictext", [117, 90, 258, 110], "丨脚本老鹰前辈编写丨");
        win.originPnl = win.add("statictext", [117, 110, 258, 130], "丨该脚本为改写版本丨");
        win.originPnl = win.add("statictext", [117, 130, 258, 150], "丨禁止任何形式商用丨");
        win.originPnl = win.add("statictext", [117, 155, 258, 175], "               —— 视效网 ");
        win.originPnl = win.add("statictext", [117, 175, 258, 195], "              2020.06.10");
        win.luoxuan = win.add("button", [10, 220, 100, 245], "螺旋运动", {
            name: "Build"
        });
        win.dingwei = win.add("button", [10, 40, 100, 65], "定位位置", {
            name: "Build"
        });
        win.yansecy = win.add("button", [10, 70, 100, 95], "颜色采样", {
            name: "Build"
        });
        win.tuozhuai = win.add("button", [10, 100, 100, 125], "拖拽方框", {
            name: "Build"
        });
        win.swzl = win.add("button", [10, 130, 100, 155], "三维阵列", {
            name: "Build"
        });
        win.lxzl = win.add("button", [10, 160, 100, 185], "螺旋阵列", {
            name: "Build"
        });
        win.lxzlgjb = win.add("button", [10, 190, 120, 215], "螺旋阵列(高级版)", {
            name: "Build"
        });
        win.xmyh = win.add("button", [10, 10, 100, 35], "管理项目", {
            name: "Build"
        });
        win.gy = win.add("button", [180, 220, 250, 245], "关于", {
            name: "关于"
        });
        win.gy.onClick = function() {
            var dlg = new Window("palette", "关于");
            var res = "group {\n                                      orientation:'column', alignment:['fill','fill'], \n                                     aboutPnl: Panel { properties:{ borderStyle:'sunken' },\n                                                        aboutEt: EditText { text:'作者：视效网                                                                                                                                                      微信公众号：视效网                                                                                                                  新浪微博    ：视效网                                                                                                                     官方网站：wanvfx.com    视昨日为落后，把今天当起点', properties:{multiline:true}, preferredSize:[280,160], alignment:['right','center'] } \n                                                         }, \n                                                    \n                                                    \n                                   btnsGr: Group \n                                      {      alignment:['fill','fill'], \n                                                     okBtn: Button { text:'官方网站', alignment:['left','center'] } \n                                                      visitBtn: Button { text:'OK', alignment:['right','center'] }, \n                                      } \n                                     \n                                          }";
            dlg.gr = dlg.add(res);
            dlg.gr.btnsGr.visitBtn.onClick = function() {
                dlg.close();
            };
            dlg.gr.btnsGr.okBtn.onClick = function() {
                var url = "http://wanvfx.com/";
                var cmd = "";
                if ($.os.indexOf("Win") != -1) {
                    if (File("C:/Program Files/Mozilla Firefox/firefox.exe").exists) {
                        cmd += "C:/Program Files/Mozilla Firefox/firefox.exe " + url;
                    } else {
                        cmd += "C:/Program Files/Internet Explorer/iexplore.exe " + url;
                    }
                } else {
                    cmd += "open \"" + url + "\"";
                }
                try {
                    system.callSystem(cmd);
                } catch (e) {
                    alert(e);
                }
            };
            dlg.center();
            dlg.show();
        };
        win.swzl.onClick = function() {
            var myComp = app.project.activeItem;
            myCamera = myComp.layers.addCamera("Camera1", [myComp.width * 0.5, myComp.height * 0.5]);
            myCamera.moveToBeginning();
            var neirong = app.project.items.addComp("三维层", myComp.width, myComp.height, myComp.pixelAspect, 25, myComp.frameRate);
            wenben = "阵列图层脚本\rWRITTEN BY 视效网\r微信公众号：视效网 \r官方网站：wanvfx.com \r  \r感谢您的使用";
            var scys = neirong.layers.addText(wenben);
            scys.Effects.addProperty("ADBE Fill").property(3).setValue([1, 0, 0, 1]);
            scys.position.setValue([100, 200]);
            var swc = myComp.layers.add(neirong);
            swc.threeDLayer = true;
            var newNull = myComp.layers.addNull(myComp.duration);
            newNull.name = "三维物体";
            newNull.threeDLayer = true;
            swc.parent = newNull;
            swc.effect.addProperty("ADBE HUE SATURATION");
            swc.effect.addProperty("CC Composite");
            swc.effect.addProperty("ADBE Exposure2");
            var julix = newNull.Effects.addProperty("ADBE Slider Control");
            julix.name = "偏移X ";
            var juliy = newNull.Effects.addProperty("ADBE Slider Control");
            juliy.name = "偏移Y ";
            var juliz = newNull.Effects.addProperty("ADBE Slider Control");
            juliz.name = "偏移Z ";
            var xz = newNull.Effects.addProperty("ADBE Slider Control");
            xz.name = "旋转X ";
            var xz = newNull.Effects.addProperty("ADBE Slider Control");
            xz.name = "旋转Y ";
            var xz = newNull.Effects.addProperty("ADBE Slider Control");
            xz.name = "旋转Z ";
            var sf = newNull.Effects.addProperty("ADBE Slider Control");
            sf.name = "缩放 ";
            var btm = newNull.Effects.addProperty("ADBE Slider Control");
            btm.name = "不透明度 ";
            var bhd = newNull.Effects.addProperty("ADBE Slider Control");
            bhd.name = "饱和度";
            newNull.effect(9)("ADBE Slider Control-0001").setValue(100);
            var pyys = newNull.Effects.addProperty("ADBE Slider Control");
            pyys.name = "偏移颜色";
            var ld = newNull.Effects.addProperty("ADBE Slider Control");
            ld.name = "偏移亮度";
            var bhd = newNull.Effects.addProperty("ADBE Slider Control");
            bhd.name = "偏移饱和度";
            var js = newNull.Effects.addProperty("ADBE Slider Control");
            js.name = "是否加色";
            var jspy = newNull.Effects.addProperty("ADBE Slider Control");
            jspy.name = "加色偏移";
            var bg = newNull.Effects.addProperty("ADBE Slider Control");
            bg.name = "曝光";
            var sbpy = newNull.Effects.addProperty("ADBE Checkbox Control");
            sbpy.name = "双边偏移";
            var pos = " tiaojian=thisComp.layer(\"三维物体\").effect(\"双边偏移\")(\"复选框\");pyx=thisComp.layer(\"三维物体\").effect(\"偏移X \")(\"滑块\");pyy=thisComp.layer(\"三维物体\").effect(\"偏移Y \")(\"滑块\");  pyz=thisComp.layer(\"三维物体\").effect(\"偏移Z \")(\"滑块\") ;        zz=value+[(index-2)*pyx,(index-2)*pyy,(index-2)*pyz];if(tiaojian==1){if(index%2==0){value+[(index-2)*pyx,(index-2)*pyy,-Math.ceil((index-2)/2)*pyz];}else{value+[(index-2)*pyx,(index-2)*pyy,Math.floor((index-1)/2)*pyz];  }}else{zz};";
            var opa = "value-(index-2)*thisComp.layer(\"三维物体\").effect(\"不透明度 \")(\"滑块\");";
            var sca = "x=thisComp.layer(\"三维物体\").effect(\"缩放 \")(\"滑块\");y=thisComp.layer(\"三维物体\").effect(\"缩放 \")(\"滑块\");value-[index*x,index*y,0]";
            var rot = "x=(index-2)*thisComp.layer(\"三维物体\").effect(\"旋转X \")(\"滑块\");y=(index-2)*thisComp.layer(\"三维物体\").effect(\"旋转Y \")(\"滑块\");z=(index-2)*thisComp.layer(\"三维物体\").effect(\"旋转Z \")(\"滑块\");value+[x,y,z]";
            var pyys = "value+(index-2)*thisComp.layer(\"三维物体\").effect(\"偏移颜色\")(\"滑块\")";
            var pybhd = "thisComp.layer(\"三维物体\").effect(\"饱和度\")(\"滑块\")+(index-2)*thisComp.layer(\"三维物体\").effect(\"偏移饱和度\")(\"滑块\")";
            var pyld = "value+(index-2)*thisComp.layer(\"三维物体\").effect(\"偏移亮度\")(\"滑块\")";
            var jiase = "(index-2)*thisComp.layer(\"三维物体\").effect(\"加色偏移\")(\"滑块\")+thisComp.layer(\"三维物体\").effect(\"是否加色\")(\"滑块\")";
            var baoguang = "(index-2)*thisComp.layer(\"三维物体\").effect(\"曝光\")(\"滑块\")/100";
            swc.property("position").expression = pos;
            swc.property("opacity").expression = opa;
            swc.property("scale").expression = sca;
            swc.property("orientation").expression = rot;
            swc.effect("ADBE HUE SATURATION")("ADBE HUE SATURATION-0007").setValue(1);
            swc.effect("ADBE HUE SATURATION")("ADBE HUE SATURATION-0008").expression = pyys;
            swc.effect("ADBE HUE SATURATION")("ADBE HUE SATURATION-0009").expression = pybhd;
            swc.effect("ADBE HUE SATURATION")("ADBE HUE SATURATION-0010").expression = pyld;
            swc.effect("CC Composite")("CC Composite-0001").expression = jiase;
            swc.effect("ADBE Exposure2")("ADBE Exposure2-0003").expression = baoguang;
        };
        win.lxzl.onClick = function() {
            var myComp = app.project.activeItem;
            myCamera = myComp.layers.addCamera("Camera1", [myComp.width * 0.5, myComp.height * 0.5]);
            myCamera.moveToBeginning();
            var neirong = app.project.items.addComp("三维物体", myComp.width, myComp.height, myComp.pixelAspect, 25, myComp.frameRate);
            wenben = "螺旋阵列脚本\rWRITTEN BY 视效网\r微信公众号：视效网 \r官方网站：wanvfx.com \r  \r感谢您的使用";
            var scys = neirong.layers.addText(wenben);
            scys.Effects.addProperty("ADBE Fill").property(3).setValue([1, 0, 0, 1]);
            scys.position.setValue([100, 200]);
            var swc = myComp.layers.add(neirong);
            swc.threeDLayer = true;
            var newNull = myComp.layers.addNull(myComp.duration);
            newNull.name = "旋转阵列";
            newNull.threeDLayer = true;
            swc.parent = newNull;
            swc.effect.addProperty("ADBE Exposure2");
            var julix = newNull.Effects.addProperty("ADBE Slider Control");
            julix.name = "偏移X";
            var juliy = newNull.Effects.addProperty("ADBE Slider Control");
            juliy.name = "偏移Y";
            var juliz = newNull.Effects.addProperty("ADBE Slider Control");
            juliz.name = "偏移Z";
            var xz = newNull.Effects.addProperty("ADBE Slider Control");
            xz.name = "旋转X";
            var xz = newNull.Effects.addProperty("ADBE Slider Control");
            xz.name = "旋转Y";
            var xz = newNull.Effects.addProperty("ADBE Slider Control");
            xz.name = "旋转Z";
            var sf = newNull.Effects.addProperty("ADBE Slider Control");
            sf.name = "缩放 ";
            var btm = newNull.Effects.addProperty("ADBE Slider Control");
            btm.name = "不透明度 ";
            var zxd = newNull.Effects.addProperty("ADBE Point Control");
            zxd.name = "锚点";
            var bg = newNull.Effects.addProperty("ADBE Slider Control");
            bg.name = "曝光";
            var sbpy = newNull.Effects.addProperty("ADBE Checkbox Control");
            sbpy.name = "双边偏移";
            var sbxz = newNull.Effects.addProperty("ADBE Checkbox Control");
            sbxz.name = "双边旋转";
            var sbzxd = newNull.Effects.addProperty("ADBE Checkbox Control");
            sbzxd.name = "双边中心点";
            var pos = "pyx=thisComp.layer(\"旋转阵列\").effect(\"偏移X\")(\"滑块\");pyy=thisComp.layer(\"旋转阵列\").effect(\"偏移Y\")(\"滑块\");  pyz=thisComp.layer(\"旋转阵列\").effect(\"偏移Z\")(\"滑块\") ; tiaojian=thisComp.layer(\"旋转阵列\").effect(\"双边偏移\")(\"复选框\");zz= value+[(index-2)*pyx,(index-2)*pyy,(index-2)*pyz];if(tiaojian==1){if(index%2==0){value+[(index-2)*pyx,(index-2)*pyy,-Math.ceil((index-2)/2)*pyz];}else{value+[(index-2)*pyx,(index-2)*pyy,Math.floor((index-1)/2)*pyz];  }}else{zz};  ";
            var opa = "value-(index-2)*thisComp.layer(\"旋转阵列\").effect(\"不透明度 \")(\"滑块\");";
            var sca = "x=thisComp.layer(\"旋转阵列\").effect(\"缩放 \")(\"滑块\");y=thisComp.layer(\"旋转阵列\").effect(\"缩放 \")(\"滑块\");value-[(index-2)*x,(index-2)*y,0]";
            var rot = "x=(index-2)*thisComp.layer(\"旋转阵列\").effect(\"旋转X\")(\"滑块\");y=(index-2)*thisComp.layer(\"旋转阵列\").effect(\"旋转Y\")(\"滑块\");xzz=thisComp.layer(\"旋转阵列\").effect(\"旋转Z\")(\"滑块\");sbxz=thisComp.layer(\"旋转阵列\").effect(\"双边旋转\")(\"复选框\");if(sbxz==1){if(index%2==0){z=-Math.ceil((index-2)/2)*xzz}else{z=Math.floor((index-1)/2)*xzz}}else{z=(index-2)*thisComp.layer(\"旋转阵列\").effect(\"旋转Z\")(\"滑块\")};value+[x,y,z]";
            var maodian = "a=thisComp.layer(\"旋转阵列\").effect(\"锚点\")(\"点\");b=thisComp.width/2;c=thisComp.height/2;tiaojian=thisComp.layer(\"旋转阵列\").effect(\"双边中心点\")(\"复选框\");if(tiaojian==1){dianb=[-a[0],-a[1],0]+[b,c,0];diana=[a[0],a[1],0]+[b,c,0];if(index%2==1){dianb}else{diana}}else{diana=[a[0],a[1],0]+[b,c,0]};/*此表达式可使图层在三维空间中进行阵列旋转 WRITTEN BY 视效网  博客地址https://wanvfx.com 感谢您的使用*/  ";
            var baoguang = "(index-2)*thisComp.layer(\"旋转阵列\").effect(\"曝光\")(\"滑块\")/100";
            swc.property("position").expression = pos;
            swc.property("opacity").expression = opa;
            swc.property("scale").expression = sca;
            swc.property("orientation").expression = rot;
            swc.property("Anchor Point").expression = maodian;
            swc.effect("ADBE Exposure2")("ADBE Exposure2-0003").expression = baoguang;
        };
        win.lxzlgjb.onClick = function() {
            var myComp = app.project.activeItem;
            myCamera = myComp.layers.addCamera("Camera1", [myComp.width * 0.5, myComp.height * 0.5]);
            myCamera.moveToBeginning();
            var neirong = app.project.items.addComp("三维物体", myComp.width, myComp.height, myComp.pixelAspect, 25, myComp.frameRate);
            wenben = "螺旋阵列脚本高级版\rWRITTEN BY 视效网\r微信公众号：视效网 \r官方网站：wanvfx.com \r  \r感谢您的使用";
            var scys = neirong.layers.addText(wenben);
            scys.Effects.addProperty("ADBE Fill").property(3).setValue([1, 0, 0, 1]);
            scys.position.setValue([100, 200]);
            var swc = myComp.layers.add(neirong);
            swc.threeDLayer = true;
            var newNull = myComp.layers.addNull(myComp.duration);
            newNull.name = "螺旋阵列高级版控制层";
            newNull.threeDLayer = true;
            swc.parent = newNull;
            swc.effect.addProperty("ADBE Exposure2");
            var julix = newNull.Effects.addProperty("ADBE Slider Control");
            julix.name = "偏移X";
            var juliy = newNull.Effects.addProperty("ADBE Slider Control");
            juliy.name = "偏移Y";
            var juliz = newNull.Effects.addProperty("ADBE Slider Control");
            juliz.name = "偏移Z";
            var xx = newNull.Effects.addProperty("ADBE Slider Control");
            xx.name = "旋转X";
            var xy = newNull.Effects.addProperty("ADBE Slider Control");
            xy.name = "旋转Y";
            var xz = newNull.Effects.addProperty("ADBE Slider Control");
            xz.name = "旋转Z";
            var xxdz = newNull.Effects.addProperty("ADBE Slider Control");
            xxdz.name = "旋转X递增";
            var xydz = newNull.Effects.addProperty("ADBE Slider Control");
            xydz.name = "旋转Y递增";
            var xzdz = newNull.Effects.addProperty("ADBE Slider Control");
            xzdz.name = "旋转Z递增";
            var xxsj = newNull.Effects.addProperty("ADBE Slider Control");
            xxsj.name = "旋转X随机";
            var xysj = newNull.Effects.addProperty("ADBE Slider Control");
            xysj.name = "旋转Y随机";
            var xzsj = newNull.Effects.addProperty("ADBE Slider Control");
            xzsj.name = "旋转Z随机";
            var sf = newNull.Effects.addProperty("ADBE Slider Control");
            sf.name = "阵列缩放";
            var sjdbsf = newNull.Effects.addProperty("ADBE Slider Control");
            sjdbsf.name = "随机等比缩放";
            var sjsfx = newNull.Effects.addProperty("ADBE Slider Control");
            sjsfx.name = "随机缩放X";
            var sjsfy = newNull.Effects.addProperty("ADBE Slider Control");
            sjsfy.name = "随机缩放Y";
            var sjsfz = newNull.Effects.addProperty("ADBE Slider Control");
            sjsfz.name = "随机缩放Z";
            var btm = newNull.Effects.addProperty("ADBE Slider Control");
            btm.name = "不透明度 ";
            var zxd = newNull.Effects.addProperty("3D 点控制");
            zxd.name = "锚点";
            var mdsjx = newNull.Effects.addProperty("ADBE Slider Control");
            mdsjx.name = "锚点随机X";
            var mdsjy = newNull.Effects.addProperty("ADBE Slider Control");
            mdsjy.name = "锚点随机Y";
            var mdsjz = newNull.Effects.addProperty("ADBE Slider Control");
            mdsjz.name = "锚点随机Z";
            var bg = newNull.Effects.addProperty("ADBE Slider Control");
            bg.name = "曝光";
            var sbpy = newNull.Effects.addProperty("ADBE Checkbox Control");
            sbpy.name = "双边偏移";
            var sbxz = newNull.Effects.addProperty("ADBE Checkbox Control");
            sbxz.name = "双边旋转";
            var sbzxd = newNull.Effects.addProperty("ADBE Checkbox Control");
            sbzxd.name = "双边中心点";
            var pos = "pyx=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"偏移X\")(\"滑块\");pyy=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"偏移Y\")(\"滑块\");pyz=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"偏移Z\")(\"滑块\");tiaojian=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"双边偏移\")(\"复选框\");zz= value+[(index-2)*pyx,(index-2)*pyy,(index-2)*pyz];if(tiaojian==1){if(index%2==0){value+[-Math.ceil((index-2)/2)*pyx,-Math.ceil((index-2)/2)*pyy,-Math.ceil((index-2)/2)*pyz];}else{value+[Math.floor((index-1)/2)*pyx,Math.floor((index-1)/2)*pyy,Math.floor((index-1)/2)*pyz]; }}else{zz};";
            var opa = "value-(index-2)*thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"不透明度 \")(\"滑块\");";
            var sca = "a=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"随机等比缩放\")(\"滑块\");b=wiggle(0,a)[0]-100;cx=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"随机缩放X\")(\"滑块\");dx=wiggle(0,cx)[0]-100;cy=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"随机缩放Y\")(\"滑块\");dy=wiggle(0,cy)[0]-100;cz=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"随机缩放Z\")(\"滑块\");dz=wiggle(0,cz)[0]-100;x=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"阵列缩放\")(\"滑块\");y=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"阵列缩放\")(\"滑块\");z=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"阵列缩放\")(\"滑块\");value-[(index-2)*x,(index-2)*y,(index-2)*z]+[b,b]+[dx,dy,dz];";
            var rot = "xxuan=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"旋转X\")(\"滑块\");yxuan=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"旋转Y\")(\"滑块\");zxuan=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"旋转Z\")(\"滑块\");x=(index-2)*thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"旋转X递增\")(\"滑块\")+xxuan;y=(index-2)*thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"旋转Y递增\")(\"滑块\")+yxuan;xsj=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"旋转X随机\")(\"滑块\");xsjx=wiggle(0,xsj)[0];ysj=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"旋转Y随机\")(\"滑块\");ysjy=wiggle(0,ysj)[0];zsj=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"旋转Z随机\")(\"滑块\");zsjz=wiggle(0,zsj)[0];xzz=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"旋转Z递增\")(\"滑块\")+zxuan;xzx=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"旋转X递增\")(\"滑块\")+xxuan;xzy=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"旋转Y递增\")(\"滑块\")+yxuan;sbxz=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"双边旋转\")(\"复选框\");if(sbxz==1){if(index%2==0){z=-Math.ceil((index-2)/2)*xzz}else{z=Math.floor((index-1)/2)*xzz}}else{z=(index-2)*thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"旋转Z递增\")(\"滑块\")+zxuan};if(sbxz==1){if(index%2==0){x=-Math.ceil((index-2)/2)*xzx}else{x=Math.floor((index-1)/2)*xzx}}else{x=(index-2)*thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"旋转X递增\")(\"滑块\")+xxuan};if(sbxz==1){if(index%2==0){y=-Math.ceil((index-2)/2)*xzy}else{y=Math.floor((index-1)/2)*xzy}}else{y=(index-2)*thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"旋转Y递增\")(\"滑块\")+yxuan};value+[x+xsjx,y+ysjy,z+zsjz]";
            var maodian = "a=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"锚点\")(\"3D 点\");dx=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"锚点随机X\")(\"滑块\");dxsj=wiggle(0,dx)[0]-thisComp.width/2;dy=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"锚点随机Y\")(\"滑块\");dysj=wiggle(0,dy)[0]-thisComp.width/2;dz=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"锚点随机Z\")(\"滑块\");dzsj=wiggle(0,dz)[0]-thisComp.width/2;b=thisComp.width/2+dxsj;c=thisComp.height/2+dysj;tiaojian=thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"双边中心点\")(\"复选框\");if(tiaojian==1){dianb=[-a[0],-a[1],0]+[b,c,0];diana=[a[0],a[1],a[2]]+[b,c,dzsj];if(index%2==1){dianb}else{diana}}else{diana=[a[0],a[1],a[2]]+[b,c,dzsj]};/*此表达式可使图层在三维空间中进行阵列旋转 WRITTEN BY 视效网  博客地址https://wanvfx.com 感谢您的使用*/ ";
            var baoguang = "(index-2)*thisComp.layer(\"螺旋阵列高级版控制层\").effect(\"曝光\")(\"滑块\")/100;";
            swc.property("position").expression = pos;
            swc.property("opacity").expression = opa;
            swc.property("scale").expression = sca;
            swc.property("orientation").expression = rot;
            swc.property("Anchor Point").expression = maodian;
            swc.effect("ADBE Exposure2")("ADBE Exposure2-0003").expression = baoguang;
        };
        win.luoxuan.onClick = function() {
            var myComp = app.project.activeItem;
            myCamera = myComp.layers.addCamera("Camera1", [myComp.width * 0.5, myComp.height * 0.5]);
            myCamera.moveToBeginning();
            var newNull = myComp.layers.addNull(myComp.duration);
            newNull.name = "螺旋运动层";
            newNull.threeDLayer = true;
            var banjing = newNull.Effects.addProperty("ADBE Slider Control");
            banjing.name = "半径";
            newNull.effect(1)(1).setValue(100);
            var zhuansu = newNull.Effects.addProperty("ADBE Slider Control");
            zhuansu.name = "转速";
            newNull.effect(2)(1).setValue(200);
            var xzpy = newNull.Effects.addProperty("ADBE Angle Control");
            xzpy.name = "旋转偏移";
            var ysd = newNull.Effects.addProperty("ADBE Slider Control");
            ysd.name = "Y轴速度";
            newNull.effect(4)(1).setValue(-100);
            var dddx = newNull.Effects.addProperty("ADBE Slider Control");
            dddx.name = "抖动大小";
            var ddpl = newNull.Effects.addProperty("ADBE Slider Control");
            ddpl.name = "抖动频率";
            var pos = "Radius = effect(\"半径\")(\"滑块\");Speed = effect(\"转速\")(\"滑块\");RotationOffset = effect(\"旋转偏移\")(\"角度\");douda=effect(\"抖动大小\")(\"滑块\");doupin=effect(\"抖动频率\")(\"滑块\");radius = 200;angle = time * Speed + RotationOffset;x = Radius * Math.cos(degreesToRadians(angle));z = Radius * Math.sin(degreesToRadians(angle));y=time*effect(\"Y轴速度\")(\"滑块\");zuizhong= [x,y,z]+wiggle(doupin,douda); ";
            newNull.property("position").expression = pos;
        };
        win.xmyh.onClick = function() {
            eval(unescape("%20%0D%0A%20%20%20%20var%20mov%3Dapp.project.items.addFolder%28%22001-%u89C6%u9891%22%20%29%3B%0D%0A%0D%0Avar%20pic%3Dapp.project.items.addFolder%28%22002-%u56FE%u7247%22%20%29%3B%0D%0Avar%20picyy%3Dapp.project.items.addFolder%28%22AI%22%20%29%3B%0D%0Avar%20picdy%3Dapp.project.items.addFolder%28%22PSD%22%20%29%3B%0D%0Avar%20picxl%3Dapp.project.items.addFolder%28%22%u5E8F%u5217%22%20%29%3B%0D%0Apicyy.parentFolder%20%3Dpic%3B%0D%0Apicdy.parentFolder%20%3Dpic%3B%0D%0Apicxl.parentFolder%20%3Dpic%3B%0D%0Avar%20sound%3Dapp.project.items.addFolder%28%22003-%u58F0%u97F3%22%20%29%3B%0D%0Avar%20soundyx%3Dapp.project.items.addFolder%28%22%u97F3%u6548%22%20%29%3B%0D%0Avar%20soundbjy%3Dapp.project.items.addFolder%28%22%u80CC%u666F%u97F3%22%20%29%3B%0D%0Avar%20soundpb%3Dapp.project.items.addFolder%28%22%u65C1%u767D%22%20%29%3B%0D%0Asoundyx.parentFolder%20%3Dsound%3B%0D%0Asoundbjy.parentFolder%20%3Dsound%3B%0D%0A%0D%0Asoundpb.parentFolder%20%3Dsound%3B%0D%0Avar%20comp%3Dapp.project.items.addFolder%28%22004-%u5408%u6210%22%20%29%3B%0D%0Avar%20other%3Dapp.project.items.addFolder%28%22005-%u5176%u4ED6%22%20%29%3B%20"));
        };
        win.yansecy.onClick = function() {
            eval(unescape("var%20myComp%20%3D%20app.project.activeItem%3B%0A%20%20%20%20%20var%20newNull%20%3D%20myComp.layers.addNull%28myComp.duration%29%3B%0A%09%20%20newNull.name%20%3D%20%22%u989C%u8272%u91C7%u6837%u5C42%22%3B%0A%20%20%20%20%20%0A%20%20%20%20%20var%20cyc%3DnewNull.Effects.addProperty%28%22ADBE%20Layer%20Control%22%29%3B%0A%20%20%20%20%20%20cyc.name%20%3D%20%22%u91C7%u6837%u5C42%22%3B%0A%20%20%20%20%0Avar%20cyd%3DnewNull.Effects.addProperty%28%22ADBE%20Point%20Control%22%29%3B%0A%20%20%20%20%20%20cyd.name%20%3D%20%22%u91C7%u6837%u70B9%22%3B%0A%20%20%20%20%0A%20var%20cyddx%3DnewNull.Effects.addProperty%28%22ADBE%20Slider%20Control%22%29%3B%0A%20%20%20%20%20%20cyddx.name%20%3D%20%22%u91C7%u6837%u70B9%u5927%u5C0F%22%3B%0A%20var%20ysyl%3DnewNull.Effects.addProperty%28%22ADBE%20Color%20Control%22%29%3B%0A%20%20%20%20%20%20ysyl.name%20%3D%20%22%u989C%u8272%u9884%u89C8%22%3B%20%20%20%20%20%0A%20%20var%20r%3DnewNull.Effects.addProperty%28%22ADBE%20Slider%20Control%22%29%3B%0A%20%20%20%20%20%20r.name%20%3D%20%22R%22%3B%0A%0A%20var%20g%3DnewNull.Effects.addProperty%28%22ADBE%20Slider%20Control%22%29%3B%0A%20%20%20%20%20%20g.name%20%3D%20%22G%22%3B%0A%20%20var%20b%3DnewNull.Effects.addProperty%28%22ADBE%20Slider%20Control%22%29%3B%0A%20%20%20%20%20%20b.name%20%3D%20%22B%22%3B%0A%20%20%20var%20alpha%3DnewNull.Effects.addProperty%28%22ADBE%20Slider%20Control%22%29%3B%0A%20%20%20%20%20%20alpha.name%20%3D%20%22Alpha%22%3B%20%20%0A%20%20%20%20%0A%20%20var%20rgb%3D%27r%3Deffect%28%22R%22%29%28%22%u6ED1%u5757%22%29%3Bg%3Deffect%28%22G%22%29%28%22%u6ED1%u5757%22%29%3Bb%3Deffect%28%22B%22%29%28%22%u6ED1%u5757%22%29%3Ba%3Deffect%28%22Alpha%22%29%28%22%u6ED1%u5757%22%29%3B%5Br%2Cg%2Cb%2Ca%5D%3B%27%3B%0A%20%20%20%20newNull.effect%284%29%281%29.expression%3Drgb%3B%0A%20%20var%20hong%3D%27r%3Deffect%28%22%u91C7%u6837%u70B9%u5927%u5C0F%22%29%28%22%u6ED1%u5757%22%29%3Bif%28r%3C0.05%29%7Br%3D0.05%7Delse%7Br%7D%3Bcyd%3Deffect%28%22%u91C7%u6837%u70B9%22%29%28%22%u70B9%22%29+position%3Beffect%28%22%u91C7%u6837%u5C42%22%29%28%22%u56FE%u5C42%22%29.sampleImage%28cyd%2C%20radius%20%3D%20%5Br%2Cr%5D%2C%20postEffect%20%3D%20true%2C%20t%20%3D%20time%29%5B0%5D%27%3B%0A%20%20%20newNull.effect%285%29%281%29.expression%3Dhong%3B%0A%20%20var%20lv%3D%27r%3Deffect%28%22%u91C7%u6837%u70B9%u5927%u5C0F%22%29%28%22%u6ED1%u5757%22%29%3Bif%28r%3C0.05%29%7Br%3D0.05%7Delse%7Br%7D%3Bcyd%3Deffect%28%22%u91C7%u6837%u70B9%22%29%28%22%u70B9%22%29+position%3Beffect%28%22%u91C7%u6837%u5C42%22%29%28%22%u56FE%u5C42%22%29.sampleImage%28cyd%2C%20radius%20%3D%20%5Br%2Cr%5D%2C%20postEffect%20%3D%20true%2C%20t%20%3D%20time%29%5B1%5D%27%3B%0A%20%20%20newNull.effect%286%29%281%29.expression%3Dlv%3B%0A%20%20%20var%20lan%3D%27r%3Deffect%28%22%u91C7%u6837%u70B9%u5927%u5C0F%22%29%28%22%u6ED1%u5757%22%29%3Bif%28r%3C0.05%29%7Br%3D0.05%7Delse%7Br%7D%3Bcyd%3Deffect%28%22%u91C7%u6837%u70B9%22%29%28%22%u70B9%22%29+position%3Beffect%28%22%u91C7%u6837%u5C42%22%29%28%22%u56FE%u5C42%22%29.sampleImage%28cyd%2C%20radius%20%3D%20%5Br%2Cr%5D%2C%20postEffect%20%3D%20true%2C%20t%20%3D%20time%29%5B2%5D%27%3B%0A%20%20%20newNull.effect%287%29%281%29.expression%3Dlan%3B%0A%20%20%20var%20tm%3D%27r%3Deffect%28%22%u91C7%u6837%u70B9%u5927%u5C0F%22%29%28%22%u6ED1%u5757%22%29%3Bif%28r%3C0.05%29%7Br%3D0.05%7Delse%7Br%7D%3Bcyd%3Deffect%28%22%u91C7%u6837%u70B9%22%29%28%22%u70B9%22%29+position%3Beffect%28%22%u91C7%u6837%u5C42%22%29%28%22%u56FE%u5C42%22%29.sampleImage%28cyd%2C%20radius%20%3D%20%5Br%2Cr%5D%2C%20postEffect%20%3D%20true%2C%20t%20%3D%20time%29%5B3%5D%27%3B%0A%20%20%20newNull.effect%288%29%281%29.expression%3Dtm%3B"));
        };
        win.dingwei.onClick = function() {
            var myComp = app.project.activeItem;
            var newNull = myComp.layers.addNull(myComp.duration);
            newNull.name = "定位位置";
            newNull.threeDLayer = true;
            var cenga = newNull.Effects.addProperty("ADBE Layer Control");
            cenga.name = "层1";
            var cengb = newNull.Effects.addProperty("ADBE Layer Control");
            cengb.name = "层2";
            var xpy = newNull.Effects.addProperty("ADBE Slider Control");
            xpy.name = "X偏移";
            var ypy = newNull.Effects.addProperty("ADBE Slider Control");
            ypy.name = "Y偏移";
            var zpy = newNull.Effects.addProperty("ADBE Slider Control");
            zpy.name = "Z偏移";
            var bl = newNull.Effects.addProperty("ADBE Slider Control");
            bl.name = "比例";
            newNull.effect(6)(1).setValue(50);
            var pos = "ceng1=effect(\"层1\")(\"图层\");ceng2=effect(\"层2\")(\"图层\");xpy=effect(\"X偏移\")(\"滑块\");ypy=effect(\"Y偏移\")(\"滑块\");zpy=effect(\"Z偏移\")(\"滑块\");a=ceng1.position;b=ceng2.position;c=a+(b-a)/100*effect(\"比例\")(\"滑块\");pos=add(c,[xpy,ypy,zpy]);/*此脚本由视效网搬运，前辈编写，我只是为了我看着舒服，私人专用，可精确定位层在选择的两个层之间的位置    视效网微信公众号：视效网  官方网站：wanvfx.com   感谢你的使用*/";
            newNull.property("position").expression = pos;
            newNull.property("rotation").expression = "a=effect(\"层1\")(\"图层\").position;b=effect(\"层2\")(\"图层\").position;ay=Math.abs(a[1]);by=Math.abs(b[1]);ax=Math.abs(a[0]);bx=Math.abs(b[0]);gao=Math.abs(by-ay)+0.01;chang=Math.abs(bx-ax)+0.01;juli=length(a, b)+0.01;zhi=Math.acos(gao/juli)/Math.PI*180;if(a[0]>b[0]&&a[1]<b[1]){zhi};if(a[0]>b[0]&&a[1]>b[1]){zhi=Math.acos(chang/juli)/Math.PI*180+90};if(a[0]<b[0]&&a[1]>b[1]){zhi=Math.acos(gao/juli)/Math.PI*180+180};if(a[0]<b[0]&&a[1]<b[1]){zhi=-Math.acos(gao/juli)/Math.PI*180};/*此脚本由视效网搬运，前辈编写，我只是为了我看着舒服，私人专用，可精确定位层在选择的两个层之间的位置  更多精品AE、C4D等精品教学请关注 视效网微信公众号：视效网  官方网站：wanvfx.com   感谢你的使用*/";
        };
        win.tuozhuai.onClick = function() {
            eval(unescape("var%20myComp%20%3D%20app.project.activeItem%3B%0Avar%20bx%3DmyComp.layers.addSolid%28%20%5B0%2C0%2C0%5D%2C%20%22%u8FB9%u7EBF%22%2C%20myComp.width%2CmyComp.height%2C%20myComp.pixelAspect%20%2CmyComp.frameRate%29%3B%0A%0Avar%20zs%3DmyComp.layers.addSolid%28%20%5B1%2C1%2C1%5D%2C%20%22%u5DE6%u4E0A%22%2C%20200%2C200%2C%20myComp.pixelAspect%20%2CmyComp.frameRate%29%3B%0Avar%20yx%3DmyComp.layers.addSolid%28%20%5B1%2C1%2C1%5D%2C%20%22%u53F3%u4E0B%22%2C%20200%2C200%2C%20myComp.pixelAspect%20%2CmyComp.frameRate%29%3B%20%20%20%0A%0Avar%20zxkz%3DmyComp.layers.addSolid%28%20%5B1%2C1%2C1%5D%2C%20%22%u5DE6%u4E0B%u63A7%u5236%22%2C%20200%2C200%2C%20myComp.pixelAspect%20%2CmyComp.frameRate%29%3B%20%20%20%0Avar%20yskz%3DmyComp.layers.addSolid%28%20%5B1%2C1%2C1%5D%2C%20%22%u53F3%u4E0A%u63A7%u5236%22%2C%20200%2C200%2C%20myComp.pixelAspect%20%2CmyComp.frameRate%29%3B%0Avar%20cd%3Dyskz.Effects.addProperty%28%22ADBE%20Slider%20Control%22%29%3B%0A%20%20%20%20%20%20cd.name%20%3D%20%22%u957F%u5EA6%22%3B%0A%20%20%20%20%20%20yskz.effect%281%29%281%29.setValue%28100%29%3B%0Avar%20byhd%3Dyskz.Effects.addProperty%28%22ADBE%20Slider%20Control%22%29%3B%0A%20%20%20%20%20%20byhd.name%20%3D%20%22%u8FB9%u7F18%u539A%u5EA6%22%3B%0A%20%20%20%20%20%20yskz.effect%282%29%281%29.setValue%284%29%3B%0Avar%20rouhua%3Dyskz.Effects.addProperty%28%22ADBE%20Slider%20Control%22%29%3B%0A%20%20%20%20%20%20rouhua.name%20%3D%20%22%u67D4%u5316%22%3B%0Avar%20nbys%3Dyskz.Effects.addProperty%28%22ADBE%20Color%20Control%22%29%3B%0A%20%20%20%20%20%20nbys.name%20%3D%20%22%u5185%u90E8%u989C%u8272%22%3B%0A%20%20%20%20%20%20%0Avar%20wbys%3Dyskz.Effects.addProperty%28%22ADBE%20Color%20Control%22%29%3B%0A%20%20%20%20%20%20wbys.name%20%3D%20%22%u5916%u90E8%u989C%u8272%22%3B%20%0Avar%20kzdhd%3Dyskz.Effects.addProperty%28%22ADBE%20Slider%20Control%22%29%3B%0A%20%20%20%20%20%20kzdhd.name%20%3D%20%22%u63A7%u5236%u70B9%u539A%u5EA6%22%3B%0A%20%20%20%20%20%20yskz.effect%286%29%281%29.setValue%288%29%3B%0Avar%20kzdys%3Dyskz.Effects.addProperty%28%22ADBE%20Fill%22%29%3B%0A%20%20%20%20%20%20%20zsys%3Dzxkz.Effects.addProperty%28%22ADBE%20Fill%22%29%3B%0A%20%20%20%20%20%20%20yxys%3Dyx.Effects.addProperty%28%22ADBE%20Fill%22%29%3B%0A%20%20%20%20%20%20%20zsys%3Dzs.Effects.addProperty%28%22ADBE%20Fill%22%29%3B%0A%20%20%20%20%20%20kzdys.name%20%3D%20%22%u63A7%u5236%u70B9%u989C%u8272%22%3B%0Avar%20shang%3Dbx.Effects.addProperty%28%22ADBE%20Laser%22%29%3B%0A%20%20%20%20%20%20shang.name%3D%22%u4E0A%u8FB9%22%3B%0A%20%20%20%20%20%20%0Avar%20zuo%3Dbx.Effects.addProperty%28%22ADBE%20Laser%22%29%3B%0A%20%20%20%20%20%20%20zuo.name%3D%22%u5DE6%u8FB9%22%3B%0A%20%20%20%20%20%20%20%0A%20var%20xia%3Dbx.Effects.addProperty%28%22ADBE%20Laser%22%29%3B%20%20%0A%20%20%20%20%20%20%20xia.name%3D%22%u4E0B%u8FB9%22%3B%0A%20var%20you%3Dbx.Effects.addProperty%28%22ADBE%20Laser%22%29%3B%20%20%0A%20%20%20%20%20%20%20you.name%3D%22%u53F3%u8FB9%22%3B%0A%20%20%20%20%20%20%20bx.effect%281%29%2811%29.setValue%280%29%3B%0A%20%20%20%20%20%20%20bx.effect%282%29%2811%29.setValue%281%29%3B%0A%20%20%20%20%20%20%20bx.effect%283%29%2811%29.setValue%281%29%3B%0A%20%20%20%20%20%20%20bx.effect%284%29%2811%29.setValue%281%29%3B%0A%20%20var%20sca%3D%20%27temp%3DthisComp.layer%28%22%u53F3%u4E0A%u63A7%u5236%22%29.effect%28%22%u63A7%u5236%u70B9%u539A%u5EA6%22%29%28%22%u6ED1%u5757%22%29%3B%5Btemp%2Ctemp%5D%27%3B%0A%20%20var%20nys%3D%27thisComp.layer%28%22%u53F3%u4E0A%u63A7%u5236%22%29.effect%28%22%u5185%u90E8%u989C%u8272%22%29%28%22%u989C%u8272%22%29%27%3B%0A%20%20var%20wys%3D%27thisComp.layer%28%22%u53F3%u4E0A%u63A7%u5236%22%29.effect%28%22%u5916%u90E8%u989C%u8272%22%29%28%22%u989C%u8272%22%29%27%3B%0A%20%20var%20fangkuangys%3D%27thisComp.layer%28%22%u53F3%u4E0A%u63A7%u5236%22%29.effect%28%22%u63A7%u5236%u70B9%u989C%u8272%22%29%28%22%u989C%u8272%22%29%27%3B%0A%20%20var%20%20%20%20%20changdu%3D%27thisComp.layer%28%22%u53F3%u4E0A%u63A7%u5236%22%29.effect%28%22%u957F%u5EA6%22%29%28%22%u6ED1%u5757%22%29%27%3B%0A%20%20var%20%20%20%20%20%20%20%20%20houdu%3D%27thisComp.layer%28%22%u53F3%u4E0A%u63A7%u5236%22%29.effect%28%22%u8FB9%u7F18%u539A%u5EA6%22%29%28%22%u6ED1%u5757%22%29%27%3B%0A%20%20var%20rouhua%3D%20%27thisComp.layer%28%22%u53F3%u4E0A%u63A7%u5236%22%29.effect%28%22%u67D4%u5316%22%29%28%22%u6ED1%u5757%22%29%27%3B%0A%20%20var%20shangjs%3D%27thisComp.layer%28%22%u53F3%u4E0A%u63A7%u5236%22%29.transform.position%27%3B%0A%20%20var%20shangks%3D%27y%3DthisComp.layer%28%22%u53F3%u4E0A%u63A7%u5236%22%29.transform.position%5B1%5D%3Bx%3DthisComp.layer%28%22%u5DE6%u4E0B%u63A7%u5236%22%29.transform.position%5B0%5D%3B%5Bx%2Cy%5D%27%3B%0A%20%20var%20%20zuoks%3D%27effect%28%22%u4E0A%u8FB9%22%29%28%22%u8D77%u59CB%u70B9%22%29%27%3B%0A%20%20var%20%20zuojs%3D%27thisComp.layer%28%22%u5DE6%u4E0B%u63A7%u5236%22%29.transform.position%27%3B%0A%20%20var%20%20xiaks%3D%27effect%28%22%u5DE6%u8FB9%22%29%28%22%u7ED3%u675F%u70B9%22%29%27%3B%0A%20%20var%20%20xiajs%3D%27x%3DthisComp.layer%28%22%u53F3%u4E0A%u63A7%u5236%22%29.transform.position%5B0%5D%3By%3DthisComp.layer%28%22%u5DE6%u4E0B%u63A7%u5236%22%29.transform.position%5B1%5D%3B%5Bx%2Cy%5D%27%3B%0A%20%20var%20%20youks%3D%27thisComp.layer%28%22%u53F3%u4E0A%u63A7%u5236%22%29.transform.position%27%3B%0A%20%20var%20%20youjs%3D%27effect%28%22%u4E0B%u8FB9%22%29%28%22%u7ED3%u675F%u70B9%22%29%27%3B%0A%20%20%0A%20%20%20%20%20%20%20%20%20yskz.property%28%22Scale%22%29.expression%3Dsca%3B%0A%20%20%20%20%20%20%20%20zxkz.property%28%22Scale%22%29.expression%3Dsca%3B%0A%20%20%20%20%20%20%20%20yx.property%28%22Scale%22%29.expression%3Dsca%3B%0A%20%20%20%20%20%20%20%20zs.property%28%22Scale%22%29.expression%3Dsca%3B%0A%20%20%20%20%20%20%20%20zs.effect%281%29%283%29.expression%3Dfangkuangys%3B%0A%20%20%20%20%20%20%20%20zs.property%28%22Position%22%29.expression%3Dshangks%3B%0A%20%20%20%20%20%20%20%20yx.effect%281%29%283%29.expression%3Dfangkuangys%3B%0A%20%20%20%20%20%20%20%20yx.property%28%22Position%22%29.expression%3Dxiajs%3B%0A%20%20%20%20%20%20%20%20zxkz.effect%281%29%283%29.expression%3Dfangkuangys%3B%0A%20%20%20%20%20%20%20%20bx.effect%281%29%283%29.expression%3Dchangdu%3B%0A%20%20%20%20%20%20%20%20bx.effect%281%29%285%29.expression%3Dhoudu%3B%0A%20%20%20%20%20%20%20%20bx.effect%281%29%286%29.expression%3Dhoudu%3B%0A%20%20%20%20%20%20%20%20bx.effect%281%29%287%29.expression%3Drouhua%3B%0A%20%20%20%20%20%20%20%20bx.effect%281%29%288%29.expression%3Dnys%3B%0A%20%20%20%20%20%20%20%20bx.effect%281%29%289%29.expression%3Dwys%3B%0A%20%20%20%20%20%20%20%20bx.effect%282%29%283%29.expression%3Dchangdu%3B%0A%20%20%20%20%20%20%20%20bx.effect%282%29%285%29.expression%3Dhoudu%3B%0A%20%20%20%20%20%20%20%20bx.effect%282%29%286%29.expression%3Dhoudu%3B%0A%20%20%20%20%20%20%20%20bx.effect%282%29%287%29.expression%3Drouhua%3B%0A%20%20%20%20%20%20%20%20bx.effect%282%29%288%29.expression%3Dnys%3B%0A%20%20%20%20%20%20%20%20bx.effect%282%29%289%29.expression%3Dwys%3B%0A%20%20%20%20%20%20%20%20bx.effect%283%29%283%29.expression%3Dchangdu%3B%0A%20%20%20%20%20%20%20%20bx.effect%283%29%285%29.expression%3Dhoudu%3B%0A%20%20%20%20%20%20%20%20bx.effect%283%29%286%29.expression%3Dhoudu%3B%0A%20%20%20%20%20%20%20%20bx.effect%283%29%287%29.expression%3Drouhua%3B%0A%20%20%20%20%20%20%20%20bx.effect%283%29%288%29.expression%3Dnys%3B%0A%20%20%20%20%20%20%20%20bx.effect%283%29%289%29.expression%3Dwys%3B%0A%20%20%20%20%20%20%20%20bx.effect%284%29%283%29.expression%3Dchangdu%3B%0A%20%20%20%20%20%20%20%20bx.effect%284%29%285%29.expression%3Dhoudu%3B%0A%20%20%20%20%20%20%20%20bx.effect%284%29%286%29.expression%3Dhoudu%3B%0A%20%20%20%20%20%20%20%20bx.effect%284%29%287%29.expression%3Drouhua%3B%0A%20%20%20%20%20%20%20%20bx.effect%284%29%288%29.expression%3Dnys%3B%0A%20%20%20%20%20%20%20%20bx.effect%284%29%289%29.expression%3Dwys%3B%0A%20%20%20%20%20%20%20%20bx.effect%281%29%281%29.expression%3Dshangks%3B%0A%20%20%20%20%20%20%20%20bx.effect%281%29%282%29.expression%3Dshangjs%3B%0A%20%20%20%20%20%20%20%20%20bx.effect%282%29%281%29.expression%3Dzuoks%3B%0A%20%20%20%20%20%20%20%20bx.effect%282%29%282%29.expression%3Dzuojs%3B%0A%20%20%20%20%20%20%20%20%20bx.effect%283%29%281%29.expression%3Dxiaks%3B%0A%20%20%20%20%20%20%20%20bx.effect%283%29%282%29.expression%3Dxiajs%3B%0A%20%20%20%20%20%20%20%20%20bx.effect%284%29%281%29.expression%3Dyouks%3B%0A%20%20%20%20%20%20%20%20bx.effect%284%29%282%29.expression%3Dyoujs%3B%0A%20%20%20%20%20%20%20%20bx.locked%3Dtrue%3B%0A%20%20%20%20%20%20%20%20zs.locked%3Dtrue%3B%0A%20%20%20%20%20%20%20%20yx.locked%3Dtrue%3B"));
        };
        win.show();
    }
    return win;
}