import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import styled from 'styled-components';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Button = styled.button`
	margin-top: 50px;
	font-weight: 500;
	width: 100%;
	color: #000;
	background-color: #fff;
	border: 0;
	border-radius: 50px;
	padding: 10px 20px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 5px;
`;

const Logo = styled.img`
	height: 25px;
`;
const GithubButton = () => {
	const navigate = useNavigate();
	const onClick = async () => {
		try {
			const provider = new GithubAuthProvider();
			await signInWithPopup(auth, provider);
			navigate('/');
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Button onClick={onClick}>
			<Logo src='/github-mark.svg'></Logo>
			Continue with Github
		</Button>
	);
};

export default GithubButton;
