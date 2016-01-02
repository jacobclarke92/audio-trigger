import './Mirror'
import { PlaneBufferGeometry } from 'three'

export default class Floor {
	constructor( renderer, camera, state ) {
		const planeGeo = new PlaneBufferGeometry( 500, 500 );
		const groundMirror = new THREE.Mirror( renderer, camera, { 
			clipBias: 0.003, 
			textureWidth: state.width, 
			textureHeight: state.height, 
			color: 0x777777 
		});

		return groundMirror;
	}
}