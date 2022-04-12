import { Avatar, Button, IconButton } from '@material-ui/core';
import styled from 'styled-components';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import Chat from './Chat';
function Sidebar() {
	const [user] = useAuthState(auth);
	console.log(user.photoURL);
	const userChatRef = db
		.collection('chats')
		.where('users', 'array-contains', user.email);
	const [chatsSnapshot] = useCollection(userChatRef);

	const createNewChat = () => {
		const input = prompt(
			'Please enter an email address for the user you want to message'
		);

		if (!input) return;

		if (
			EmailValidator.validate(input) &&
			!chatAlreadyExists(input) &&
			input !== user.email
		) {
			//need to add chat into the db 'chats' collection if chat doesn't already exist
			db.collection('chats').add({
				users: [user.email, input],
			});
		}
	};

	const chatAlreadyExists = (recipientEmail) =>
		!!chatsSnapshot?.docs.find(
			(chat) =>
				chat.data().users.find((user) => user === recipientEmail)?.length > 0
		);

	return (
		<Container>
			<Header>
				<UserAvatar src={user?.photoURL} onClick={() => auth.signOut()} />
				<IconsContainer>
					<IconButton>
						<ChatIconn />
					</IconButton>
					<IconButton>
						<MoreVertIconn />
					</IconButton>
				</IconsContainer>
			</Header>
			<Search>
				<SearchIcon />
				<SearchInput placeholder="Search in chats" />
			</Search>
			<SidebarButton onClick={createNewChat}>
				{'Start a new chat'}
			</SidebarButton>

			{chatsSnapshot?.docs.map((chat) => (
				<Chat key={chat.id} id={chat.id} users={chat.data().users} />
			))}
		</Container>
	);
}

export default Sidebar;

const Container = styled.div`
	flex: 0.4;
	border-radius: 1px solid whitesmoke;
	height: 100vh;
	box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px,
		rgba(6, 24, 44, 0.65) 0px 4px 6px -1px,
		rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
	overflow-y: scroll;
	overflow-x: hidden;
	background-color: whitesmoke;
	&&& {
		color: black;
	}

	::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none;
	scrollbar-width: none;
	@media screen and (max-width: 770px) {
		min-width: none;
	}
`;

const Header = styled.div`
	display: flex;
	position: sticky;
	top: 0;
	z-index: 1;
	justify-content: space-between;
	align-items: center;
	padding: 15px;
	height: 80px;
	width: 100%;
	border-bottom: 1px solid whitesmoke;
	background-color: whitesmoke;
`;

const UserAvatar = styled(Avatar)`
	cursor: pointer;

	:hover {
		opacity: 0.8;
	}
`;

const Search = styled.div`
	display: flex;
	align-items: center;
	padding: 20px;
	border-radius: 2px;
	width: 100%;
	@media (max-width: 568px) {
		padding: 5px;
	}
`;

const SearchInput = styled.input`
	outline: none;
	border: none;
	flex: 1;
	background-color: transparent;
	@media (max-width: 568px) {
		font-size: 0.6rem;
	}
`;

const IconsContainer = styled.div`
	flex: 1;
	display: flex;
	justify-content: flex-end;
	color: black;

	@media (max-width: 768px) {
		flex-direction: column;
		align-items: flex-end;
	}
`;

const SidebarButton = styled(Button)`
	&&& {
		color: black;
		width: 100%;
		border-top: 1px solid whitesmoke;
		border-bottom: 1px solid whitesmoke;
		@media (max-width: 768px) {
			padding-right: 0;
			font-size: 0.7rem;
			font-weight: bold;
		}
	}
`;
const ChatIconn = styled(ChatIcon)`
	color: darkgray;
`;
const MoreVertIconn = styled(MoreVertIcon)`
	color: darkgray;
`;
