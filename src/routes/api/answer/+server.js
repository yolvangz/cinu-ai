import { json } from "@sveltejs/kit";
import * as app from "../../../../core/app";

function destructureMessage(message) {
	return {
		from: message.from,
		content: message.content,
	};
}

export async function POST({ request }) {
	const response = { error: null, body: null };
	const body = await request.json();
	// Validate request body
	try {
		if (!body.history || !body.question || body.question.length === 0)
			throw new Error("Bad body");
		if (
			body.history.length > 0 &&
			body.history.some((m) => {
				if (typeof m !== "object") return true;
				if (!m.content || !m.from) return true;
				const from = m.from.trim();
				const content = m.content.trim();
				return !from === "bot" || !from === "user";
			})
		)
			throw new Error("Bad history");

		// Initialize objects
		const models = app.getModels();
		const loader = app.getFileLoader();
		const [chat, embedding] = await Promise.all([
			app.newChat(body.history),
			app.getEmbedding(loader, models.getEmbeddingModel()),
		]);
		const chatbot = await app.getChatBot(
			models.getTextModel(),
			embedding,
			chat.translator,
			loader,
			false
		);
		if (body.history.length > 0) {
			const history = body.history.map(
				(m) => new app.Message(m.from, m.content)
			);
			chatbot.addMessages(...history);
		}
		// return answer
		const question = new app.Message("user", body.question);
		const answer = await chatbot.answer(question);
		response.body = {
			question: destructureMessage(question),
			answer: destructureMessage(answer),
		};
	} catch (e) {
		response.error = { code: 400, message: e.message };
	}
	return json(response);
}
