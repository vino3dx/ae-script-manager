// Curvaceous - start to end
// 2.0.1 : inQuart
// Ian Haigh (http://ianhaigh.com/easeandwizz/)
// Last built: 2010-10-09T13:35:39+11:00


function inQuart(t, b, c, d) {
	return c*(t/=d)*t*t*t + b;
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
		return valueAtTime(inQuart(t, sX, eX, d));
	}
}

(curvaceous() || value);

