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
}

module.exports = TechnosRepository;