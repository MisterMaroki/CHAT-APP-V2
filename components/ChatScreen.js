import { Avatar, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth } from '../firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import MoreVert from '@material-ui/icons/MoreVert';
import { AttachFile } from '@material-ui/icons';

function ChatScreen() {
	const [user] = useAuthState(auth);
	const router = useRouter();

	return (
		<Container>
			<Header>
				<Avatar />
				<HeaderInformation>
					<h3>Rec email</h3>
					<p>Last seen:</p>
				</HeaderInformation>
				<HeaderIcons>
					<IconButton>
						<AttachFile />
					</IconButton>
					<IconButton>
						<MoreVert />
					</IconButton>
				</HeaderIcons>
			</Header>

			<MessageContainer></MessageContainer>
		</Container>
	);
}
export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
	position: sticky;
	background-color: white;
	z-index: 100;
	top: 0;
	display: flex;
	padding: 11px;
	height: 80px;
	align-items: center;
	border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
	margin-left: 15px;
	flex: 1;

	h3 {
		margin-bottom: 3px;
	}
	p {
		font-size: 14px;
		color: gray;
	}
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div``;
