class Techno {

    constructor(name) {
        this.name = name;
    }

    setName(name) {
        this.name = name;
    }

    setChildren(children) {
        this.children = [];
    }

    addChild(child) {
        if (!this.children) {
            this.children = [];
        }
        this.children.push(child);
    }
}

module.exports = Techno;