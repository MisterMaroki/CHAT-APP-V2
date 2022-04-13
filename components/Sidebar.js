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
			<IconsContainerr>
				<Search>
					<SearchIcon />
					<SearchInput placeholder="Search in chats" />
				</Search>
				<SidebarButton onClick={createNewChat}>{'New chat'}</SidebarButton>
			</IconsContainerr>

			{chatsSnapshot?.docs.map((chat) => (
				<Chat key={chat.id} id={chat.id} users={chat.data().users} />
			))}
		</Container>
	);
}

export default Sidebar;

const Container = styled.div`
	position: fixed;
	flex: 0.4;
	width: 30vw;
	border-radius: 1px solid whitesmoke;
	height: 100%;
	overflow-x: hidden;
	touch-action: cross-slide-y;
	background-color: whitesmoke;
	padding-top: 20vh;
	&&& {
		color: black;
	}

	::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none;
	scrollbar-width: none;
	min-width: 4vw;
	z-index: 200;
`;

const Header = styled.div`
	display: flex;
	position: fixed;
	top: 0;
	z-index: 1000;
	justify-content: space-between;
	align-items: center;
	padding: 15px;
	height: 80px;
	width: 30vw;
	border-bottom: 1px solid whitesmoke;
	background-color: whitesmoke;

	@media (max-width: 500px) {
		padding: 5px;
	}
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
		padding: 15px;
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
const IconsContainerr = styled(IconsContainer)`
	position: fixed;
	width: 30vw;
	top: 65px;
	left: 0;
	z-index: 200;
	background: whitesmoke;
	justify-content: center;

	flex-direction: column;
	align-items: center;
`;

const SidebarButton = styled(Button)`
	&&& {
		color: black;
		width: 100%;
		margin: 0 auto;
		border-radius: 0;
		border-top: 1px solid whitesmoke;
		border-bottom: 1px solid whitesmoke;
		@media (max-width: 768px) {
			padding-inline: 0;
			font-size: 0.7rem;
			font-weight: bold;
		}
		min-width: 100px;
	}
`;
const ChatIconn = styled(ChatIcon)`
	color: darkgray;
`;
const MoreVertIconn = styled(MoreVertIcon)`
	color: darkgray;
`;
