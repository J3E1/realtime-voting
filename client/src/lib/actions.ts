import { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';

export const createTopic = async (
	topicName: string,
	navigate: NavigateFunction,
	toast: any
) => {
	try {
		if (!topicName) {
			throw new Error('Topic name is required');
		}
		const formattedTopic = topicName.toLowerCase().trim().split(' ').join('-');
		const res = await fetch(`/api/topics`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: formattedTopic }),
		});
		if (res.ok) {
			navigate(`/${formattedTopic}`);
			toast({
				title: 'Topic created successfully',
				variant: 'success',
			});
		}
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error('Something went wrong');
		}
	}
};

function wordFreq(text: string): { text: string; value: number }[] {
	const words: string[] = text.replace(/\./g, '').split(/\s/);
	const freqMap: Record<string, number> = {};

	for (const w of words) {
		if (!freqMap[w]) freqMap[w] = 0;
		freqMap[w] += 1;
	}
	return Object.keys(freqMap).map(word => ({
		text: word,
		value: freqMap[word],
	}));
}
export const addWords = async (
	topicName: string,
	words: string,
	setInput: Dispatch<SetStateAction<string>>,
	toast: any
) => {

	try {
		if (!topicName) {
			throw new Error('Topic name is required');
		}
		if (!words) {
			throw new Error('Please enter some words');
		}
		const wordsArray = wordFreq(words);
		const res = await fetch(
			`/api/topics/${topicName}`,
			{
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: topicName, words: wordsArray }),
			}
		);
		if (res.ok) {
			setInput('');
			toast({
				title: 'Words added successfully',
				variant: 'success',
			});
		}
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error('Something went wrong');
		}
	}
};

export const getTopTopics = async () => {
	const res = await fetch(`/api/topics`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	});
	const data = await res.json();
	return data;
};
