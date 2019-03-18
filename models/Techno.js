class Techno {

    constructor(name, children, niveau) {
        this.name = name;
        this.children = children || [];
        if (niveau !== undefined) {
            this.niveau = niveau;
        }
    }

    setName(name) {
        this.name = name;
    }

    setNiveau(niveau) {
        this.niveau = niveau;
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