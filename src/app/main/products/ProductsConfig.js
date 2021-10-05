import { authRoles } from 'app/auth';
import React from 'react';

const ProductsConfig = {
	settings: {
		layout: {
			config: {
				mode: 'fullwidth',
				scroll: 'content',
				navbar: {
					display: true,
					folded: false,
					position: 'left'
				},
				toolbar: {
					display: true,
					style: 'fixed',
					position: 'below'
				},
				footer: {
					display: false,
					style: 'fixed',
					position: 'below'
				}
			}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/notas/:id',
			component: React.lazy(() => import('./show/Product'))
		},
		{
			path: '/notas',
			exact: true,
			component: React.lazy(() => import('./list/Products'))
		}
	]
};

export default ProductsConfig;
