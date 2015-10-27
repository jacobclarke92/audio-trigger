export function stringToColor(str, fallback = 0xFFFFFF) {
	if(typeof str != 'string') return fallback;
	return parseInt(str.replace('#','0x'));
}