import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-zinc-100 p-4'>
			<div className='bg-background shadow-lg rounded-lg p-8 max-w-md text-center'>
				<h1 className='text-4xl font-bold text-destructive mb-4'>
					404 - Page Not Found
				</h1>
				<p className='text-zinc-700 mb-4'>
					Sorry, the page you are looking for does not exist.
				</p>
				<Button asChild>
					<Link to='/'>Go to Homepage</Link>
				</Button>
			</div>
		</div>
	);
};

export default NotFound;
