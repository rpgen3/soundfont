import {ForkWorklet} from 'https://rpgen3.github.io/soundfont/mjs/ForkWorklet.mjs';
export class RecordWorklet {
    static init(ctx){
        return Promise.all([
            ForkWorklet.init(ctx),
            ctx.audioWorklet.addModule('https://rpgen3.github.io/soundfont/worklet/Record.js')
        ]);
    }
    constructor({ctx, ch = 2}){
        const forkNode = new ForkWorklet({ctx, ch}).node;
        const recNode = new AudioWorkletNode(ctx, 'Record', {
            numberOfInputs: 1,
            numberOfOutputs: 0,
            processorOptions: {ch}
        });
        forkNode.connect(recNode);
        this.node = forkNode;
        this.recNode = recNode;
    }
    close(){
        this.recNode.port.postMessage(0);
    }
    get data(){
        return new Promise(resolve => {
            this.recNode.port.onmessage = ({data}) => resolve(data);
            this.recNode.port.postMessage(1);
        });
    }
}
