import { Button } from '@/components/ui/button';
import { ErrorResponse, useRouteError } from 'react-router-dom';

export function RootErrorBoundary() {
	let error = useRouteError() as ErrorResponse;
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-zinc-100 p-4'>
			<div className='bg-background shadow-lg rounded-lg p-8 max-w-md text-center'>
				<h1 className='text-3xl font-bold text-destructive mb-4'>
					Uh oh, something went terribly wrong 😩
				</h1>
				<pre className='bg-zinc-200 p-4 rounded-lg mb-4 text-left text-sm text-zinc-700 overflow-x-auto'>
					{error.data || JSON.stringify(error, null, 2)}
				</pre>
				<Button onClick={() => (window.location.href = '/')}>
					Click here to reload the app
				</Button>
			</div>
		</div>
	);
}
