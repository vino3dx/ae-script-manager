// 脚本：调节K帧动画节奏  丨  五分度：开始到结束
// 版本：v1.0
// 汉化：视效网 (https://wanvfx.com)
// 修改: 2020-06-2


function outQuint(t, b, c, d) {
	return c*((t=t/d-1)*t*t*t*t + 1) + b;

}

function curvaceous() {
	
	try {
		var key1 = key(1);
		var key2 = key(numKeys);
	} catch(e) {
		return null;
	}
	
	t = time - key1.time;
	d = key2.time - key1.time;

	sX = key1.time;
	eX = key2.time - key1.time;


	if ((time < key1.time) || (time > key2.time)) {
		return null;
	} else {
		return valueAtTime(outQuint(t, sX, eX, d));
	}
}

(curvaceous() || value);

