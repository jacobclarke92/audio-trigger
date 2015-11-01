export function stringToColor(str, fallback = 0xFFFFFF) {
	if(typeof str != 'string') return fallback;
	return parseInt(str.replace('#','0x'));
}

export function hsvToRgb(h, s, v) {
	const h_i = Math.round(h * 6);
	const f = h*6 - h_i;
	const p = v * (1 - s);
	const q = v * (1 - f*s);
	const t = v * (1 - (1 - f) * s);

	let r, g, b = 0;
	if(h_i == 0) g = t;
	if(h_i == 1) r = q;
	if(h_i == 2) b = t;
	if(h_i == 3) g = q;
	if(h_i == 4) r = t;
	if(h_i == 5) b = q;
	if(h_i == 0 || h_i == 5) r = v;
	if(h_i == 0 || h_i == 1) b = p;
	if(h_i == 1 || h_i == 2) g = v;
	if(h_i == 2 || h_i == 3) r = p;
	if(h_i == 3 || h_i == 4) b = v;
	if(h_i == 4 || h_i == 5) g = p;
	
	return [Math.round(r*256), Math.round(g*256), Math.round(b*256)]; 
}