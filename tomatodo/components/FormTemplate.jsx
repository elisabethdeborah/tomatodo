import React, { useState, useEffect } from "react";
import styles from '../styles/form.module.scss';
import clsx from "clsx";
import { useUpdateContext } from "../context/TodoContext";

const FormTemplate = ({ setFormIsVisible, setUserInputTime, setFormPlay, setIsRunning }) => {
	const setTimerState = useUpdateContext().setCurrentItem;
	const [overlay, setOverlay] = useState(false);
	const [formInputTime, setFormInputTime] = useState({hh:0, min:0});
	const inputTime = Number(formInputTime.hh *60 * 60 + formInputTime.min*60);
	let hours = [];
	const mins = [];

	for (let index = 0; index < 24; index++) {
		hours.push(index);
	};

	for (let index = 0; index < 60; index++) {
		mins.push(index);
	};

	const handleClick = () => {
		setTimerState(inputTime);
		setUserInputTime(inputTime);
		setFormPlay(true);
		console.log(inputTime);
		setIsRunning(true);
		setOverlay(false);
			setTimeout(() => {
				setFormIsVisible(false);
			}, 600);
	};

	const handleGoBack = () => {
		setOverlay(false);
		setTimeout(() => {
			setFormIsVisible(false);
		}, 600);
	};

	useEffect(() => {
		setTimeout(() => {
			setOverlay(true);
		}, 10);
		return () => setOverlay(false);
	}, []);

	return (
		<>
			<div onClick={() => handleGoBack()} className={clsx(styles.showOverlay, {[styles.overlayVisible]: overlay})}/>
			<section 
				className={clsx(styles.formContainer, {
					[styles.formIsVisible]: overlay
				})}
				style={{padding: '60px'}}
			>
				<h1 className={styles.formHeader}>Lägg till tid</h1>
				<div className={styles.timeInputContainer} style={{width: '100%'}}>
					<select
						value={formInputTime.hh}
						onChange={({ target: { value } }) => setFormInputTime({hh: value, min: formInputTime.min})}
					>
						{hours.map((value, index) => (
							<option key={index} value={value}>
								{value<10? `0${value}`: value}
							</option>
						))}
					</select>
					<select
						value={formInputTime.min}
						onChange={({ target: { value } }) => setFormInputTime({hh: formInputTime.hh, min: value})}
					>
						{mins.map((value, index) => (
							<option key={index} value={value}>
								{value<10? `0${value}`: value}
							</option>
						))}
					</select>
				</div>
				<div className={styles.btnContainer}>
					<input type={"button"} className={styles.closeForm} value="Ångra" onClick={ () => handleGoBack()} />
					<input type={"button" }className={styles.addBtn} value="Lägg till" onClick={() => handleClick()} />
				</div>
			</section>
		</>
	);
};

export default FormTemplate;

