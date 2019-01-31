const neode = require("neode").fromEnv().with({
	Techno: require("../models/techno"),
});

TechnoProcess = {
	getAllTechnos : () => {
		return neode.cypher('MATCH (a:Techno) OPTIONAL MATCH (a)-->(b) RETURN a,b').then(res => {
			
			const nodes = [];
			const singleNodes = [];

			res.records.forEach(r => {
				const parent = {};
				const parentName = r._fields[0].properties.name;
				if (singleNodes.indexOf(parentName) < 0) {
					parent[parentName] = [];
					nodes.push(parent);
					singleNodes.push(parentName);
					if (r._fields[1]) {
						const child = r._fields[1].properties.name;
						if (singleNodes.indexOf(child) < 0) {
							parent[parentName].push(child);
							singleNodes.push(child);
						}
					}
				}
			})
			return nodes;

		});
	}
}

module.exports = TechnoProcess;