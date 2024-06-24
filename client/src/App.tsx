import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/home-page';
import TopicPage from './pages/topic-page';
import { RootErrorBoundary } from './pages/error-page';
import RootLayout from './components/layout';
import NotFound from './pages/not-found-page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		errorElement: <RootErrorBoundary />,
		children: [
			{
				path: '',
				index: true,
				element: <HomePage />,
			},
			{
				path: ':topic',
				element: <TopicPage />,
			},
			{
				path: '*',
				element: <NotFound />,
			},
		],
	},
]);

const client = new QueryClient();

export function Fallback() {
	return <p>Performing initial data "load"</p>;
}

function App() {
	return (
		<QueryClientProvider client={client}>
			<RouterProvider router={router} fallbackElement={<Fallback />} />
			<Toaster />
		</QueryClientProvider>
	);
}

export default App;
