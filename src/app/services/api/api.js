import FuseUtils from '@fuse/utils/FuseUtils';
import JwtService from '../jwtService';
import axios from 'axios';
/* eslint-disable camelcase */

class Api extends FuseUtils.EventEmitter {
	init() {
		this.setBaseUrl();
		JwtService.setInterceptors();
		JwtService.handleAuthentication();
	}

	setBaseUrl = () => {
		axios.defaults.baseURL = process.env.REACT_APP_API_URL
			? process.env.REACT_APP_API_URL
			: 'http://localhost:8080/api';
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			axios.post('/usuarios', data).then(res => {
				console.log(res);
				if (res.data) {
					JwtService.setSession(res.data.token, res.data.uid);
					resolve(res.data);
				} else {
					reject(res.data.error);
				}
			});
		});
	};

	doGet = async url => {
		try {
			const res = await axios(url);

			if (res.status === 200) {
				res.data.success = true;
			} else {
				res.data.success = false;
			}
			return res.data;
		} catch (error) {
			return { data: error.res.data, status: error.res.status };
		}
	};

	doPost = async (url, data) => {
		try {
			const res = await axios.post(url, data);

			if (res.status === 200) {
				res.data.success = true;
			} else {
				res.data.success = false;
			}
			return res.data;
		} catch (error) {
			return { data: error.res.data, status: error.res.status };
		}
	};

	doPut = async (url, data) => {
		try {
			const res = await axios.put(url, data);

			if (res.status === 200) {
				res.data.success = true;
			} else {
				res.data.success = false;
			}
			return res.data;
		} catch (error) {
			return { data: error.res.data, status: error.res.status };
		}
	};

	doFile = async (url, data) => {
		try {
			await axios.post(url, data, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			return;
		} catch (error) {
			return;
		}
	};

	doDelete = async url => {
		try {
			const res = await axios.delete(url);

			if (res.status === 204 || res.status === 200) {
				res.data.success = true;
			} else {
				res.data.success = false;
			}
			return res.data;
		} catch (error) {
			return { data: error.res.data, status: error.res.status };
		}
	};

	updateUserData = user => {
		return axios.put(`/users/${user.uid}`, {
			user
		});
	};
}

const instance = new Api();

export default instance;
