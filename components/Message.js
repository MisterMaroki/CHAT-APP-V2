import styled from 'styled-components';
function Message(key, user, message) {
	return (
		<Container>
			<p>{key.message.message}</p>
		</Container>
	);
}
export default Message;
const Container = styled.div``;
