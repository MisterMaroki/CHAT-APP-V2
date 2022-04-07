import Head from 'next/head';
import styled from 'styled-components';

function Login() {
	return (
		<Container>
			<Head>
				<title>Login</title>
			</Head>

			<LoginContainer>
				<Logo src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png" />
			</LoginContainer>
		</Container>
	);
}

export default Login;

const Container = styled.div``;

const LoginContainer = styled.div``;

const Logo = styled.img``;
