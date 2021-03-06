const touch = (map, key, ctor) => {
    if(!map.has(key)) map.set(key, new ctor);
    return map.get(key);
};
export const SoundFont_list = new class {
    constructor(){
        this.tone = new Map;
        this.drum = new Map;
        this.callback = new Set;
    }
    onload(callback){
        this.callback.add(callback);
    }
    async init(){
        const res = await fetch('https://surikov.github.io/webaudiofontdata/sf2/list.txt'),
              str = await res.text(),
              {tone, drum} = this;
        for(const s of str.trim().split('\n')){
            if(s.slice(0, 3) === '128') {
                const a = s.slice(3).split('_'),
                      [key, id] = a,
                      font = a.slice(2).join('_').slice(0, -3);
                touch(touch(drum, font, Map), id, Set).add(key);
            }
            else {
                const a = s.split('_'),
                      [id] = a,
                      font = a.slice(1).join('_').slice(0, -3);
                touch(tone, font, Set).add(id);
            }
        }
        for(const callback of this.callback) callback();
        this.callback.clear();
    }
};
