import { styled } from 'styled-components';
import { ITweet } from './timeline';
import { auth, db, storage } from '../firebase';
import { toast } from 'react-toastify';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';
import EditTweetForm, { EditTweetFormProps } from './edit-tweet-form';

const Wrapper = styled.div`
	display: grid;
	grid-template-columns: 3fr 1fr;
	padding: 20px;
	border: 1px solid rgba(255, 255, 255, 0.5);
	border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
	width: 100px;
	height: 100px;
	border-radius: 15px;
`;

const Username = styled.span`
	font-weight: 600;
	font-size: 15px;
`;

const Payload = styled.p`
	margin: 10px 0px;
	font-size: 18px;
`;

const ButtonControl = styled.div`
	display: flex;
	gap: 10px;
`;

const DeleteButton = styled.div`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 15px;
	height: 15px;
	svg {
		fill: tomato;
	}
`;
const EditButton = styled.div`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 15px;
	height: 15px;
	svg {
		fill: white;
	}
`;

const Tweet = ({ photo, tweet, username, userId, id, createdAt }: ITweet) => {
	const user = auth.currentUser;
	const [isShowUpdateForm, setIsShowUpdateForm] = useState<boolean>(false);

	const onDelete = async () => {
		const ok = confirm('Are you sure you want to delete this tweet?');
		if (!ok || !user || user?.uid !== userId) return;
		try {
			await deleteDoc(doc(db, 'tweets', id));
			if (photo) {
				const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
				await deleteObject(locationRef);
			}
		} catch (error) {
			toast.error('Could not delete tweet');
			console.log(error);
		}
	};

	return (
		<Wrapper>
			<Column>
				<Username>{username}</Username>
				{isShowUpdateForm ? (
					<EditTweetForm
						{...({
							photo,
							tweet,
							username,
							userId,
							id,
							createdAt,
							setIsShowUpdateForm,
						} as EditTweetFormProps)}
					/>
				) : (
					<Payload>{tweet}</Payload>
				)}
				{user && user.uid === userId ? (
					<ButtonControl>
						<DeleteButton onClick={onDelete}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='currentColor'
								className='size-6'
							>
								<path
									fillRule='evenodd'
									d='M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z'
									clipRule='evenodd'
								/>
							</svg>
						</DeleteButton>
						<EditButton
							onClick={() => setIsShowUpdateForm((prev) => !prev)}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='currentColor'
								className='size-6'
							>
								<path d='M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z' />
							</svg>
						</EditButton>
					</ButtonControl>
				) : null}
			</Column>
			{photo ? (
				<Column>
					<Photo src={photo} />
				</Column>
			) : null}
		</Wrapper>
	);
};

export default Tweet;
