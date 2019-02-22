const express = require('express');
var cors = require('cors');
const TechnosProcess = require('./process/technosProcess');
const NotesProcess = require('./process/notesProcess');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', function (req, res) {
	const name = req.query.name
	const depth = req.query.depth
	const exactMatch = req.query.exactMatch
	new TechnosProcess().getTechnoByName(name, depth, exactMatch).then(technos => {
		res.send(technos);
	})
	.catch(error => {
		console.log(error);
		res.status(500).send('Something went wrong');
	})
});

app.post('/', function(req, res) {
	const name = req.body.name;
	new TechnosProcess().createTechno(name).then(result => {
		res.status(201).send('OK');
	})
	.catch(error => {
		console.log(error);
		res.status(500).send('Something went wrong');
	})
});

app.get('/notes', function(req, res) {
	new NotesProcess().getNotes("c14736e0-32d6-11e9-b210-d663bd873d93").then(result => {
		res.send(result);
	})
});

app.get('/notes/all', function(req, res) {
	new NotesProcess().getAllNotes().then(result => {
		res.send(result);
	})
});

app.post('/notes', function(req, res) {
	const techno = req.body.techno;
	const note = req.body.note;
	new NotesProcess().updateNote("c14736e0-32d6-11e9-b210-d663bd873d93", techno, note).then(result => {
		res.status(201).send('OK');
	})
	.catch(error => {
		console.log(error);
		res.status(500).send('Something went wrong');
	})
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
});
