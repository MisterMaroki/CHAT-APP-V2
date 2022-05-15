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
			block: 'center',
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

	const showWelcomeURL = messages.length < 2;
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
					<Avatar src={`https://api.multiavatar.com/${recipientEmail}.png`} />
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
				{!showWelcomeURL ? (
					''
				) : (
					<Box style={{ position: 'absolute', bottom: '0' }}>
						<Image height={250} alt="robot" width={250} src="/robot.gif" />
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
				<IconButton>
					<Mic />
				</IconButton>
			</InputContainer>
		</Container>
	);
}
export default ChatScreen;

const Container = styled.div`
	height: 100%;

	overflow: hidden;
	&&& {
		color: whitesmoke;
	}
`;

const MessageContainer = styled.div`
	padding: 20px;
	background: url(https://cdn.wallpapersafari.com/27/32/jt4AoG.jpg) fixed center;
	min-height: 95vh;
	width: 100%;
	display: flex;
	flex-direction: column;
	box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
		rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
	position: relative;
	&&& {
		:nth-last-child(-n + 1) {
			color: green;
		}
	}
	@media (max-width: 700px) {
		min-height: 85vh;
	}
`;

const Header = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	margin-left: 28vw;
	padding: 11px;
	padding-left: 4vw;
	z-index: 105;

	display: flex;
	height: 80px;
	width: 72vw;
	align-items: center;
	background-color: #4285f4;

	border-bottom: 1px solid whitesmoke;

	box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
		rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
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
	@media (max-width: 500px) {
		h3 {
			font-size: 0.8rem;
		}
		p {
			font-size: 12px;
		}
	}
`;

const Input = styled.input`
	/* flex-basis: 500px; */
	outline: 0;
	flex: 1;
	border: none;
	border-radius: 10px;
	background-color: whitesmoke;
	padding: 20px;
	margin: 0;
	margin-right: 15px;
	max-width: 50vw;
`;

const InputContainer = styled.form`
	display: flex;
	align-items: center;
	padding: 10px;
	position: fixed;
	bottom: 0;
	left: 0;
	padding-left: 32vw;
	background-color: #4285f4;
	z-index: 100;
	width: 100%;
	border-top: 1px solid whitesmoke;
	.SendButton {
		color: whitesmoke;
	}
	.flex {
		flex: 0.2;
	}
`;

const EndOfMessage = styled.div`
	height: 18vh;
	content: '';
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
