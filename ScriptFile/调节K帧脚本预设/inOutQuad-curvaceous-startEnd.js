// Curvaceous - start to end
// 2.0.1 : inOutQuad
// Ian Haigh (http://ianhaigh.com/easeandwizz/)
// Last built: 2010-10-09T13:35:40+11:00


function inOutQuad(t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t + b;
	return -c/2 * ((--t)*(t-2) - 1) + b;

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
		return valueAtTime(inOutQuad(t, sX, eX, d));
	}
}

(curvaceous() || value);

