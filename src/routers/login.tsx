import { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
	Form,
	Input,
	Switcher,
	Title,
	Wrapper,
	Error,
} from '../components/auth-component';

const Login = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name === 'email') {
			setEmail(e.target.value);
		} else if (e.target.name === 'password') {
			setPassword(e.target.value);
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		if (isLoading || email === '' || password === '') return;
		try {
			setIsLoading(true);
			await signInWithEmailAndPassword(auth, email, password);
			//redirect
			navigate('/');
		} catch (error) {
			if (error instanceof FirebaseError) {
				if (error.code === 'auth/email-already-in-use') {
					setError('Email is already exist');
				}
				setError(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Wrapper>
			<Form onSubmit={onSubmit}>
				<Title>Log into 𝕏</Title>
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
					name='password'
					value={password}
					placeholder='Password'
					type='password'
					onChange={onChange}
					autoComplete='current-password'
					required
				/>
				<Input
					type='submit'
					value={isLoading ? 'Loading...' : 'Login'}
				/>
			</Form>
			{error !== '' ? <Error>{error}</Error> : null}
			<Switcher>
				Don't have an account?{' '}
				<Link to='/create-account'>Create one &rarr; </Link>
			</Switcher>
		</Wrapper>
	);
};

export default Login;
