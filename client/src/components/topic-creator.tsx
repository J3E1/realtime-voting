import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useMutation } from '@tanstack/react-query';
import { createTopic } from '@/lib/actions';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';

type Props = {};
export default function TopicCreator({}: Props) {
	const navigate = useNavigate();

	const { toast } = useToast();

	const { mutate, error, isPending } = useMutation({
		mutationFn: ({ input }: { input: string }) =>
			createTopic(input, navigate, toast),
	});
	const [input, setInput] = useState('');
	return (
		<div className='mt-12 flex flex-col gap-2'>
			<div className='flex gap-2'>
				<Input
					value={input}
					onChange={({ target }) => setInput(target.value)}
					className='bg-background/30 min-w-64 backdrop-blur-lg'
					placeholder='Enter topic here...'
				/>
				<Button disabled={isPending} onClick={() => mutate({ input })}>
					Create
				</Button>
			</div>

			{error ? <p className='text-sm text-red-600 font-semibold'>{error.message}</p> : null}
		</div>
	);
}
