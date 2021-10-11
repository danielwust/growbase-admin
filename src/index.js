// Internet Explorer 11 requires polyfills and partially supported by this project.
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-muli';
import './i18n';
import './react-chartjs-2-defaults';
import './styles/index.css';
import App from 'app/App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import makeServer from './@server/mirage-server';

if (process.env.NODE_ENV === 'mirage') { // saporra de Node_Env sempre enviando development
	makeServer({ environment: 'development' });
}

ReactDOM.render(<App />, document.getElementById('root'));

reportWebVitals();
serviceWorker.unregister();
