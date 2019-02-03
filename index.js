const express = require('express');
var cors = require('cors');
const TechnosProcess = require('./process/technosProcess');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', function (req, res) {
	new TechnosProcess().getRandomTechno().then(technos => {
		res.send(technos);
	})
});

app.post('/techno', function(req, res) {
	const name = req.body.name;
	neode.model('Techno').create({
		"name": name
	}).then(v => {
		res.send('Hello World!');
	})
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
});
