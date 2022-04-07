import { Avatar, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { MoreVert, AttachFile, InsertEmoticon, Mic } from '@material-ui/icons';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';
import { useState } from 'react';
import firebase from 'firebase/compat/app';
import getRecipientEmail from '../utils/getRecipientEmail';

function ChatScreen({ chat, messages }) {
	const [user] = useAuthState(auth);
	const [input, setInput] = useState('');
	const router = useRouter();
	const [messagesSnapshot] = useCollection(
		db
			.collection('chats')
			.doc(router.query.id)
			.collection('messages')
			.orderBy('timestamp', 'asc')
	);
	const showMessages = () => {
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
	};

	const recipientEmail = getRecipientEmail(chat.users, user);

	return (
		<Container>
			<Header>
				<Avatar />
				<HeaderInformation>
					<h3>{recipientEmail}</h3>
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

			<MessageContainer>
				{showMessages()}
				<EndOfMessage />
			</MessageContainer>

			<InputContainer>
				<InsertEmoticon />
				<Input value={input} onChange={(e) => setInput(e.target.value)} />
				<button hidden disabled={!input} type="submit" onClick={sendMessage}>
					Send Message
				</button>
				<Mic />
			</InputContainer>
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

const Input = styled.input`
	flex: 1;
	outline: 0;
	border: none;
	border-radius: 10px;
	background-color: whitesmoke;
	padding: 20px;
	margin-left: 15px;
	margin-right: 15px;
`;

const InputContainer = styled.form`
	display: flex;
	align-items: center;
	padding: 10px;
	position: sticky;
	bottom: 0;
	background-color: white;
	z-index: 100;
`;

const EndOfMessage = styled.div``;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
	padding: 30px;
	background-color: #e5ded8;
	min-height: 90vh;
`;
