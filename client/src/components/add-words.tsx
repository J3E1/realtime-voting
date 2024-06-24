import { Link, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useMutation } from '@tanstack/react-query';
import { addWords } from '@/lib/actions';
import { useState } from 'react';
import { useToast } from './ui/use-toast';

export default function AddWords() {
	const params = useParams();
	const [input, setInput] = useState('');
	const { toast } = useToast();

	const { mutate, error, isPending } = useMutation({
		mutationFn: ({ input }: { input: string }) =>
			addWords(params.topic!, input, setInput, toast),
	});
	return (
		<div className='max-w-lg w-full my-4'>
			<label className='leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-semibold tracking-tight text-lg pb-2'>
				Here's what I think about
			</label>
			<div className='mt-1 flex gap-2 items-center'>
				<Input
					placeholder={` is absolutely...`}
					onChange={({ target }) => setInput(target.value)}
					value={input}
				/>
				<Button disabled={isPending} onClick={() => mutate({ input })}>
					Share
				</Button>
				<Button asChild variant={'secondary'}>
					<Link to='/'>Back</Link>
				</Button>
			</div>
			{error ? <p className='text-sm text-red-600 font-semibold'>{error.message}</p> : null}
		</div>
	);
}
