import { Avatar, Box, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import {
	MoreVert,
	AttachFile,
	InsertEmoticon,
	Mic,
	Send,
} from '@material-ui/icons';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';
import { useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';
import Image from 'next/image';

function ChatScreen({ chat, messages }) {
	const [user] = useAuthState(auth);
	const [input, setInput] = useState('');
	const endOfMessagesRef = useRef(null);
	const router = useRouter();
	const [messagesSnapshot] = useCollection(
		db
			.collection('chats')
			.doc(router.query.id)
			.collection('messages')
			.orderBy('timestamp', 'asc')
	);

	const [recipientSnapshot] = useCollection(
		db
			.collection('users')
			.where('email', '==', getRecipientEmail(chat.users, user))
	);
	const scrollToBottom = () => {
		endOfMessagesRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};
	const showMessages = () => {
		scrollToBottom();
		if (messagesSnapshot) {
			return messagesSnapshot.docs.map((message) => (
				<Message
					key={message.id}
					user={message.data().user}
					message={{
						...message.data(),
						timestamp: message.data().timestamp?.toDate().getTime(),
					}}
				/>
			));
		} else {
			return JSON.parse(messages).map((message) => (
				<Message key={message.id} user={message.user} message={message} />
			));
		}
	};

	const showWelcomeURL = messages.length > 2;
	console.log(showWelcomeURL);
	const sendMessage = (e) => {
		e.preventDefault();
		db.collection('users')
			.doc(user.id)
			.set(
				{ lastSeen: firebase.firestore.FieldValue.serverTimestamp() },
				{ merge: true }
			);

		db.collection('chats').doc(router.query.id).collection('messages').add({
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			message: input,
			user: user.email,
			photoURL: user.photoURL,
		});

		setInput('');
		scrollToBottom();
	};
	const recipient = recipientSnapshot?.docs?.[0]?.data();
	const recipientEmail = getRecipientEmail(chat.users, user);

	return (
		<Container>
			<Header>
				{recipient ? (
					<Avatar src={recipient?.photoURL} />
				) : (
					<Avatar src={recipientEmail[0]} />
				)}
				<HeaderInformation>
					<h3>{recipientEmail}</h3>
					{recipientSnapshot ? (
						<p>
							Last seen: {''}
							{recipient?.lastSeen?.toDate() ? (
								<TimeAgo datetime={recipient?.lastSeen?.toDate()} />
							) : (
								'Unavailable'
							)}
						</p>
					) : (
						<p>Loading last active...</p>
					)}
				</HeaderInformation>
				<HeaderIcons>
					<IconButton>
						<AttachFilee />
					</IconButton>
					<IconButton>
						<MoreVertt />
					</IconButton>
				</HeaderIcons>
			</Header>

			<MessageContainer>
				{showMessages()}
				{showWelcomeURL ? (
					''
				) : (
					<Box style={{ position: 'absolute', bottom: '0' }}>
						<Image height={250} width={250} src="/robot.gif" />
					</Box>
				)}
				<EndOfMessage ref={endOfMessagesRef} />
			</MessageContainer>

			<InputContainer>
				<Input value={input} onChange={(e) => setInput(e.target.value)} />
				<IconButton
					hidden={!input}
					disabled={!input}
					type="submit"
					onClick={sendMessage}
					className="SendButton"
				>
					<Send />
				</IconButton>
				<Mic />
			</InputContainer>
		</Container>
	);
}
export default ChatScreen;

const Container = styled.div`
	flex: 3;
	&&& {
		color: whitesmoke;
	}
`;

const Header = styled.div`
	position: sticky;

	z-index: 100;
	top: 0;
	display: flex;
	padding: 11px;
	height: 80px;
	width: 100%;
	align-items: center;
	border-bottom: 1px solid whitesmoke;
	background-color: #134444;
`;

const HeaderInformation = styled.div`
	margin-left: 15px;
	flex: 1;
	color: whitesmoke;

	h3 {
		margin-bottom: -10px;
	}
	p {
		font-size: 14px;
		color: lightgray;
	}
`;

const Input = styled.input`
	flex: 1;
	outline: 0;
	border: none;
	border-radius: 10px;
	background-color: whitesmoke;
	padding: 20px;
	margin: 0;
	margin-left: 15px;
	margin-right: 15px;
`;

const InputContainer = styled.form`
	display: flex;
	align-items: center;
	padding: 10px;
	position: sticky;
	bottom: 0;
	background-color: #134444;
	z-index: 100;
	border-top: 1px solid whitesmoke;
	.SendButton {
		color: whitesmoke;
	}
`;

const EndOfMessage = styled.div`
	padding-bottom: 60px;
`;

const HeaderIcons = styled.div`
	position: absolute;
	right: 0;

	@media (max-width: 600px) {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
`;

const AttachFilee = styled(AttachFile)`
	color: whitesmoke;
`;

const MoreVertt = styled(MoreVert)`
	color: whitesmoke;
`;

const MessageContainer = styled.div`
	padding: 20px;
	background-color: #134444;
	min-height: 95vh;
	width: 100%;
	display: flex;
	flex-direction: column;

	position: relative;
`;
