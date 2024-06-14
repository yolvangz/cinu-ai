import { json } from "@sveltejs/kit";
import * as app from "../../../../core/app";

function destructureMessage(message) {
	return {
		from: message.from,
		content: message.content,
	};
}

export async function POST({ request }) {
	const body = await request.json();
	// Validate request body
	if (!body.history || !body.question || body.question.length === 0)
		return await json({ error: "Bad body" });
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
		return await json({ error: "Bad history" });

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
		const history = body.history.map((m) => new app.Message(m.from, m.content));
		chatbot.addMessages(...history);
	}
	// return answer
	const question = new app.Message("user", body.question);
	const answer = await chatbot.answer(question);
	return json({
		question: destructureMessage(question),
		answer: destructureMessage(answer),
	});
}
