class Techno {

    constructor(name, children) {
        this.name = name;
        this.children = children || [];
    }

    setName(name) {
        this.name = name;
    }

    addChild(child) {
        this.children.push(child);
    }
    addChildIfNotPresent(child) {
        if (!this.hasChild(child)) {
            this.children.push(child);
        }
    }
    hasChild(child) {
        return this.children.filter(c => c.name == child.name).length;
    }
}

module.exports = Techno;