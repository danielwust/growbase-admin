import FuseUtils from '@fuse/utils/FuseUtils';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setBaseUrl();
		this.setInterceptors();
		this.handleAuthentication();
	}

	setBaseUrl = () => {
		axios.defaults.baseURL = process.env.REACT_APP_API_URL
			? process.env.REACT_APP_API_URL
			: 'http://localhost:8080/api';
	};

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
		const user_access = this.getUserAccess();

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

	signInWithEmailAndPassword = (email, password, remember) => {
		return new Promise((resolve, reject) => {
			axios
				.post('/login', {
					usuario: email,
					senha: password
				})
				.then(res => {
					if (res.data) {
						if (remember) {
							this.setSaveSession(res.data.token, res.data.uid);
						} else {
							this.setSession(res.data.token, res.data.uid);
						}
						resolve(res.data);
					} else {
						reject(res.error);
					}
				});
		});
	};

	logout = () => {
		this.setSession(null, null);
		this.setSaveSession(null, null);
	};

	setSaveSession = (access_token, uid) => {
		if (access_token) {
			localStorage.setItem('jwt_access_token', access_token);
			localStorage.setItem('jwt_usuario', uid);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			localStorage.removeItem('jwt_usuario');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			const salvar = true;
			axios
				.post('/login', {
					usuario: 'daniel@daniel.com',
					senha: 'daniel'
				})
				.then(res => {
					if (!res.data.erro) {
						if (salvar) {
							this.setSaveSession(res.data.token, res.data.uid);
						} else {
							this.setSession(res.data.token, res.data.uid);
						}
						resolve(res.data);
					}
					reject(new Error(res.data.erro));
				})
				.catch(err => {
					switch (err.toString().slice(39, 42)) {
						case '400':
							reject(new Error('Dados invalidos'));
							break;
						case '404':
							reject(new Error('Usuario não encontrado'));
							break;
						case '500':
							reject(new Error('Erro no servidor, tente novamente em 10s'));
							break;
						default:
					}
				});
		});
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			axios.post('/usuarios', data).then(res => {
				if (res.status === 200) {
					this.setSession(res.data.token, res.data.uid);
					resolve(res.data);
				} else {
					reject(res.data.error);
				}
			});
		});
	};

	setSession = (access_token, uid) => {
		if (access_token) {
			sessionStorage.setItem('jwt_access_token', access_token);
			localStorage.setItem('jwt_usuario', uid);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('jwt_usuario');
			sessionStorage.removeItem('jwt_access_token');
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
