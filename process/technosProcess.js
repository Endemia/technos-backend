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

	createTechno(name, links, linkType, userId) {
		return this.technosRepository.createTechno(name, links, linkType, userId);
	}

	createLink(from, to, userId) {
		return this.technosRepository.createLink(from, to, userId);
	}

	centerOnTechno(name, depth) {
		return this.technosRepository.centerOnTechno(name, depth);
	}

}

module.exports = TechnosProcess;