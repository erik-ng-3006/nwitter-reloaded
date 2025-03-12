import { styled } from 'styled-components';
import { auth, db, storage } from '../firebase';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import { ITweet } from '../components/timeline';
import Tweet from '../components/tweet';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
`;

const AvatarUpload = styled.label`
	width: 80px;
	overflow: hidden;
	height: 80px;
	border-radius: 50%;
	background-color: #1d9bf0;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	svg: {
		width: 50px;
	}
`;

const AvatarImg = styled.img`
	width: 100%;
`;

const AvatarInput = styled.input`
	display: none;
`;

const Name = styled.span`
	font-size: 22px;
`;

const Tweets = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const Profile = () => {
	const user = auth.currentUser;
	const [avatar, setAvatar] = useState(user?.photoURL || '');
	const [tweets, setTweets] = useState<ITweet[]>([]);
	const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!user) return;
		const { files } = e.target;
		if (files && files.length === 1) {
			const file = files[0];

			// Check file size
			if (file.size > 1048576) {
				toast.error('File size must be less than 1MB');
				return;
			}

			// Set location url to upload
			const locationRef = ref(storage, `avatars/${user?.uid}`);

			// Upload file
			const result = await uploadBytes(locationRef, file);

			// Get download url
			const avatarUrl = await getDownloadURL(result.ref);

			// Set avatar state
			setAvatar(avatarUrl);

			// Update profile avatar
			await updateProfile(user, {
				photoURL: avatarUrl,
			});

			// Show toast message to user
			toast.success('Avatar updated successfully!');
		}
	};
	const fetchTweets = async () => {
		const tweetQuery = query(
			collection(db, 'tweets'),
			where('userId', '==', user?.uid),
			orderBy('createdAt', 'desc'),
			limit(25)
		);

		const snapshot = await getDocs(tweetQuery);

		const tweets = snapshot.docs.map((doc) => {
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
			<AvatarUpload htmlFor='avatar'>
				{avatar ? (
					<AvatarImg src={avatar} />
				) : (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						fill='currentColor'
						className='size-6'
					>
						<path
							fill-rule='evenodd'
							d='M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z'
							clip-rule='evenodd'
						/>
					</svg>
				)}
			</AvatarUpload>
			<AvatarInput
				id='avatar'
				type='file'
				accept='image/*'
				onChange={onAvatarChange}
			/>
			<Name>{user?.displayName ? user.displayName : 'Anonymous'}</Name>
			<Tweets>
				{tweets.map((tweet) => (
					<Tweet key={tweet.id} {...tweet} />
				))}
			</Tweets>
		</Wrapper>
	);
};

export default Profile;
