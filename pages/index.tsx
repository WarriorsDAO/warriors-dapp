/* eslint-disable import/no-unresolved */
import React from 'react';
import Box from '@/components/Box';

const Home = (): JSX.Element => {
	return <Box>Home</Box>;
};

export default Home;

Home.getInitialProps = (ctx) => {
	ctx?.res?.writeHead(301, {
		Location: '/onboarding',
	});
	ctx?.res?.end();

	return {};
};
