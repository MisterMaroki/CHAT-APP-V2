import { Button, IconButton } from '@material-ui/core';
import Head from 'next/head';
import styled from 'styled-components';
import { auth, provider, signInWithPopup } from '../firebase';

function Login() {
	function createRipple(event) {
		const button = event.currentTarget;

		const circle = document.createElement('span');
		const diameter = Math.max(button.clientWidth, button.clientHeight);
		const radius = diameter / 2;

		circle.style.width = circle.style.height = `${diameter}px`;
		circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
		circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
		circle.classList.add('ripple');

		const ripple = button.getElementsByClassName('ripple')[0];

		if (ripple) {
			ripple.remove();
		}

		button.appendChild(circle);
	}

	const buttons = document.getElementsByTagName('button');
	for (const button of buttons) {
		button.addEventListener('click', createRipple);
	}

	const signIn = async () => {
		auth.signInWithPopup(provider).catch(alert);
	};

	return (
		<Container>
			<Head>
				<title>Login</title>
			</Head>

			<LoginContainer>
				<Logo src="/logo.svg" />
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

const Container = styled.div`
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
const LoginContainer = styled.div`
	display: flex;
	padding: 100px;
	align-items: center;
	flex-direction: column;
	background-color: lightgray;
	border-radius: 5px;
	box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.75);
`;

const Logo = styled.img`
	height: 200px;
	width: 200px;
	padding-bottom: 20px;
`;

const H1 = styled.h1`
	color: #131344;
	margin: 10px;
	padding-bottom: 20px;
	font-size: 2.5rem;
`;
