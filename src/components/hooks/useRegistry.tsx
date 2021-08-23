/* eslint-disable import/no-unresolved */
import { useState } from 'react';
import { IRegistry } from '../../containers/Warrior/types';
import { getAssetRegistry } from '@/api/queries';
import { useQuery } from 'react-query';

const useRegistry = () => {
	const [registry, setRegistry] = useState<IRegistry>();

	useQuery('registry-fetch', getAssetRegistry, {
		enabled: true,
		onSuccess: (result) => {
			let key;
			for (const k in result) {
				key = k;
				break;
			}
			const res = JSON.parse(key);
			setRegistry(res);
		},
		onError: (error: any) => {
			console.log({ error });
		},
	});

	return registry;
};

export default useRegistry;
