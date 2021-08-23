/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { ThemeProvider } from 'styled-components';
import theme from '@/styleguide/theme';
import '../styles/globalStyles.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import useEthers from '@/ethereum/useEthers';
import useContract from '@/ethereum/useContract';
import useSigner from '@/ethereum/useSigner';
import chains from '@/ethereum/utils/chains';
import contracts from '@/ethereum/utils/contracts';
import useListeners from '@/ethereum/useListeners';
import generateWarrior from '@/ethereum/utils/generateWarrior';
import queryEvents from '../src/ethereum/utils/queryEvents';
import { StatesProvider } from '@/components/StatesContext';

const queryClient = new QueryClient();

// This default export is required in a new `pages/_app.js` file.
const MyApp = ({ Component, pageProps }) => {
	useEffect(() => {
		// Set a custom CSS Property for Height
		// See https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

		// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
		if (process.browser) {
			const vh = window.innerHeight * 0.01;
			// Then we set the value in the --vh custom property to the root of the document
			document.documentElement.style.setProperty('--vh', `${vh}px`);

			const handleResize = debounce(() => {
				// We execute the same script as before
				const vh = window.innerHeight * 0.01;
				document.documentElement.style.setProperty('--vh', `${vh}px`);
			}, 150);

			window.addEventListener('resize', handleResize);
			return () => {
				if (process.browser) {
					window.removeEventListener('resize', handleResize);
				}
			};
		}
	});

	// this should be on the topmost element
	// starting from here
	const [provider, setProvider, ethers] = useEthers();
	const [signer, setSigner] = useSigner(provider);
	const [address, setAddress] = useState();
	const [chainName, setChainName] = useState();
	const warriorCore = useContract(contracts.warrior, provider);

	useListeners(provider, setProvider, setSigner);

	useEffect(() => {
		if (signer?.provider) {
			const getAddress = async () => {
				setAddress(await signer.getAddress());
				setChainName(chains[signer.provider.provider.chainId.toString()]);
			};
			getAddress();
		}
	}, [signer]);

	useEffect(() => {
		if (warriorCore?.address && address) {
			getCurrentGen();
		}
	}, [address, warriorCore]);

	// get all the warriors which were minted
	const getAllWarriors = async () => {
		const data = await queryEvents(warriorCore, 'WarriorGenerated');
		console.log('All Warriors', data);
	};

	// get the warriors that this person created
	const getUserHolding = async (address) => {
		const data = await queryEvents(warriorCore, 'WarriorGenerated', [address]);
		console.log('User warriors', data);
	};

	// Not yet live on rinkeby
	// const getAllAssets = async () => {
	// 	const data = await queryEvents(warriorCore, "AssetsRegistered");
	// 	console.log("All Assets", data);
	// }

	useEffect(() => {
		if (warriorCore?.address && address) {
			// getUserHolding(address);
			// getAllWarriors();
			// getAllAssets();
		}
	}, [warriorCore, address]);

	const getCurrentGen = async () => {
		const currentGen = (await warriorCore?.currentGeneration())?.toString();
		const currentGenMax = (await warriorCore?.currentGenerationMaxPopulation())?.toString();
		const currentPopulation = (await warriorCore?.currentGenerationPopulation())?.toString();
		const maxPopulation = (await warriorCore?.maxPopulation())?.toString();
		const header = `Few details on warriors:-\n`;
		const line1 = `Current Generation: ${currentGen}\n`;
		const line2 = `Current Generation Population: ${currentPopulation}\n`;
		const line3 = `Current Generation Maximum Population: ${currentGenMax}\n`;
		const line4 = `Max Population: ${maxPopulation}`;
		alert(`${header}${line1}${line2}${line3}${line4}`);
	};

	return (
		<StatesProvider provider={provider} signer={signer} warriorCore={warriorCore}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<Component {...pageProps} />
				</ThemeProvider>
			</QueryClientProvider>
		</StatesProvider>
	);
};

export default MyApp;
