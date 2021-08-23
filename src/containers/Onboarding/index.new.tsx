/* eslint-disable import/no-unresolved */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Confetti from 'react-confetti';
import { ethers } from 'ethers';

import Box from '@/components/Box';
import Text from '@/components/Text';
import theme from '@/styleguide/theme';
import generateWarrior from '@/ethereum/utils/generateWarrior';
import { StatesContext } from '@/components/StatesContext';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import If from '@/components/If';
import Warrior from '@/components/Warrior';
import useRegistry from '@/components/hooks/useRegistry';
import { rotate } from './animation';

import LoopIcon from '@/svgs/loop.svg';
import CloseIcon from '@/svgs/close.svg';

import 'react-toastify/dist/ReactToastify.css';

const OnboardingComp = (): JSX.Element => {
	const [text, setText] = useState<string>('');
	const [success, setSuccess] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [warriorId, setWarriorId] = useState<string>();
	const [warrior, setWarrior] = useState<boolean>(false);
	const registry = useRegistry();
	const { signer, warriorCore } = useContext(StatesContext);
	const [height, setHeight] = useState(null);
	const [width, setWidth] = useState(null);
	const [show, setShow] = useState<boolean>(false);

	const getError = async (code) => {
		if (code == 4001) return 'Proccess ended unacceptably. Please try again';
		if (code == 'INVALID_ARGUMENT') return 'Please unlock your MetaMask';
		if (code == 'UNPREDICTABLE_GAS_LIMIT') return 'Metadata already used';
	};

	useEffect(() => {
		if (loading) rotate('#loops');
	}, [loading]);

	useEffect(() => {
		if (process.browser) {
			setWidth(screen.availWidth - 10);
			setHeight(screen.availHeight - 100);
		}
	}, [success]);

	const handleWarriorGenerate = async (e) => {
		e.preventDefault();
		if (text.length !== 0) {
			setLoading(true);
			// @ts-expect-error signer-props
			const address = await signer?.getAddress();
			const metadata = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(text.concat(address)));
			try {
				const id = await generateWarrior(warriorCore, signer, metadata);
				setWarriorId(id.toString());
				setLoading(false);
				setSuccess(true);
				setWarriorId(id.toString());
				setWarrior(true);
				setShow(true);
			} catch (err) {
				const error = await getError(err.code);
				toast.error(error);
				setLoading(false);
			}
		}
	};

	const handleViewWarrior = () => {
		setWarrior(true);
	};

	const handleCloseWarrior = () => {
		setWarrior(false);
		setShow(false);
		setWidth(null);
		setHeight(null);
	};

	const draw = async (ctx, imgs) => {
		ctx.fillStyle = 'rgb(256, 256, 0)';
		ctx.fillRect(0, 0, 1000, 1400);
		ctx.font = '30px Comic Sans black';
		ctx.fillStyle = 'black';
		ctx.fillText(`#${warriorId}`, 500, 1300);
		for (let i = 0; i < imgs.length; i++) {
			imgs[i].crossOrigin = 'anonymous';
			imgs[i].onload = async () => {
				await ctx.drawImage(imgs[i], 40, 40, 950, 1200);
			};
		}
	};

	const download = (e) => {
		e.preventDefault();
		rotate('#loop');

		if (process.browser) {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.height = 1400;
			canvas.width = 1000;
			const imgs = document.getElementsByClassName('asset-img');

			draw(ctx, imgs).then(() => {
				setTimeout(() => {
					const link = document.getElementById('download');
					link.setAttribute('download', `Warrior #${warriorId}.png`);
					const imageLink = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
					link.setAttribute('href', imageLink);
					link.style.display = 'block';
					e.target.style.display = 'none';
				}, 1500);
			});
		}
	};

	return (
		<Box height="100vh" center bg="purple-10">
			<Box
				height={{ mobS: '100%', tabS: 'auto' }}
				color="black"
				maxWidth={{ mobS: '100%', tabS: '42rem' }}
				bg="white"
				borderRadius={{ mobS: '0', tabS: '10px' }}
				overflow="hidden"
				pb="0"
				backgroundImage={`linear-gradient(-145deg, ${theme.colors['green-100']} 1%, ${theme.colors['purple-50']} 100%);`}
			>
				<Box pt="wm" px="mxxl" pb="wxxl">
					<Text as="h1" fontWeight="bold">
						Generate Warrior
					</Text>
					<Text as="h4" fontWeight="regular">
						Describe your victory over this pandemic in a few lines.
					</Text>
				</Box>
				<Box
					bg="white"
					mt={`-${theme.space.wl}`}
					borderTopLeftRadius="30px"
					borderTopRightRadius="5px"
					borderBottomLeftRadius="5px"
					borderBottomRightRadius="30px"
					px="mxxl"
					py="wxxs"
					mx="mxs"
					mb="wl"
				>
					<Text as="h3" fontWeight="medium" mb="ms">
						Your Warrior Story
					</Text>
					<Box
						as="textarea"
						placeholder="Type here..."
						css={`
							resize: none;
						`}
						height="15rem"
						width="100%"
						fontFamily="inherit"
						fontSize="1.6rem"
						outline="none"
						borderRadius="8px"
						px="mxs"
						py="mxs"
						mb="ms"
						border="2px solid grey"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<Box
						as="button"
						className="get-btn"
						row
						center
						height="5rem"
						width="100%"
						bg={loading ? 'gray-100' : success ? 'green' : 'orange-50'}
						fontFamily="inherit"
						mb="ml"
						color="white"
						border="none"
						borderRadius="7px"
						onClick={success ? handleViewWarrior : handleWarriorGenerate}
						cursor="pointer"
					>
						<Text as="h4">{loading ? 'Fetching' : success ? `View Warrior` : 'Get Warrior'}</Text>
						<If
							condition={loading}
							then={
								<Box id="loops" center ml="mxs" mt="mxxs">
									<LoopIcon height="2.2rem" />
								</Box>
							}
						/>
					</Box>
				</Box>
			</Box>
			<If
				condition={warrior == true}
				then={
					<Box center position="absolute" height="100vh" width="100vw" bg="#000000a0">
						<Box
							minHeight={{ mobS: '40vh', deskM: '80vh', tabS: '60vh', mobL: '60vh', tabL: '50vh' }}
							width={{ mobS: '80vw', deskM: '40vw' }}
							borderRadius="8px"
							bg="white"
							opacity="1"
							overflow="hidden"
							pb="mm"
							alignItems="center"
							column
						>
							<Confetti run={show} recycle={false} width={width} height={height} numberOfPieces={1000} />
							<Box
								display="flex"
								justifyContent="space-between"
								px="mm"
								py="ms"
								borderBottom="1px solid grey"
								bg="gray-100"
								width="100%"
							>
								<Text id="warrior-id">Warrior #{warriorId}</Text>
								<CloseIcon height="30px" cursor="pointer" onClick={handleCloseWarrior} />
							</Box>
							<Box
								display="flex"
								justifyContent="center"
								width="50%"
								height={{ mobS: '20rem', mobL: '27rem', tabS: '50rem', tabL: '60rem' }}
								position="relative"
							>
								<Warrior warriorId={warriorId} registry={registry} />
							</Box>
							<Box width="100%" center>
								<Box
									as="button"
									bg="purple-100"
									border="none"
									py="ms"
									px="mxs"
									borderRadius="4px"
									fontFamily="inherit"
									color="white"
									cursor="pointer"
									onClick={download}
									between
								>
									Save your Warrior
									<Box display="none" id="loop" center ml="mxxs">
										<LoopIcon height="2.4rem" />
									</Box>
								</Box>
								<Box as="a" id="download" display="none" fontFamily="inherit" fontSize="1.6rem">
									<SaveAltIcon />
									Click to Download
								</Box>
							</Box>
						</Box>
					</Box>
				}
			/>
			<ToastContainer style={{ fontSize: '14px', fontFamily: 'Nunito Sans' }} />
		</Box>
	);
};

export default OnboardingComp;
