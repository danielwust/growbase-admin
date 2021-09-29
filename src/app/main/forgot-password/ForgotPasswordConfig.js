import React from 'react';

const ForgotPasswordConfig = {
	settings: {
		layout: {
			config: {
				mode: 'fullwidth',
				scroll: 'content',
				navbar: {
					display: false,
					folded: false,
					position: 'left'
				},
				toolbar: {
					display: false,
					style: 'fixed',
					position: 'below'
				},
				footer: {
					display: false,
					style: 'fixed',
					position: 'below'
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	routes: [
		{
			path: '/forgot-password',
			component: React.lazy(() => import('./ForgotPassword'))
		}
	]
};

export default ForgotPasswordConfig;
