import React from 'react';

const MailConfirmConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/mail-confirm',
			component: React.lazy(() => import('./MailConfirm'))
		}
	]
};

export default MailConfirmConfig;
