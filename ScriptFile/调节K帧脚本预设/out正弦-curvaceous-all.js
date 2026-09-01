// 脚本：调节K帧动画节奏  丨  柔和曲线：所有关键帧
// 版本：v1.0
// 汉化：视效网 (https://wanvfx.com)
// 修改: 2020-06-25


function outSine(t, b, c, d) {
	return c * Math.sin(t/d * (Math.PI/2)) + b;
}

function curvaceous() {
	var n = 0;
	if (numKeys > 0) {
		n = nearestKey(time).index;
		if (key(n).time > time)	{ n-- }
	}

	// after the first two keys, yet before the last two, just do nothing
	if (n > 1 && n < numKeys -1 ) {
		return null;
	}

	try {
		var key1 = key(n);
		var key2 = key(n+1);
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
		return valueAtTime(outSine(t, sX, eX, d));
	}
}

(curvaceous() || value);

