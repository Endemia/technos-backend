const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "technos"));

const Techno = require("../models/Techno");

class TechnosRepository {

	countTechnos() {
		const session = driver.session();

		const query = 'MATCH (n:Techno) return count(*) as count';

		return session.run(query).then(result => {
			session.close();
			return result.records[0].get('count').toString();
		})
		.catch(error => {
	      	session.close();
	      	throw error;
	    });;
	}

	createTechno(name) {
		const session = driver.session();

		const query = 'CREATE (n:Techno {name:"' + name + '"}) RETURN n;'

		return session.run(query).then(result => {
			session.close();
			return new Techno(name);
		})
		.catch(error => {
	      	session.close();
	      	throw error;
	    });;
	}

	getTechnoWithChildrenByName(name, depth, exactMatch) {

		if (!depth) depth=3;

		const session = driver.session();

		let query = 'MATCH (root:Techno)';
		if (name) {
			if (exactMatch) {
				query += ' WHERE root.name = "' + name + '"';
			} else {
				query += ' WHERE root.name =~ "(?i).*' + name + '.*"';
			}
		}
		query += ' OPTIONAL MATCH (root)-[r:link*..' + depth + ']->(a) UNWIND COALESCE(r, [null]) AS rels WITH root, COLLECT(DISTINCT [startNode(rels), endNode(rels)]) AS relations RETURN root, relations;';
		
		const technosMap = {};
		return session.run(query).then(result => {
			session.close();

			result.records.forEach(record => {
				const rootTechnoName = record.get('root').properties.name;

				if (!technosMap[rootTechnoName]) {
					technosMap[rootTechnoName] = new Techno(rootTechnoName);
				}
				const techno = technosMap[rootTechnoName]; 

				const relations = record.get('relations');
				if (relations) {
					relations.forEach(rel => {
						if (rel[0]) {
							const fromName = rel[0].properties.name;
							const toName = rel[1].properties.name;

							if (!technosMap[fromName]) {
								technosMap[fromName] = new Techno(fromName);
							}
							const fromNode = technosMap[fromName];

							if (!technosMap[toName]) {
								technosMap[toName] = new Techno(toName);
							}
							fromNode.addChildIfNotPresent(new Techno(toName));
							
						}
					})
				}

			})
			return Object.keys(technosMap).map(k => technosMap[k]);
		})
		.catch(error => {
	      	session.close();
	      	throw error;
	    });
	}
}

module.exports = TechnosRepository;