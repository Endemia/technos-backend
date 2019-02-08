const TechnosRepository = require('../repository/technosRepository');

class TechnosProcess {

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

	getTechno(name, depth) {
		return new TechnosRepository().getTechnoWithChildren(name, depth).then(result => {
			return result;
		})
	}

	/*
	getTechno(name) {
		
		return new TechnosRepository().getTechnoWithDirectChildren(name).then(result => {

			console.log('MAIN RESULTS ', result);

			//console.log('reduced ', result.map(techno => techno.children).reduce((acc, val) => acc.concat(val), []).filter(techno => techno !== undefined));

			const childrenToFetch = result.map(techno => techno.children)
				.reduce((acc, val) => acc.concat(val), [])
				.filter(techno => techno !== undefined)
				.map(techno => techno.name);
			const uniqChildrenToFetch = [...new Set(childrenToFetch)];
			const uniqChildrenFetch = uniqChildrenToFetch.map(techno => new TechnosRepository().getTechnoWithDirectChildren(techno));

			return Promise.all(uniqChildrenFetch).then(children => {
				children.forEach(c => {
					result = result.concat(c);
				})
				return result;
			}).then(technos => {
				
				const nodes=[];
				const links=[];
				const linksMap={};

				technos.forEach(t => {
					nodes.push(t.name);

					if (!linksMap[t.name]) {
						linksMap[t.name] = [];
					}
					if (t.children) {
						t.children.forEach(c => {
							nodes.push(c.name);
							linksMap[t.name].push(c.name);
						})
					}
				})
				
				for (let i in linksMap) {
					links.push({"from": i, "to": [...new Set(linksMap[i])]})
				}

				//return retour;
				return {
					nodes: [...new Set(nodes)],
					links: links
				}
			})
		})
		.catch(error => {
	      	throw error;
	    });
		
	}
	*/
}

module.exports = TechnosProcess;