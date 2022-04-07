import Head from 'next/head';
import Image from 'next/image';
import Sidebar from '../components/Sidebar';

export default function Home() {
	return (
		<div>
			<Head>
				<title>Whatsapp-v2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Sidebar />
		</div>
	);
}
