import analyser from 'web-audio-analyser'
import getUserMedia from 'getusermedia'

export default class {
	
	constructor() {
		this.attempts = 0;
		this.audio = false;
		this.analyser = false;
		this.frequencies = new Uint8Array(1024)
		this.triggers = [];
		this.request();
	}

	request() {
		if(++this.attempts > 3) return;
		getUserMedia({video: false, audio: true}, (err, stream) => {
			if(err) {
				console.warn('Error requesting mic access (attempt '+this.attempts+')');
				setTimeout(() => this.request(), 2000);
			}else{
				console.info('Mic access granted');
				this.audio = stream;
				this.connected();
			}
		});
	}

	connected() {
		if(!this.audio) return;
		this.analyser = new analyser(this.audio, {
			stereo: false,	// don't really need
			audible: false, // streams mic audio
		});
	}

	addTrigger(options, callback) {
		console.log('Adding audio trigger for '+ options.range[0]+'-'+options.range[1]+'hz');
		this.triggers.push({options, callback, counter: 0});
	}

	analyse() {
		if(!this.audio || !this.analyser) return;
		this.frequencies = this.analyser.frequencies();

		for(let trigger of this.triggers) {
			if(trigger.counter > 0) {
				trigger.counter --;
			}else{
				const range = trigger.options.range;
				let level = 0;
				for(let f=range[0]; f<range[1]; f++) level += this.frequencies[f];
				level = Math.floor(level/(range[1]-range[0]));
				trigger.level = level;
				if(trigger.level > trigger.options.threshold) {
					trigger.counter = trigger.options.cooldown;
					trigger.callback();
				}
			}
		}
		// this.frequencies[10] > 50 && console.log(this.frequencies[10]);
		// this.frequencies.map((freq, i) => freq > 30 && console.log(i));
	}

}