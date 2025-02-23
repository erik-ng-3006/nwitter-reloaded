import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { styled } from 'styled-components';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;
	width: 420px;
	padding: 50px 0px;
`;

const Title = styled.h1`
	font-size: 42px;
	text-align: center;
	margin-bottom: 50px;
`;
const Form = styled.form`
	margin-top: 50px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
`;
const Input = styled.input`
	padding: 10px 20px;
	border-radius: 50px;
	border: none;
	width: 100%;
	font-size: 16px;
	&[type='submit'] {
		cursor: pointer;
		&:hover {
			opacity: 0.8;
		}
	}
`;
const Error = styled.span`
	color: tomato;
	font-weight: 600;
`;

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
			setError((error as Error).message);
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
		</Wrapper>
	);
};

export default CreateAccount;
