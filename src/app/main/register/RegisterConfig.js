import React from 'react';

const RegisterConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/register',
			component: React.lazy(() => import('./Register'))
		}
	]
};

export default RegisterConfig;
