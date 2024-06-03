class Message {
	#from;
	#content;
	constructor(from, content) {
		this.#from = from;
		this.#content = content;
	}
	static convert(source, destinationConstructor = null, role = null) {
		if (source instanceof this) {
			return new destinationConstructor(source.content);
			// if wants to convert from abstract class to specific class
		} else {
			// else, wants to convert from specific class to abstract class
			return new this(role ?? source.role, source.content);
		}
	}
	get content() {
		return this.#content;
	}
	set content(any) {
		throw new Error("read-only property");
	}
	get from() {
		return this.#from;
	}
	set from(any) {
		throw new Error("read-only property");
	}
}

export { Message };
