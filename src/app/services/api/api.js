import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
/* eslint-disable camelcase */

class Api extends FuseUtils.EventEmitter {
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
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					if (err.response?.status === 401 && err.config && !err.config.__isRetryRequest) {
						this.emit('onAutoLogout', err.response?.data?.message);
						this.setSession(null,null);
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

		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token,user_access);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null,null);
			this.emit('onAutoLogout', 'Sessão Expirada');
			// this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			axios.post('/usuarios', data).then(res => {
				console.log(res);
				if (res.data) {
					this.setSession(res.data.token,res.data.uid);
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

	signInWithTokenDISABLED = () => {
		return new Promise((resolve, reject) => {
			const token = this.getAccessToken();
			axios
				.post('/login/token', { token })
				.then(res => {
					if (res.data) {
						this.setSession(res.data.token,res.data.uid);
						resolve(res.data);
					} else {
						this.logout();
						reject(new Error('Falha ao tentar logar com o token.'));
					}
				})
				.catch(error => {
					this.logout();
					reject(new Error('Falha ao tentar logar com o token.'));
				});
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			const salvar = true;
			axios
				.post('/login', {
					usuario: 'daniel@daniel.com',
					senha: 'daniels'
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

	updateUserData = user => {
		return axios.put(`/users/${user.uid}`, {
			user
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

	logout = () => {
		this.setSession(null,null);
		this.setSaveSession(null,null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		let token = window.sessionStorage.getItem('jwt_access_token');
		if (!token) {
			token = window.localStorage.getItem('jwt_access_token');
		}

		return token;
	};

	getUserAccess = () => {
		let token = window.sessionStorage.getItem('jwt_usuario');
		if (!token) {
			token = window.localStorage.getItem('jwt_usuario');
		}

		return token;
	};
}

const instance = new Api();

export default instance;
