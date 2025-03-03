import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { styled } from 'styled-components';
import { auth, db } from '../firebase';

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const TextArea = styled.textarea`
	width: 100%;
	resize: none;
	border: 2px solid white;
	border-radius: 5px;
	font-size: 16px;
	padding: 20px;
	border-radius: 20px;
	color: white;
	background-color: black;
	font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
		Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
		sans-serif;
	&::placeholder {
		font-size: 16px;
	}
	&:focus {
		outline: none;
		border-color: #1d9bf0;
	}
`;

const AttachFileButton = styled.label`
	padding: 10px 0;
	color: #1d9bf0;
	text-align: center;
	border-radius: 20px;
	border: 1px solid #1d9bf0;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
`;

const AttachFileInput = styled.input`
	display: none;
`;

const SubmitButton = styled.input`
	background-color: #1d9bf0;
	color: white;
	border: none;
	padding: 10px 0;
	border-radius: 20px;
	font-size: 16px;
	cursor: pointer;
	&:hover,
	&:active {
		opacity: 0.9;
	}
`;
const PostTweetForm = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [tweet, setTweet] = useState('');
	const [file, setFile] = useState<File | null>(null);

	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTweet(e.target.value);
	};

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e?.target;
		if (target && target.files) {
			const { files } = target;
			if (files && files.length === 1) {
				setFile(files[0]);
			}
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const user = auth.currentUser;
		if (!user || isLoading || tweet === '' || tweet.length > 280) return;

		try {
			setIsLoading(true);
			await addDoc(collection(db, 'tweets'), {
				tweet,
				createdAt: Date.now(),
				username: user.displayName || 'Anonymous',
				userId: user.uid,
			});
			setTweet('');
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Form onSubmit={onSubmit}>
			<TextArea
				rows={5}
				maxLength={280}
				placeholder='What is happening?'
				onChange={onChange}
				value={tweet}
			/>
			<AttachFileButton htmlFor='file'>
				{file ? 'Photo added ✅' : 'Add photo'}
			</AttachFileButton>
			<AttachFileInput
				onChange={onFileChange}
				id='file'
				accept='image/*'
				type='file'
				hidden
			/>
			<SubmitButton
				type='submit'
				value={isLoading ? 'Posting...' : 'Post Tweet'}
			/>
		</Form>
	);
};

export default PostTweetForm;
