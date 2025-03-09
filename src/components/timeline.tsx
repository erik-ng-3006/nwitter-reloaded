import {
	collection,
	limit,
	onSnapshot,
	orderBy,
	query,
	Unsubscribe,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { db } from '../firebase';
import Tweet from './tweet';

export interface ITweet {
	photo?: string;
	tweet: string;
	username: string;
	createdAt: number;
	userId: string;
	id: string;
}

const Wrapper = styled.div`
	display: flex;
	gap: 10px;
	flex-direction: column;
`;
const Timeline = () => {
	const [tweets, setTweets] = useState<ITweet[]>([]);

	useEffect(() => {
		let unsubscribe: Unsubscribe | null = null;
		const fetchTweets = async () => {
			const tweetsQuery = query(
				collection(db, 'tweets'),
				orderBy('createdAt', 'desc'),
				limit(25)
			);

			unsubscribe = await onSnapshot(tweetsQuery, (querySnapshot) => {
				const tweets = querySnapshot.docs.map((doc) => {
					const { photo, tweet, username, createdAt, userId } =
						doc.data();
					return {
						photo,
						tweet,
						username,
						createdAt,
						userId,
						id: doc.id,
					};
				});
				setTweets(tweets);
			});
		};
		fetchTweets();

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	}, []);
	return (
		<Wrapper>
			{tweets.map((tweet) => (
				<Tweet key={tweet.id} {...tweet} />
			))}
		</Wrapper>
	);
};

export default Timeline;
