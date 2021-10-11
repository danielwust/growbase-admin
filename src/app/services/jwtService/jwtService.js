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
					if (res.data.token) {
						if (remember) {
							this.setSaveSession(res.data.token, res.data.uid);
						} else {
							this.setSession(res.data.token, res.data.uid);
						}
						resolve(res.data);
					} else {
						if (res.data.erro) {
							this.emit('onAutoLogout', res.data.erro);
						} else {
							this.emit('onAutoLogout', res.data.error);
						}
						reject(res.data.erro);
					}
				})
				.catch(err => {
					this.emit('onAutoLogout', this.catchParaErro(err));
					// reject(new Error(this.catchParaErro(err)));
				});
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			// axios
			// 	.get('/api/auth/access-token', {
			// 		Authorization: this.getAccessToken(),
			// 		usuarioUid: this.getUserAccess()
			// 	})
			axios
				.post('/login', {
					usuario: 'daniel@daniel.com',
					senha: 'daniel'
				})
				.then(res => {
					if (res.data) {
						this.setSession(res.data.token, res.data.uid);
						resolve(res.data);
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(err => {
					reject(new Error(this.catchParaErro(err)));
				});
		});
	};

	catchParaErro(err) {
		switch (err.toString().slice(39, 42)) {
			case '400':
				return 'Dados invalidos';
			case '404':
				return 'Usuario não encontrado';
			case '500':
				return 'Erro no servidor, tente novamente em 10s';
			default:
				return 'Erro desconhecido, a culpa deve ser do Marcelo kkk';
		}
	}

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
