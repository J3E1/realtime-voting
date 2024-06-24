import { Outlet } from 'react-router-dom';

export default function RootLayout() {
	return (
		<div className='min-h-screen bg-zinc-100 overflow-hidden'>
			<div className='relative max-w-screen-xl mx-auto p-4 md:px-20'>
				<div className='w-full max-w-lg'>
					<div className='absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full opacity-20 mix-blend-multiply filter blur-3xl animate-blob'></div>
					<div className='absolute top-0 right-2 w-96 h-96 bg-yellow-300 rounded-full opacity-20 mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000'></div>
					<div className='absolute -bottom-4 right-1/2 w-96 h-96 bg-pink-300 rounded-full opacity-20 mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000'></div>
				</div>
				<Outlet />
			</div>
		</div>
	);
}
