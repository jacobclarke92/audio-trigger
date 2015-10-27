import THREE, { WebGLRenderer, PerspectiveCamera, Scene, Vector3 } from 'three'
import { Component } from 'react'
import { GUI } from 'dat-gui'
import { stringToColor } from './utils'
import Audio from './Audio'

const audio = new Audio();

class params {
	constructor() {
		this.lineColor = 0xFFFFFF;
		this.param = 1;
	}
}

let orbit = 0;

export default class App extends Component {

	constructor(props) {
		super(props);

		// make param overlay
		this.params = new params();
		this.gui = new GUI();
		this.gui.addColor(this.params, 'lineColor');
		this.gui.add(this.params, 'param', 0, 10);

		// set init state
		this.state = {
			width: window.innerWidth,
			height: window.innerHeight,
		}
	}

	componentWillMount() {
		this.initScene();
	}

	componentDidMount() {
		this.doAnimation();
	}

	initScene() {
		this.renderer = new WebGLRenderer({
			antialias: true,
		});
		this.renderer.setClearColor(stringToColor(this.params.bgcolor), 1);
		this.camera = new PerspectiveCamera(
			80,		// FOV
			this.state.width / this.state.height, // aspect ratio
			1, 		// near
			50000	// far
		);
		this.scene = new Scene();
		this.scene.add(this.camera);
		this.camera.position.z = 250;
		this.camera.position.y = 200;
		this.renderer.setSize(this.state.width, this.state.height);
		this.props.stage.appendChild(this.renderer.domElement);

		audio.addTrigger({
			range: [0, 4], // bands in the 1024 array
			threshold: 120, // arbitrary volume
			cooldown: 10, // frames
		}, this.bassTrigger)

	}

	bassTrigger() {
		console.log('bass triggered');
	}

	doAnimation() {

		orbit += this.params.rotateSpeed / 1000;

		const { lineColor, param } = this.params;

		
		// do animation shit here
		audio.analyse();


		this.camera.position.x = Math.cos(orbit) * 200;
		this.camera.position.z = Math.sin(orbit) * 200;
		this.camera.lookAt(new Vector3(0,150,0));

		this.renderer.render(this.scene, this.camera);

		requestAnimationFrame(::this.doAnimation);
	}
	
	render() {
    	return null;
	}

}