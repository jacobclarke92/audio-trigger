import THREE, { WebGLRenderer, PerspectiveCamera, Scene, Vector3 } from 'three'
import { Component } from 'react'
import { GUI } from 'dat-gui'
import randomColor from 'randomcolor'
import { stringToColor } from './utils'
import Audio from './Audio'
import Bar from './Bar'

const audio = new Audio();
const freqs = 1024;

const colors = randomColor({
   count: 32,
   hue: 'red'
});

class params {
	constructor() {
		this.bgcolor = 0xFFFFFF;
		this.gain = 2;
		this.rotateSpeed = 1;
	}
}

let orbit = 0;

export default class App extends Component {

	constructor(props) {
		super(props);

		// make param overlay
		this.params = new params();
		this.gui = new GUI();
		// this.gui.addColor(this.params, 'bgcolor').listen().onChange(() => this.renderer.setClearColor(stringToColor(this.params.bgcolor), 1));
		this.gui.add(this.params, 'gain', 0, 5).listen().onChange(() => audio.setGain(this.params.gain));
		this.gui.add(this.params, 'rotateSpeed', 0, 10);

		// set init state
		this.state = {
			width: window.innerWidth,
			height: window.innerHeight,
		}
	}

	componentWillMount() {
		window.addEventListener('resize', ::this.handleWindowResize);
		this.initScene();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', ::this.handleWindowResize);
	}

	componentDidMount() {
		this.doAnimation();
	}

	handleWindowResize() {
		this.setState({
			width: window.innerWidth,
			height: window.innerHeight,
		}, () => {
			// once state is updated do threejs resizing
			this.renderer.setSize(this.state.width, this.state.height);	
			this.camera.aspect = this.state.width / this.state.height;
    		this.camera.updateProjectionMatrix();
		});
	}

	initScene() {
		this.renderer = new WebGLRenderer({
			antialias: true,
			alpha: true,
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
		this.camera.position.y = 100;
		this.renderer.setSize(this.state.width, this.state.height);
		this.props.stage.appendChild(this.renderer.domElement);

		audio.setGain(2)

		// bass
		audio.addTrigger({
			range: [4, 5], // bands in the 1024 array
			threshold: 240, // arbitrary volume
			cooldown: 10, // frames
			minAttack: 10,
		}, this.bassTrigger);

		this.bars = [];
		for(let i=0; i< 32; i++) {
			this.bars[i] = new Bar(i, colors[i]);
			this.scene.add(this.bars[i].obj);
		}

	}

	bassTrigger(level) {
		console.log('bass triggered', level);
	}
	snareTrigger(level) {
		console.log('snare triggered', level);
	}

	doAnimation() {

		
		// animation stuff happens here


		audio.analyse();

		if(audio.audio) {
			// even though there are 1024 frequencies are logarithmic so display accordingly
			for(let i = 0; (i+1)*(i+1) < freqs; i ++) {
				this.bars[i].obj.scale.set(1, 1 + audio.frequencies[i*i]*audio.gain, 1);
			}
		}

		orbit += this.params.rotateSpeed / 100;
		this.camera.position.x = Math.cos(orbit) * 200;
		this.camera.position.z = 350; //Math.sin(orbit) * 50 + 250;
		this.camera.lookAt(new Vector3(0,150,0));

		// render please!
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(::this.doAnimation);
	}
	
	render() {
    	return null;
	}

}