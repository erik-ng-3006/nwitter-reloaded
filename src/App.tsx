import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout';
import Home from './routers/home';
import Profile from './routers/profile';
import Login from './routers/login';
import CreateAccount from './routers/create-account';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { useEffect, useState } from 'react';
import LoadingScreen from './components/loading-screen';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				path: '',
				element: <Home />,
			},
			{
				path: 'profile',
				element: <Profile />,
			},
		],
	},
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/create-account',
		element: <CreateAccount />,
	},
]);

const GlobalStyles = createGlobalStyle`
${reset};
* {
  box-sizing: border-box;
}
body {
  background-color: black;
  color: white;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
}
`;

const App = () => {
	const [isLoading, setIsLoading] = useState(true);
	const init = async () => {
		// connect to firebase
		setIsLoading(false);
	};
	useEffect(() => {
		setTimeout(() => {
			init();
		}, 2000);
	}, []);
	return (
		<>
			<GlobalStyles />
			{isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
		</>
	);
};

export default App;
