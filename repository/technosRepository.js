const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "technos"));

const Techno = require("../models/techno");

class TechnosRepository {

	getTechnoWithDirectChildren(name) {
		
		console.log("getTechnoWithDirectChildren ", name);

		const session = driver.session();

		let query = 'MATCH (a:Techno)';
		if (name) {
			query+= ' WHERE a.name =~ "(?i)' + name + '.*"';
		}
		query += ' OPTIONAL MATCH (a)-[r:link]->(b) RETURN *';

		return session.run(query).then(result => {
			session.close();

			const technosMap = {};

			result.records.forEach(record => {

				const technoName = record.get('a').properties.name
				
				if (!technosMap[technoName]) {
					technosMap[technoName] = new Techno(technoName);
				}
				const techno = technosMap[technoName]; 

				if (record.get('b')) {
					techno.addChild(new Techno(record.get('b').properties.name));
				}
				
			})

			return Object.keys(technosMap).map(k => technosMap[k]);
			
		})
		.catch(error => {
	      	session.close();
	      	throw error;
	    });
	}

	getTechnoWithChildren(name, depth) {

		if (!depth) depth=3;

		const session = driver.session();

		let query = 'match (root:Techno)';
		if (name) {
			query += ' where root.name =~ "(?i).*' + name + '.*"';
		}
		query += ' optional match (root)-[r:link*..' + depth + ']->(a) unwind coalesce(r, [null]) as rels with root, collect(distinct [startNode(rels), endNode(rels)]) as relations return root, relations;';
		
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