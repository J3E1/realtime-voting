import { useEffect, useState } from 'react';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import { scaleLog } from '@visx/scale';
import { Text } from '@visx/text';
import { useNavigate, useParams } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import AddWords from '@/components/add-words';
import { useToast } from '@/components/ui/use-toast';

export interface IWord {
	text: string;
	value: number;
}

const colors = ['#143059', '#2F6B9A', '#82a6c2'];

const socket: Socket = io(import.meta.env.VITE_SERVER_URL); // Adjust the URL as necessary

type Props = {};
export default function TopicPage({}: Props) {
	const params = useParams();

	const navigate = useNavigate();

	const { toast } = useToast();

	const [words, setWords] = useState<IWord[]>([]);

	// Establish a socket connection to the server and join the room specified by the topic parameter
	useEffect(() => {
		socket.emit('join-room', params.topic!); // Emit a 'join-room' event to the server with the topic parameter

		// Listen for 'topicInitial' event from the server
		socket.on('topicInitial', (initialWords: IWord[] | 'topic-not-found') => {
			if (initialWords === 'topic-not-found') {
				// If the response is 'topic-not-found'
				toast({
					description: 'Topic not found',
					variant: 'destructive',
				});
				navigate('/'); // Redirect to the home page
			} else {
				setWords(initialWords); // Update the state with the initial words
			}
		});

		// Listen for 'topicUpdated' event from the server
		socket.on('topicUpdated', (updatedWords: IWord[]) => {
			setWords(updatedWords); // Update the state with the updated words
		});

		// Clean up the effect
		return () => {
			socket.off('topicInitial'); // Remove the 'topicInitial' event listener from the server
			socket.off('topicUpdated'); // Remove the 'topicUpdated' event listener from the server
			socket.emit('leave-room', params.topic!); // Emit a 'leave-room' event to the server with the topic parameter
		};
	}, []);
	const fontScale = scaleLog({
		domain: [
			Math.min(...words.map(w => w.value)),
			Math.max(...words.map(w => w.value)),
		],
		range: [10, 100],
	});
	return (
		<section className='py-10'>
			<div className='px-6'>
				<div className='relative mx-auto text-center flex flex-col items-center'>
					<h1 className='relative leading-snug w-fit tracking-tight text-balance font-bold text-gray-900 text-4xl md:text-5xl'>
						What people think about{' '}
						<span className='whitespace-nowrap text-green-600'>{params.topic}</span>
					</h1>
					<p className='text-md text-zinc-400 my-2'>(updated in real-time)</p>
					<Wordcloud
						words={words}
						width={500}
						height={500}
						fontSize={data => fontScale(data.value)}
						font={'Impact'}
						padding={2}
						spiral={'archimedean'}
						rotate={0}
						random={() => 0.5}>
						{cloudWords =>
							cloudWords.map((w, i) => (
								<Text
									key={w.text}
									fill={colors[i % colors.length]}
									textAnchor={'middle'}
									transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
									fontSize={w.size}
									fontFamily={w.font}>
									{w.text}
								</Text>
							))
						}
					</Wordcloud>
					<AddWords />
				</div>
			</div>
		</section>
	);
}
