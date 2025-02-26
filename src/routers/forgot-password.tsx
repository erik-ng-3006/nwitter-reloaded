import {
	Form,
	Input,
	Title,
	Wrapper,
	Error,
	Switcher,
} from '../components/auth-component';
import { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name === 'email') {
			setEmail(e.target.value);
		}
	};
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		if (isLoading || email === '') return;
		setIsLoading(true);
		try {
			await sendPasswordResetEmail(auth, email);
			toast.success('Successfully sent reset password email');
		} catch (error) {
			if (error instanceof FirebaseError) {
				setError(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Wrapper>
			<Form onSubmit={onSubmit}>
				<Title>Reset Password</Title>
				<Input
					name='email'
					value={email}
					placeholder='Email'
					type='email'
					onChange={onChange}
					autoComplete='email'
					required
				/>
				<Input
					type='submit'
					value={isLoading ? 'Sending...' : 'Send'}
				/>
			</Form>
			{error !== '' ? <Error>{error}</Error> : null}
			<Switcher>
				Back to <Link to='/login'>Login &rarr; </Link>
			</Switcher>
		</Wrapper>
	);
};

export default ForgotPassword;
