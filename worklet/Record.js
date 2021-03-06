class Record extends AudioWorkletProcessor {
    constructor(options) {
        super(options);
        this.closed = false;
        this.data = [...Array(options.processorOptions.ch).fill().map(v => [])];
        this.port.onmessage = ({data}) => {
            if(data === 0) this.closed = true;
            else if(data === 1) this.port.postMessage(this.data);
        };
    }
    process([input]) {
        if(this.closed) return false;
        const {data} = this,
              min = Math.min(input.length, data.length);
        for(let i = 0; i < min; i++) data[i].push(input[i].slice());
        return true;
    }
}
registerProcessor('Record', Record);
