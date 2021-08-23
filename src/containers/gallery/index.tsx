/* eslint-disable import/no-unresolved */
import Box from '@/components/Box';
import Warrior from '@/components/Warrior';
import React, { useContext, useEffect, useState } from 'react';
import queryEvents from '../../ethereum/utils/queryEvents';
import { StatesContext } from '@/components/StatesContext';
import Text from '@/components/Text';
import useRegistry from '@/components/hooks/useRegistry';
import ReactTooltip from 'react-tooltip';

const AllWarrior = (): JSX.Element => {
	const state = useContext(StatesContext);
	const [warriors, setWarriors] = useState([]);
	const registry = useRegistry();
	useEffect(() => {
		if (process.browser) {
			window.addEventListener('onload', () => {
				const block = document.getElementById('content');
				if (block) {
					block.style.display = 'flex';
				}
			});
		}
	}, []);

	useEffect(() => {
		const getWarrior = async () => {
			const array = [];
			const warrior = await getAllWarriors();

			Object.values(warrior).forEach((c) => {
				return array.push({ id: parseInt(c[1]._hex).toString(), address: c[0] });
			});
			setWarriors(array);
		};
		if (state.warriorCore) {
			getWarrior();
		}
		console.log(registry);
	}, [state?.warriorCore]);

	const getAllWarriors = async () => {
		const data = await queryEvents(state.warriorCore, 'WarriorGenerated');
		return data;
	};

	if (warriors.length <= 0) return <Box>Loading...</Box>;

	return (
		<Box bg="pink" display="flex" id="content" center column maxWidth="100vw">
			<Text
				fontSize={{ mobS: '5rem', mobL: '8rem', tabL: '15rem' }}
				fontWeight="bold"
				mb={{ mobS: 'mm', mobL: 'ml', tabS: 'wm' }}
				pb={{ mobS: 'mxl', mobL: 'wm', tabS: 'wxl' }}
				pt={{ mobS: 'mxl', mobL: 'wxs', tabS: 'wl' }}
				bg="purple-10"
				color="white"
				px={{ mobS: 'ws', mobL: 'ws', tabS: '20rem' }}
				width="100%"
			>
				Gallery
			</Text>
			<Box
				display="flex"
				flexWrap="wrap"
				mx={{ mobS: 'ms', tabL: '16rem', webM: '20rem' }}
				maxWidth="100%"
				justifyContent="center"
			>
				{warriors?.map((warrior) => (
					<Box
						key={warrior.id}
						bg="white"
						width={{ mobS: '25rem', tabL: '30rem' }}
						height={{ mobS: '25rem', tabL: '30rem' }}
						borderRadius="4px"
						position="relative"
						boxShadow="0 0 2px rgba(0,0,0,0.8)"
						mx="ms"
						my="ms"
					>
						<Box>
							<Warrior warriorId={warrior.id} registry={registry} />
							<Box position="absolute" right="ml">
								<Text>#{warrior.id}</Text>
							</Box>
							<Box
								position="relative"
								top={{ mobS: '23.7rem', tabL: '28.5rem' }}
								center
								data-tip
								data-for="registerTip"
							>
								<Text fontSize={{ mobs: '0.75rem', deskM: '0.75rem' }} fontWeight="extra-bold">
									{warrior.address}
								</Text>
								<ReactTooltip id="registerTip" place="top" effect="solid">
									Creator Address
								</ReactTooltip>
							</Box>
						</Box>
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default AllWarrior;
