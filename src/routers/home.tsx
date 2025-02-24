import { auth } from '../firebase';

const Home = () => {
	const logOut = () => {
		auth.signOut();
	};
	return (
		<div>
			<h1>Home</h1>
			<button onClick={logOut}>Log out</button>
		</div>
	);
};

export default Home;
