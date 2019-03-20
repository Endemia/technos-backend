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

	createTechno(name, links, linkType, userId) {
		const session = driver.session();
		return session.writeTransaction((transaction) => transaction.run(`CREATE (n:Techno {name:"${name}", createdBy:"${userId}"}) RETURN n;`))
		.then(() => {
			if (linkType === "child") {
				let chain = null;
				links.forEach(link => {
					if (chain === null) {
						chain = session.writeTransaction((transaction) => transaction.run(`MATCH (a:Techno {name:"${name}"}) MATCH (b:Techno {name: "${link}"}) CREATE (b)-[r:link {createdBy:"${userId}"}]->(a);`))
					} else {
						chain = chain.then(() => {
							return session.writeTransaction((transaction) => transaction.run(`MATCH (a:Techno {name:"${name}"}) MATCH (b:Techno {name: "${link}"}) CREATE (b)-[r:link {createdBy:"${userId}"}]->(a);`))
						})
					}
				})
				return chain;
			} else {
				let chain = null;
				links.forEach(link => {
					if (chain === null) {
						chain = session.writeTransaction((transaction) => transaction.run(`MATCH (a:Techno {name:"${name}"}) MATCH (b:Techno {name: "${link}"}) CREATE (a)-[r:link {createdBy:"${userId}"}]->(b);`))
					} else {
						chain = chain.then(() => {
							return session.writeTransaction((transaction) => transaction.run(`MATCH (a:Techno {name:"${name}"}) MATCH (b:Techno {name: "${link}"}) CREATE (a)-[r:link {createdBy:"${userId}"}]->(b);`))
						})
					}
				})
				return chain;
			}
		})
		.then(() => {
			session.close();
			return new Techno(name);
		}).catch(error => {
	      	session.close();
	      	throw error;
	    });
	}

	createLink(from, to, userId) {
		const session = driver.session();
		return session.writeTransaction((transaction) => { 
			return transaction.run(`MATCH (a:Techno {name:"${from}"}) MATCH (b:Techno {name:"${to}"}) CREATE (a)-[r:link {createdBy:"${userId}"}]->(b);`).then(res => {
				if (res.summary.updateStatistics._stats.relationshipsCreated === 0) {
					throw new Error("No link created");
				}
			})
		}).then((res) => {
			session.close();
			return new Techno(from);
		}).catch(error => {
	      	session.close();
	      	throw error;
	    });
	}

	centerOnTechno(name, depth) {
		if (depth === undefined) depth=2;

		const session = driver.session();
		let query = `MATCH (root:Techno) WHERE root.name = "${name}" OPTIONAL MATCH (root)-[r:link*..${depth}]-(a) UNWIND COALESCE(r, [null]) AS rels WITH root, COLLECT(DISTINCT [startNode(rels), endNode(rels)]) AS relations RETURN root, relations;`;

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

	getTechnoWithChildrenByName(name, depth, exactMatch) {

		if (depth === undefined) depth=2;

		const session = driver.session();

		let query = 'MATCH (root:Techno)';
		if (name) {
			if (exactMatch) {
				query += ` WHERE root.name = "${name}"`;
			} else {
				query += ` WHERE root.name =~ "(?i).*${name}.*"`;
			}
		}
		query += ` OPTIONAL MATCH (root)-[r:link*..${depth}]->(a) UNWIND COALESCE(r, [null]) AS rels WITH root, COLLECT(DISTINCT [startNode(rels), endNode(rels)]) AS relations RETURN root, relations;`;
		
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