import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			response => response,
			err => {
				return new Promise((res, rej) => {
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						this.emit('onAutoLogout', 'Token Invalido');
						this.setSession(null, null);
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();
		const user_access = this.getUserAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(access_token, user_access)) {
			this.setSession(access_token, user_access);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null, null);
			this.emit('onAutoLogout', 'Sessão Expirada');
			// this.emit('onAutoLogout', 'access_token expired');
		}
	};

	signInWithEmailAndPassword = (email, password) => {
		return new Promise((resolve, reject) => {
			axios
				.get('/login', {
					data: {
						usuario: email,
						senha: password
					}
				})
				.then(res => {
					console.log(res.data);
					if (res.data) {
						this.setSession(res.data.token, res.data.uid);
						resolve(res.data);
					} else {
						reject(res.error);
					}
				});
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			axios
				.get('/login/access-token', {
					data: {
						access_token: this.getAccessToken()
					}
				})
				.then(res => {
					console.log(res.data);
					if (res.data) {
						this.setSession(res.data.token, res.data.uid);
						resolve(res.data);
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(error => {
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});
	};

	createUser = data => {
		const envio = new Promise((resolve, reject) => {
			axios.post('/usuarios', data).then(res => {
				if (res.status === 200) {
					// this.setSession(res.data.token, res.data.uid);
					resolve(res.data);
				} else {
					reject(res.data.error);
				}
			});
		});
		return envio;
	};

	updateUserData = user => {
		return axios.post('/user/update', {
			user
		});
	};

	setSession = (token, usuario) => {
		if (token) {
			localStorage.setItem('jwt_access_token', token);
			localStorage.setItem('jwt_usuario', usuario);
			axios.defaults.headers.common.Authorization = `Bearer ${token}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			localStorage.removeItem('jwt_usuario');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null, null);
	};

	isAuthTokenValid = token => {
		if (!token) {
			return false;
		}
		const decoded = jwtDecode(token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('Token de Acesso Expirado');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token');
	};

	getUserAccess = () => {
		return window.localStorage.getItem('jwt_usuario');
	};
}

const instance = new JwtService();

export default instance;
