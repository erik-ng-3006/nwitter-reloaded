import styled from 'styled-components';

const Wrapper = styled.div`
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Text = styled.p`
	font-size: 2rem;
`;

const LoadingScreen = () => {
	return (
		<Wrapper>
			<Text>Loading...</Text>
		</Wrapper>
	);
};

export default LoadingScreen;
