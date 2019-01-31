const neode = require("neode").fromEnv().with({
	Techno: require("./models/techno"),
});

TechnoProcess = {
	getAllTechnos : () => {
		neode.cypher('match (n) return n').then(res => {
			console.log(res);
			return res
		});
	}
}