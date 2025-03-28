import { styled } from 'styled-components';

export const Wrapper = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;
	width: 420px;
	padding: 50px 0px;

	a {
		color: #1d9bf0;
		text-decoration: none;
		&:hover {
			color: #0d8ae5;
		}
	}
`;

export const Title = styled.h1`
	font-size: 42px;
	text-align: center;
	margin-bottom: 50px;
`;
export const Form = styled.form`
	margin-top: 50px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
`;
export const Input = styled.input`
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
export const Error = styled.span`
	color: tomato;
	font-weight: 600;
`;

export const Switcher = styled.span`
	margin-top: 20px;
`;
