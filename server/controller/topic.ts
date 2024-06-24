import { Request, Response } from 'express';
import Topic from '../model/topic';
import { skipWords } from '../config/util';

export const createTopic = async (req: Request, res: Response) => {
	try {
		const { name } = req.body;

		if (!name) {
			throw new Error('Topic name is required');
		}

		const foundTopic = await Topic.findOne({ name });
		if (foundTopic) {
			return res
				.status(200)
				.json({ message: 'Topic created successfully', topic: foundTopic });
		}

		const topic = new Topic({ name });
		await topic.save();
		return res
			.status(200)
			.json({ message: 'Topic created successfully', topic });
	} catch (error) {
		console.log('🚀 ~ file: topic.ts:8 ~ createTopic ~ error:', error);
		return res.status(500).json({ error: (error as Error).message });
	}
};

export const getTopTopics = async (req: Request, res: Response) => {
	try {
		const topics = await Topic.find({
			words: {
				$gt: {
					value: 0,
				},
			},
		})
			.limit(3)
			.sort({ words: -1 });

		res.status(200).json(topics);
	} catch (error) {
		console.log('🚀 ~ file: topic.ts:38 ~ getTopTopics ~ error:', error);
		return res.status(500).json({ error: (error as Error).message });
	}
};

export const addWords = async (req: Request, res: Response) => {
	try {
		const { name, words } = req.body as {
			name: string;
			words: { text: string; value: number }[];
		};

		if (!name) {
			throw new Error('Topic name is required');
		}
		if (!words) {
			throw new Error('Words are required');
		}

		const topic = await Topic.findOne({ name });
		if (!topic) {
			throw new Error('Topic not found');
		}

		// Update word occurrences
		words.forEach(({ text, value }) => {
			// If word is in skipWords, skip it
			if (skipWords.includes(text)) {
				return;
			}
			// If word already exists, increment value
			const wordEntry = topic.words.find(w => w.text === text);
			if (wordEntry) {
				wordEntry.value += value;
			} else {
				// If word doesn't exist, add it
				topic.words.push({ text, value });
			}
		});

		await topic.save();
		return res.status(200).json({ message: 'Topic updated' });
	} catch (error) {
		console.log('🚀 ~ file: topic.ts:55 ~ addWords ~ error:', error);
		return res.status(500).json({ error: (error as Error).message });
	}
};
