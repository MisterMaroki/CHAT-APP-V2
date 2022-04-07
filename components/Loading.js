import { Circle } from 'better-react-spinkit';
import styled from 'styled-components';
function Loading() {
	return (
		<center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
			<div>
				<Image
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png"
					alt="Logo"
					style={{ marginBottom: 10 }}
					height={200}
				/>
				<Circle color="#3cbc28" size={60} />
			</div>
		</center>
	);
}

export default Loading;
const Image = styled.img``;
