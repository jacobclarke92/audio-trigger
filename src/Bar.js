import { PlaneBufferGeometry, MeshBasicMaterial, Mesh, Object3D, DoubleSide } from 'three'
import { stringToColor } from './utils'

export default class Bar {
	constructor(num = 0, color = '#DD9999') {
		this.geometry = new PlaneBufferGeometry( 10, 1, 1, 1 );
		this.material = new MeshBasicMaterial({
			color: stringToColor(color),
			side: DoubleSide,
		});
		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.position.set(0, 0.5, Math.random()*10 - 5);
		this.obj = new Object3D();
		this.obj.add(this.mesh);
		this.obj.position.set(-160 + num*10, 0, 0);
	}
}