const TechnosRepository = require('../repository/technosRepository');

class TechnosProcess {

	constructor() {
		this.technosRepository = new TechnosRepository();
	}
	
	countTechnos() {
		return this.technosRepository.countTechnos();
	}

	getTechnoByName(name, depth, exactMatch) {
		return this.technosRepository.getTechnoWithChildrenByName(name, depth, exactMatch);
	}

	createTechno(name) {
		return this.technosRepository.createTechno(name);
	}
}

module.exports = TechnosProcess;