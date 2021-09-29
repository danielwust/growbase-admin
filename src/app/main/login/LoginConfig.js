import React from 'react';
import { authRoles } from 'app/auth';

const LoginConfig = {
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
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: '/login',
			component: React.lazy(() => import('./Login'))
		}
	]
};

export default LoginConfig;
