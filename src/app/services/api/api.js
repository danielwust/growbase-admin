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
		axios.defaults.baseURL = process.env.REACT_APP_API_URL;
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
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			axios.post('/api/auth/register', data).then(response => {
				if (response.data.user) {
					this.setSession(response.data.access_token);
					resolve(response.data.user);
				} else {
					reject(response.data.error);
				}
			});
		});
	};

	doGet = async url => {
		await axios(url)
			.then(res => {
				console.log(res.data);
				if (res.status === 200) {
					res.data.success = true;
					return res.data;
				}
				res.success = false;
				return res.data;
			})
			.catch(err => console.log(err));
	};

	doPost = async (url, data) => {
		try {
			const response = await axios.post(url, data);

			if (response.data.success === true) {
				return response.data;
			}

			return 'erro';
		} catch (error) {
			return { data: error.response.data, status: error.response.status };
		}
	};

	doPut = async (url, data) => {
		try {
			const response = await axios.put(url, data);

			if (response.data.success === true) {
				return response.data;
			}

			return 'erro no doput';
		} catch (error) {
			return { data: error.response.data, status: error.response.status };
		}
	};

	doFile = async (url, data) => {
		try {
			const response = await axios.post(url, data, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});

			if (response.data.success === true) {
				return response.data;
			}

			return 'erro no dofile';
		} catch (error) {
			return { data: error.response.data, status: error.response.status };
		}
	};

	doDelete = async url => {
		try {
			const response = await axios.delete(url);

			if (response.data.success === true) {
				return response.data;
			}

			return 'erro no dodelete, cheque o status';
		} catch (error) {
			return error.response;
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
					if (res.data.usuario) {
						if (remember) {
							this.setSaveSession(res.data.token);
						} else {
							this.setSession(res.data.token);
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
				.then(response => {
					if (response.data.data.user) {
						this.setSession(response.data.data.access_token);
						resolve(response.data.data.user);
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
					senha: 'daniel'
				})
				.then(res => {
					console.log(res);
					if (!res.data.erro) {
						if (salvar) {
							this.setSaveSession(res.data.token);
						} else {
							this.setSession(res.data.token);
						}
						resolve(res.data);
					} else {
						reject(new Error(res.data.erro));
					}
				})
				.catch(err => {
					switch (err.toString().slice(39, 42)) {
						case '400':
							reject('Dados invalidos');
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

	setSession = access_token => {
		if (access_token) {
			sessionStorage.setItem('jwt_access_token', access_token);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			sessionStorage.removeItem('jwt_access_token');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	setSaveSession = access_token => {
		if (access_token) {
			localStorage.setItem('jwt_access_token', access_token);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
		this.setSaveSession(null);
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
}

const instance = new Api();

export default instance;
