import { Button, IconButton } from '@material-ui/core';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';
import { auth, provider, signInWithPopup } from '../firebase';
import createRipple from '../utils/buttonRipple';

function Login() {
	const signIn = async () => {
		auth.signInWithPopup(provider).catch(alert);
	};

	const buttons = document.getElementsByTagName('button');
	for (const button of buttons) {
		button.addEventListener('click', createRipple);
	}

	return (
		<Container>
			<Head>
				<title>Login</title>
			</Head>

			<LoginContainer>
				{/* <LogoDiv> */}
				<Image
					src="/logo.svg"
					alt="logo"
					width={200}
					height={200}
					objectFit="contain"
				/>
				{/* </LogoDiv> */}
				<H1>Snappy</H1>

				{/* <button>Sign in with Google</button> */}
				<Buttonn variant="outlined" onClick={signIn}>
					Sign in with Google
				</Buttonn>
			</LoginContainer>
		</Container>
	);
}

export default Login;

export const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	background-color: #131344;

	span.ripple {
		position: absolute;
		border-radius: 50%;
		transform: scale(0);
		animation: ripple 600ms linear;
		background-color: rgba(255, 255, 255, 0.7);
	}

	@keyframes ripple {
		to {
			transform: scale(4);
			opacity: 0;
		}
	}
`;

const LoginContainer = styled.div`
	display: flex;
	padding: 100px;
	align-items: center;
	flex-direction: column;
	background-color: lightgray;
	border-radius: 5px;
	box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.75);
`;

const Buttonn = styled(Button)`
	&&& {
		position: relative;
		overflow: hidden;
		transition: all 400ms;
		color: whitesmoke;
		font-weight: 700;
		text-transform: none;
		background-color: #003daa;
		padding: 0.75rem 1.5rem;
		font-family: 'Roboto', sans-serif;
		font-size: 1rem;
		outline: 0;
		border: 0;
		border-radius: 0.25rem;
		box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3); /* black with 30% opacity */
		cursor: pointer;
		:hover {
			opacity: 0.9;
		}
	}
`;

const H1 = styled.h1`
	color: #131344;
	margin: 10px;
	padding-bottom: 20px;
	font-size: 2.5rem;
`;
