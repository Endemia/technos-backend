class Techno {

    constructor(name) {
        this.name = name;
    }

    setChildren(children) {
        this.children = [];
    }

    addChild(child) {
        if (!this.child) {
            this.child = [];
        }
        this.child.push(child);
    }
}

module.exports = Techno;