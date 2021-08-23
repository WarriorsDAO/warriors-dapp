/* eslint-disable import/no-unresolved */
import { IRegistry } from '@/containers/Warrior/types';
import getAssetIds, { IAssets } from '@/ethereum/utils/getAssetIds';
import { IPFS_FALLBACK_URL, IPFS_URL } from '@/utils/constants';
import React, { useContext, useState, useEffect } from 'react';
import Box, { BoxProps } from './Box';
import { StatesContext } from './StatesContext';

interface Props extends BoxProps {
	warriorId: string;
	registry: IRegistry;
}

const Warrior = ({ warriorId, registry }: Props) => {
	const state = useContext(StatesContext);
	const [assets, setAssets] = useState<IAssets>();
	const [urls, setUrls] = useState([]);

	useEffect(() => {
		const getAssets = async () => {
			const assetIds = await getAssetIds(state?.warriorCore, warriorId?.toString(), registry);
			setAssets(assetIds);
		};
		if (state?.warriorCore && warriorId) {
			getAssets();
		}
	}, [state?.warriorCore, warriorId]);

	useEffect(() => {
		if (assets) {
			const results = [];
			for (const k in assets) {
				const cid = registry[k][assets[k]]?.cid;
				results.push(`${IPFS_URL}${cid}`);
			}
			setUrls(results);
		}
	}, [assets]);

	return (
		<Box fontSize="1rem" height="50%" width="100%" display="flex" justifyContent="center">
			<Box
				as="img"
				className="asset-img"
				src={urls?.[0]}
				onError={(e) => (e.target.src = `${IPFS_FALLBACK_URL}${urls?.[0].split('ipfs/')[1]}`)}
				position="absolute"
				height="95%"
			/>
			<Box
				as="img"
				className="asset-img"
				src={urls?.[1]}
				onError={(e) => (e.target.src = `${IPFS_FALLBACK_URL}${urls?.[1].split('ipfs/')[1]}`)}
				position="absolute"
				height="95%"
			/>
			<Box
				as="img"
				className="asset-img"
				src={urls?.[2]}
				onError={(e) => (e.target.src = `${IPFS_FALLBACK_URL}${urls?.[2].split('ipfs/')[1]}`)}
				position="absolute"
				height="95%"
			/>
			<Box
				as="img"
				className="asset-img"
				src={urls?.[3]}
				onError={(e) => (e.target.src = `${IPFS_FALLBACK_URL}${urls?.[3].split('ipfs/')[1]}`)}
				position="absolute"
				height="95%"
			/>
			<Box
				as="img"
				className="asset-img"
				src={urls?.[4]}
				onError={(e) => (e.target.src = `${IPFS_FALLBACK_URL}${urls?.[4].split('ipfs/')[1]}`)}
				position="absolute"
				height="95%"
			/>
			<Box
				as="img"
				className="asset-img"
				src={urls?.[5]}
				onError={(e) => (e.target.src = `${IPFS_FALLBACK_URL}${urls?.[5].split('ipfs/')[1]}`)}
				position="absolute"
				height="95%"
			/>
		</Box>
	);
};
export default Warrior;
