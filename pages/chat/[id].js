import Head from 'next/head';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import ChatScreen from '../../components/ChatScreen';
import Sidebar from '../../components/Sidebar';
import { auth, db } from '../../firebase';
import getRecipientEmail from '../../utils/getRecipientEmail';

function Chat({ chat, messages }) {
	const [user] = useAuthState(auth);

	return (
		<Container>
			<Head>
				<title>Chat with {getRecipientEmail(chat.users, user)}</title>
			</Head>

			<Sidebar />
			<ChatContainer>
				<ChatScreen chat={chat} messages={messages} />
			</ChatContainer>
		</Container>
	);
}

export default Chat;

const Container = styled.div`
	display: flex;
	width: 100%;
	overflow: hidden;
`;

const ChatContainer = styled.div`
	flex: 1;
	overflow-y: scroll;
	height: 100vh;

	::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none;
	scrollbar-width: none;
`;
export async function getServerSideProps(context) {
	const ref = db.collection('chats').doc(context.query.id);

	//PREP the mesages on the server
	const messagesRes = await ref
		.collection('messages')
		.orderBy('timestamp', 'asc')
		.get();

	const messages = messagesRes.docs
		.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))
		.map((messages) => ({
			...messages,
			timestamp: messages.timestamp.toDate().getTime(),
		}));

	///PREP the chats
	const chatRes = await ref.get();
	const chat = {
		id: chatRes.id,
		...chatRes.data(),
	};
	// console.log(chat, messages);

	return {
		props: {
			messages: JSON.stringify(messages),
			chat: chat,
		},
	};
}
