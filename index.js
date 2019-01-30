const express = require('express');
const neode = require("neode").fromEnv().with({
	Techno: require("./models/techno"),
});

const app = express();
app.use(express.json());

app.get('/', function (req, res) {
	neode.cypher('match (n) return n').then(res => {console.log(res)});
  	res.send('Hello World!')
});

app.post('/techno', function(req, res) {
	const name = req.body.name;
	console.log(neode);
	neode.model('Techno').create({
		"name": name
	}).then(v => {
		res.send('Hello World!');
	})
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
