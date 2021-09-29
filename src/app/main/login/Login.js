import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import FuseAnimate from '@fuse/core/FuseAnimate';
import { TextFieldFormsy, CheckboxFormsy } from '@fuse/core/formsy';
import Formsy from 'formsy-react';
import { Button, Card, CardContent, Divider, InputAdornment, Icon, IconButton, Typography } from '@material-ui/core';
import clsx from 'clsx';

import { submitLogin } from 'app/auth/store/loginSlice';

import useStyles from './styles';

function Login() {
	const classes = useStyles();
	const login = useSelector(({ auth }) => auth.login);
	const dispatch = useDispatch();

	const [isFormValid, setIsFormValid] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const formRef = useRef(null);

	useEffect(() => {
		if (login.error && (login.error.email || login.error.password)) {
			formRef.current.updateInputsWithError({
				...login.error
			});
			disableButton();
		}
	}, [login.error]);

	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	function handleSubmit(model) {
		dispatch(submitLogin(model));
		formRef.current.reset();
	}

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-auto flex-shrink-0 p-24 md:flex-row md:p-0')}>
			<div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
				<FuseAnimate animation="transition.expandIn">
					<img className="w-128 mb-32" src="assets/images/logos/logo.png" alt="logo" />
				</FuseAnimate>

				<FuseAnimate animation="transition.slideUpIn" delay={400}>
					<Typography variant="h3" color="inherit" className="font-800 leading-tight">
						Welcome to the <br /> Growbase Admin!
					</Typography>
				</FuseAnimate>

				<FuseAnimate delay={500}>
					<Typography variant="subtitle1" color="inherit" className="mt-32">
						Powerful and professional admin template for Web Applications, CRM, CMS, Admin Panels and more.
					</Typography>
				</FuseAnimate>
			</div>

			<FuseAnimate animation={{ translateX: [0, '100%'] }}>
				<Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
					<CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">
						<Typography variant="h6" className="mb-32 font-bold text-20 sm:text-24">
							Login to your account
						</Typography>

						<Formsy
							onValidSubmit={handleSubmit}
							onValid={enableButton}
							onInvalid={disableButton}
							ref={formRef}
							className="flex flex-col justify-center w-full"
						>
							<TextFieldFormsy
								className="mb-16"
								type="text"
								name="email"
								label="E-mail"
								validations="isEmail"
								validationErrors="This is not a valid email"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<Icon className="text-20" color="action">
												email
											</Icon>
										</InputAdornment>
									)
								}}
								variant="outlined"
								required
							/>

							<TextFieldFormsy
								className="mb-16"
								type="password"
								name="password"
								label="Senha"
								InputProps={{
									className: 'pr-2',
									type: showPassword ? 'text' : 'password',
									endAdornment: (
										<InputAdornment position="end">
											<IconButton onClick={() => setShowPassword(!showPassword)}>
												<Icon className="text-20" color="action">
													{showPassword ? 'visibility' : 'visibility_off'}
												</Icon>
											</IconButton>
										</InputAdornment>
									)
								}}
								variant="outlined"
								required
							/>

							<div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
								<CheckboxFormsy className="my-16" name="remember" value={false} label="Remember Me" />

								<Link className="font-medium" to="/forgot-password">
									Forgot Password?
								</Link>
							</div>

							<Button
								type="submit"
								variant="contained"
								color="primary"
								className="w-full mx-auto mt-16"
								aria-label="LOG IN"
								disabled={!isFormValid}
								value="legacy"
							>
								Login
							</Button>
						</Formsy>

						<div className="my-24 flex items-center justify-center">
							<Divider className="w-32" />
							<span className="mx-8 font-bold">OR</span>
							<Divider className="w-32" />
						</div>

						<Button variant="contained" color="secondary" size="small" className="w-192 mb-8">
							Log in with Google
						</Button>

						<Button variant="contained" color="primary" size="small" className="w-192">
							Log in with Facebook
						</Button>

						<div className="flex flex-col items-center justify-center pt-32 pb-24">
							<span className="font-medium">Don't have an account?</span>
							<Link className="font-medium" to="/register">
								Create an account
							</Link>
						</div>
					</CardContent>
				</Card>
			</FuseAnimate>
		</div>
	);
}

export default Login;
