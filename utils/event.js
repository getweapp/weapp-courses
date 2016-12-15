class Event {
    constructor(){
        this.listens = {}
    }

    on(name, fn) {
        this.listens[name] = fn
    }

    exec(name) {
        if(!name || !(name in this.listens) || typeof(this.listens[name]) != 'function')
            return
        this.listens[name]()
    }
}

const event = new Event()



export default event