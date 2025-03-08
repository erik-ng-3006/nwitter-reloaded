import { collection, getDocs, orderBy, query } from 'firebase/firestore';
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

const Wrapper = styled.div``;
const Timeline = () => {
	const [tweets, setTweets] = useState<ITweet[]>([]);

	const fetchTweets = async () => {
		const tweetsQuery = query(
			collection(db, 'tweets'),
			orderBy('createdAt', 'desc')
		);
		const querySnapshot = await getDocs(tweetsQuery);

		const tweets = querySnapshot.docs.map((doc) => {
			const { photo, tweet, username, createdAt, userId } = doc.data();
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
	};

	useEffect(() => {
		fetchTweets();
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
