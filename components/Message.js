import moment from 'moment';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth } from '../firebase';

function Message(key) {
	const message = key.message;
	const [userLoggedIn] = useAuthState(auth);

	const TypeOfMessage = message.user === userLoggedIn.email ? Sender : Receiver;

	return (
		<Container>
			<TypeOfMessage>
				{message.message}
				<Timestamp>
					{message.timestamp ? moment(message.timestamp).format('LT') : '...'}
				</Timestamp>
			</TypeOfMessage>
		</Container>
	);
}
export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
	width: fit-content;
	padding: 15px;
	border-radius: 8px;
	margin: 10px;
	min-width: 70px;
	padding-bottom: 26px;
	position: relative;
	text-align: right;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
	/* box-shadow: rgba(17, 12, 46, 0.15) 0px 14px 10px 0px; */
`;

const Sender = styled(MessageElement)`
	margin-left: auto;
	background-color: #4285f4;
`;

const Receiver = styled(MessageElement)`
	background-color: whitesmoke;
	color: #2462c0;
	text-align: left;
`;

const Timestamp = styled.span`
	padding: 10px;
	font-size: 9px;
	position: absolute;
	bottom: 0;
	text-align: right;
	right: 0;
`;
