class Techno {

    constructor(name) {
        this.name = name;
    }

    setName(name) {
        this.name = name;
    }

    addChild(child) {
        if (!this.children) {
            this.children = [];
        }
        this.children.push(child);
    }
    addChildIfNotPresent(child) {
        if (!this.children) {
            this.children = [];
        }
        if (!this.hasChild(child)) {
            this.children.push(child);
        }
    }
    hasChild(child) {
        return this.children.filter(c => c.name == child.name).length;
    }
}

module.exports = Techno;