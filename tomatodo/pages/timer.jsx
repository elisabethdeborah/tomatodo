import Meta from "../components/Meta";
import clsx from "clsx";
import PieChart from '../components/PieChart';
import styles from '../styles/timer.module.scss';
import React, { useState, useEffect, useRef } from 'react';
import useCountDown from 'react-countdown-hook';
import ProgressBar from "../components/ProgressBar";
import NumberFormat from "../components/NumberFormat";
import TimerComponent from "../components/TimerComponent";

import FormTemplate from "../components/FormTemplate";

import { useRouter } from "next/router";
import client, {
  getClient,
  usePreviewSubscription,
} from "../lib/sanity";

import { groq } from "next-sanity";


import {useUpdateContext, useTodoContext} from "../context/TodoContext";

const Timer = ({timerItemData, preview}) => {
	const [isRunning, setIsRunning] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);
	const [timesUp, setTimesUp] = useState(false);
	const [ soundOn, setSoundOn ] = useState(false);
	const [inputTime, setInputTime] = useState(0);
	const [inputformVisible, setInputformVisible] = useState(false);
	const [overlay, setOverlay] = useState(false);
	const router = useRouter();
	
	const [userInputName, setUserInputName] = useState('');
	const [userInputText, setUserInputText] = useState('');
	const [errMessage, setErrMessage] = useState('');
	
	const timerItem =useUpdateContext().currentState;
	const setTimerState = useUpdateContext().setCurrentItem;

	const state = useTodoContext()
	const currentState = useUpdateContext()
	let currentStateTime = currentState.currentItem? Number(currentState.currentItem.time)*1000:null;

	const [initialTime, setInitialTime] = useState(currentStateTime);
	const [timeLeft, { start, pause, resume, reset }] = useCountDown(initialTime);
	const [formPlay, setFormPlay] = useState(false);

	const [percentage, setPercentage ] = useState(0);

	useEffect(() => {
		setTimesUp(false)
		initialTime? handlePlay():null
		return () => {
			handleStop()
		}
	}, [])


	/////
	const sectionRef = useRef();
	const [width, setWidth] = useState();
	const getListSize = () => {
		const newWidth = sectionRef.current.clientWidth;
		setWidth(newWidth);
	}

	useEffect(() => {
		getListSize();
		window.addEventListener("resize", getListSize);
		
		return () => {
			window.removeEventListener("resize", getListSize);
		}
	  }, []);
	  
	  useEffect(() => {
		console.log('timeLeft', timeLeft)

		if (isInitialized && isRunning && timeLeft <= 0) {
			setTimesUp(true);
		} else {
			setPercentage(Math.round((initialTime-timeLeft)/initialTime*100));
			isInitialized && (calculateBgColor());
		}
		
		  

		  /* console.log(timeLeft, Math.round((initialTime-timeLeft)/initialTime*100))
		  setPercentage(Math.round((initialTime-timeLeft)/initialTime*100));
			isInitialized && isRunning && timeLeft <= 0 && (setTimesUp(true));
		  isInitialized && (calculateBgColor()); */
		  return () => {
			  setTimesUp(false);
		}
	  }, [timeLeft])
	  
	  const restart = () => {
		setTimesUp(false)
		if (isInitialized) { 
			setIsRunning(true);
			start(initialTime);
		}
	  };

	  const handlePlay = () => {
		  setTimesUp(false)
		  if (!isRunning) {
		  if (! isInitialized) {
			start()
			  setIsInitialized(true);
			  setIsRunning(true)
			  
		  } else {
			setIsRunning(true)
			resume()
		  }
		}
	  }

	  const handlePause = () => {
		  pause()
		setIsRunning(false)
	  }

	  const handleStop = () => {
		reset()
	  setIsRunning(false)
	  setIsInitialized(false)
	}

	  const handleResume = (time) => {
			
		  setInitialTime(time)
		  console.log('resume', time, initialTime)
		  setIsInitialized(true)
		  setIsRunning(true)
		  start(time)
	  }

	  const handleReset = () => {
		isInitialized && setIsInitialized(false)
		  reset()
	  }

	  const handleStopAlarm = () => {
		  setTimesUp(false)
		  setIsInitialized(false)
		  setIsRunning(false)
		  sectionRef.current.style.backgroundColor = '';
		};

	const calculateBgColor = () => {
		console.log('percentage', percentage)
		//console.log('sectionRef',sectionRef.current.style.backgroundColor)
		const endColor = [217, 35, 90];
		const middleColor = [252, 255, 8];
		const startColor = [136, 218, 78];
		const gamma = 3;
		let step = percentage< 50? percentage/100: percentage/90;

		step = Math.min(1, step);

		const average = (a, b, percent) => {
			let a_2 = Math.pow(a, gamma);
			let b_2 = Math.pow(b, gamma);
			let c_2 = a_2 + (b_2 - a_2) * percent
			return Math.pow(c_2, 1/gamma);
		}


		const colorString = (r, g, b) => {
			r = Math.min(255, Math.round(r));
			g = Math.min(255, Math.round(g));
			b = Math.min(255, Math.round(b));
		return "#" 
		+ ("0" + r.toString(16)).slice(-2) 
		+ ("0" + g.toString(16)).slice(-2) 
		+ ("0" + b.toString(16)).slice(-2)
		}

		const c = colorString(
			average(startColor[0], middleColor[0], step),
			average(startColor[1], middleColor[1], step),
			average(startColor[2], middleColor[2], step)
		);

		const d = colorString(
			average(middleColor[0], endColor[0], step),
			average(middleColor[1], endColor[1], step),
			average(middleColor[2], endColor[2], step)
		);

		if ( percentage <50) {
			sectionRef.current.style.backgroundColor = c;
		} else if (percentage >= 50) {
			sectionRef.current.style.backgroundColor = d;
		}
	}


	return (
	<div className={clsx(styles.timerPageWrapper, {
		[styles.backgroundIsPlaying]: isInitialized,
		})}
		 ref={sectionRef}>
		<Meta title='Timer' />
		<section className={styles.contentContainer} >
			{
				inputformVisible &&(
				<FormTemplate formIsVisible={inputformVisible} setFormIsVisible={setInputformVisible} setUserInputName={setUserInputName} setUserInputText={setUserInputText} setUserInputTime={setInputTime} userInputTime={inputTime} setFormPlay={setFormPlay} handleResume={handleResume} setIsRunning={setIsRunning}/>
				)}
			<div className={styles.tomatoChartContainer} >
			{
				isInitialized && !timesUp ? 
					<PieChart className={clsx(
						styles.viewPieChart, {[styles.isVisible]: isRunning})} startTime={initialTime} color={sectionRef.current && (sectionRef.current.style.backgroundColor)} timeLeft={timeLeft} /> 
				 : (
					<article className={clsx(styles.tomatoWhiteBorder, {[styles.isVisible]: !isRunning, [styles.animate]: timesUp})} />
				)
			}
			</div>
			{isInitialized && !timesUp && (<article className={styles.tomatoCountDown} />)}
			<h2>{currentState.currentItem && (currentState.currentItem.title)}</h2>
			{!currentState.currentItem && (<button className={styles.addTime} onClick={() => setInputformVisible(true)}>lägg till tid</button>)}
			{isInitialized && timesUp ? (
				<>
			<section className={clsx(styles.timesUpHeaderContainer, {[styles.showText]: timesUp, [styles.hideText]: !timesUp})}>
				<h1 className={styles.timesUpHeader}>Tiden är ute!</h1>
			</section>
			</>
			) : ( 
			<section className={clsx(styles.showCountdownNumbers, {[styles.hideNumber]: timesUp, [styles.showNumbers]: !timesUp})}>
				{isInitialized && typeof timeLeft ==="number" ? <NumberFormat className={styles.formattedTime} milliSeconds={Number(timeLeft)} text={''} textSize={'1.5rem'} showSecs /> 
				: 
				<NumberFormat className={styles.formattedTime} milliSeconds={Number(initialTime)} text={''} textSize={'1.5rem'} showSecs />}
			</section>
			) }
			{ !timesUp ? (
				
				width > 600 ? (
					<section className={styles.buttonContainer}>
						<article className={clsx(styles.timerBtn, styles.playBtn, {[styles.disabled]: isRunning})} onClick={() => handlePlay()} />

						{isRunning ? (
						<article className={clsx(styles.timerBtn, styles.pauseBtn, {[styles.disabled]: !isRunning})} onClick={() => handlePause()} />
						) 
						: (<article className={clsx(styles.timerBtn, styles.stopBtn, {[styles.disabled]: !isInitialized})} onClick={() => handleStop()} />)
						}
						<article className={clsx(styles.timerBtn, styles.restartBtn, {[styles.disabled]: !isInitialized})} onClick={() => restart()} />
						 <article className={clsx(styles.timerBtn, {[styles.soundOffBtn]: soundOn, [styles.soundOnBtn]: !soundOn})} onClick={() => setSoundOn(!soundOn)} />
					</section>
					) : (
					<section className={styles.buttonContainer}>
						<article className={clsx(styles.timerBtn, {[styles.pauseBtn]: isRunning, [styles.playBtn]: !isRunning})}  onClick={isRunning ? () => handlePause() : () => handlePlay()} /> 
						<article className={clsx(styles.timerBtn, {[styles.soundOnBtn]: soundOn, [styles.soundOffBtn]: !soundOn })} onClick={() => setSoundOn(!soundOn)} />
					</section>
					)
				) : (
				<section className={styles.buttonContainerAfter}>
					<article className={clsx(styles.timerBtn, styles.stopBtn)}  onClick={() => handleStopAlarm()} /> 
				</section>
			)}
			
			<ProgressBar 
			initialTime={initialTime} 
			timeLeft={timeLeft} 
			color={sectionRef.current? sectionRef.current.style.backgroundColor: null}
			percentage={isInitialized && timeLeft > 0 ? percentage : 0}
			isRunning={isRunning}
			/>
		</section>
	</div>
)};
  


export default Timer;