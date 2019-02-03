const Techno = require("../models/techno");

const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "technos"));


class TechnoProcess {

	countTechnos() {

		const session = driver.session();
		return session.run('MATCH (n:Techno) return count(*) as count').then(result => {
			session.close();
			return result.records[0].get('count').toString();
		})
		.catch(error => {
	      	session.close();
	      	throw error;
	    });;

	}

	getRandomTechno() {
		
		return this.countTechnos().then(count => {

			const randomOffset = Math.floor(Math.random() * count);

			const session = driver.session();

			return session.run('MATCH (a:Techno) OPTIONAL MATCH (a)-[r:link]->(b) RETURN a, b').then(result => {
				session.close();

				const retour = {
					nodes:[],
					links:[]
				}

				result.records.forEach(record => {

					console.log(record.get('a').properties.name);

					
					if (record.get('a') && retour.nodes.indexOf(record.get('a').properties.name) < 0) {
						retour.nodes.push(record.get('a').properties.name);
					}
					if (record.get('b')) {
						retour.links.push({from : record.get('a').properties.name, to : record.get('b').properties.name});
					}
					
				})
				return retour;
			})
			.catch(error => {
		      	session.close();
		      	throw error;
		    });

		})
		
	}
}

module.exports = TechnoProcess;