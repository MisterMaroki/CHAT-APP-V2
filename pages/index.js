import Head from 'next/head';
import Sidebar from '../components/Sidebar';

export default function Home() {
	return (
		<div>
			<Head>
				<title>Snappy-v2</title>
				<link rel="icon" href="/logo.ico" />
			</Head>
			<Sidebar />
		</div>
	);
}
