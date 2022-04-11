import { Avatar } from '@material-ui/core';
import styled from 'styled-components';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';

function Chat({ id, users }) {
	const router = useRouter();
	const [user] = useAuthState(auth);
	const [recipientSnapshot] = useCollection(
		db.collection('users').where('email', '==', getRecipientEmail(users, user))
	);

	const enterChat = () => {
		router.push(`/chat/${id}`);
	};

	const recipient = recipientSnapshot?.docs?.[0]?.data();
	const recipientEmail = getRecipientEmail(users, user);

	const filterEmail = recipientEmail.substring(
		0,
		recipientEmail.lastIndexOf('@')
	);

	return (
		<Container onClick={enterChat}>
			{recipient ? (
				<UserAvatar src={recipient?.photoURL} />
			) : (
				<UserAvatar>{recipientEmail[0]}</UserAvatar>
			)}

			<ContactEmail>{filterEmail}</ContactEmail>
		</Container>
	);
}

export default Chat;

const Container = styled.div`
	display: flex;
	width: 100%;
	align-items: center;
	cursor: pointer;
	padding: 15px;
	word-break: break-word;

	:hover {
		background-color: #e9eaeb;
	}
	@media (max-width: 768px) {
		justify-content: center;
	}
`;
const UserAvatar = styled(Avatar)`
	margin: 5px;
	margin-right: 15px;
`;

const ContactEmail = styled.p`
	@media screen and (max-width: 768px) {
		display: none;
	}
`;
