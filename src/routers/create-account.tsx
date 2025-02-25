import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import {
	Form,
	Input,
	Switcher,
	Title,
	Wrapper,
	Error,
} from '../components/auth-component';

const CreateAccount = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name === 'name') {
			setName(e.target.value);
		} else if (e.target.name === 'email') {
			setEmail(e.target.value);
		} else if (e.target.name === 'password') {
			setPassword(e.target.value);
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError('');
		if (isLoading || name === '' || email === '' || password === '') return;

		try {
			setIsLoading(true);
			//create user
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			console.log(userCredential.user);
			//set user
			await updateProfile(userCredential.user, { displayName: name });
			//redirect
			navigate('/');
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
				<Title>Join 𝕏</Title>
				<Input
					name='name'
					value={name}
					placeholder='Name'
					type='text'
					onChange={onChange}
					required
				/>
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
					value={isLoading ? 'Loading...' : 'Create Account'}
				/>
			</Form>
			{error !== '' ? <Error>{error}</Error> : null}
			<Switcher>
				Already have an account? <Link to='/login'>Login &rarr; </Link>
			</Switcher>
		</Wrapper>
	);
};

export default CreateAccount;
