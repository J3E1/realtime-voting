import TopicCreator from '@/components/topic-creator';
import { getTopTopics } from '@/lib/actions';
import { useQuery } from '@tanstack/react-query';
import { ArrowRightIcon } from 'lucide-react';
import type { IWord } from './topic-page';
import { Link } from 'react-router-dom';

export interface ITopic {
	name: string;
	words: IWord[];
}
type Props = {};
export default function HomePage({}: Props) {
	const { data, isLoading } = useQuery({
		queryFn: getTopTopics,
		queryKey: ['getTopTopics'],
	});

	return (
		<section className='pt-10 lg:pt-24 xl:pt-32'>
			<div className='px-6 lg:px-0 lg:pt-4'>
				<div className='relative mx-auto text-center flex flex-col items-center'>
					<h1 className='relative leading-snug w-fit tracking-tight text-balance mt-8 font-bold text-gray-900 text-4xl md:text-5xl'>
						What do you{' '}
						<span className='whitespace-nowrap text-green-600'>
							th
							<span className='relative'>
								i
								<span className='absolute inset-x-0 -top-2 -translate-x-3'>
									{/* <Icons.brain className="h-7 w-7 md:h-8 md:w-8" /> */}
								</span>
							</span>
							nk
						</span>{' '}
						about...
					</h1>
					<TopicCreator />

					{!isLoading && (
						<div className='mt-14'>
							<p className='mb-4 font-semibold text-green-600'>
								Explore the top topics
							</p>
							<div className='space-y-2'>
								{data.map((topic: ITopic) => (
									<Link
										key={topic.name}
										className='flex justify-center items-center group'
										to={`/${topic.name}`}>
										{topic.name}{' '}
										<ArrowRightIcon className='w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:fill-green-600 group-hover:text-green-600 transition-all ease-in-out' />
									</Link>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
