import React from 'react';

import { authRoles } from 'app/auth';
import i18next from 'i18next';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'home', en);
i18next.addResourceBundle('tr', 'home', tr);
i18next.addResourceBundle('ar', 'home', ar);

const HomeConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/home',
			component: React.lazy(() => import('./Home'))
		}
	]
};

export default HomeConfig;

/**
 * Lazy load Example
 */
/*
import React from 'react';

const HomeConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/example',
            component: React.lazy(() => import('./Example'))
        }
    ]
};

export default HomeConfig;

*/
