const Interface = require("./interface.js");

class Test extends Interface {
	storageExists() {
		console.log("Checking if storage exists from 'Test'");
		return true;
	}
	createStorage() {
		return { action: "create" };
	}
	loadStorage() {
		return { action: "load" };
	}
	search(query) {
		if (!super.constructor.validateQuery("query")) return null;
		console.log(`Make a search about: ${query}`);
		return [];
	}
}
module.exports = Test;
