import { useState } from 'react';
import { toast } from 'react-toastify';
import { styled } from 'styled-components';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from 'firebase/storage';

export interface EditTweetFormProps {
	photo: string;
	tweet: string;
	userId: string;
	id: string;
	setIsShowUpdateForm: (value: boolean) => void;
}
const Form = styled.form`
	margin: 10px 0;
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
	padding: 10px;
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

const ButtonControl = styled.div`
	display: flex;
	gap: 10px;
`;

const AttachFileButton = styled.label`
	padding: 10px;
	color: #1d9bf0;
	text-align: center;
	border: 1px solid #1d9bf0;
	font-size: 16px;
	border-radius: 20px;
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
	padding: 10px;
	border-radius: 20px;
	font-size: 16px;
	cursor: pointer;
	&:hover,
	&:active {
		opacity: 0.9;
	}
`;

const EditTweetForm = ({
	photo,
	tweet,
	userId,
	id,
	setIsShowUpdateForm,
}: EditTweetFormProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [editTweet, setEditTweet] = useState(tweet || '');
	const [editFile, setEditFile] = useState<File | null>(null);

	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditTweet(e.target.value);
	};

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 1048576) {
			toast.error('File size must be less than 1MB');
			return;
		}

		setEditFile(file);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isLoading) return;

		const user = auth.currentUser;
		if (!user || !editTweet.trim() || editTweet.length > 280) return;

		setIsLoading(true);

		try {
			const tweetRef = doc(db, 'tweets', id);
			const updates: { tweet?: string; photo?: string } = {};

			// Update tweet text if changed
			if (editTweet !== tweet) {
				updates.tweet = editTweet;
			}

			// Handle file upload
			if (editFile) {
				const fileRef = ref(storage, `tweets/${userId}/${id}`);

				// Delete previous photo if exists
				if (photo) {
					await deleteObject(fileRef);
				}

				// Upload new file
				const snapshot = await uploadBytes(fileRef, editFile);
				const downloadUrl = await getDownloadURL(snapshot.ref);
				updates.photo = downloadUrl;
			}

			// Update Firestore only once
			if (Object.keys(updates).length > 0) {
				await updateDoc(tweetRef, updates);
			}

			toast.success('Tweet updated successfully');
			setIsShowUpdateForm(false);
		} catch (error) {
			console.error(error);
			toast.error('Could not update tweet');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form onSubmit={onSubmit}>
			<TextArea
				rows={3}
				maxLength={280}
				placeholder='What is happening?'
				onChange={onChange}
				value={editTweet}
			/>
			<ButtonControl>
				<AttachFileButton htmlFor='editFile'>
					{editFile ? 'Photo added ✅' : 'Add photo'}
				</AttachFileButton>
				<AttachFileInput
					onChange={onFileChange}
					id='editFile'
					accept='image/*'
					type='file'
				/>
				<SubmitButton
					type='submit'
					value={isLoading ? 'Updating...' : 'Update Tweet'}
				/>
			</ButtonControl>
		</Form>
	);
};

export default EditTweetForm;
