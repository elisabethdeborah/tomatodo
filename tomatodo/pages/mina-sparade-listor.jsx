import React, { useEffect, useState } from "react";
import Meta from "../components/Meta";
import styles from "../styles/tomatoLibrary.module.scss";
import clsx from "clsx";
import LibraryArchiveObj from "../components/libraryArchiveObj";
import DeleteButton from "../components/DeleteButton";
import {useUpdateContext, useTodoContext} from "../context/TodoContext";
import PopupLists from "../components/PopupLists";

export default function SparadeListor() {
	const [addListFormIsVisible, setAddListFormIsVisible] = useState(false);
	const [showListObject, setShowListObject] = useState(false);
	const [listObjectIndex, setListObjectIndex] = useState();
	const [showSettingsForm, setShowSettingsForm] = useState(false);
	const [showAddTodo, setShowAddTodo] = useState(false);
	const [overlay, setOverlay] = useState(false)
	const [showStartList, setShowStartList] = useState(false);
	const [currentObj, setCurrentObj] = useState(null);
	const [addToListIsVisible, setaddToListIsVisible] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const state = useTodoContext();
	const currentState = useUpdateContext();
	const fetchAllLists = state.fetchTodos;
	const [isLoading, setIsLoading] = useState(false);

	const currentLists = state.initialFetch? state.initialFetch.allTodoLists.filter(x => x.numberOfNotChecked > 0 || x.nrOfTodos === 0):null;
	const savedLists = state.initialFetch? state.initialFetch.allTodoLists.filter(x => x.saved && x.numberOfNotChecked === 0):null;

	useEffect(() => {
		setIsLoading(true);
		fetchAllLists();
		return () => setIsLoading(false);
	}, []);

	useEffect(() => {
		savedLists ? setIsLoading(false) : setIsLoading(true);
		return () => setIsLoading(false);
	}, [savedLists]);

	useEffect(() => {
		overlay ? null : currentState.setCurrentItem(null);
	}, [overlay]);
	  
	const handleClick = (x, item) => {
		if (showListObject) {
			setCurrentObj(item);
			setOverlay(false);
			setShowAddTodo(false);
			setShowSettingsForm(false);
			setAddListFormIsVisible(false);
			setaddToListIsVisible(false);
			setTimeout(() => {
				setShowListObject(false);
				listObjectIndex !== x ? setListObjectIndex(x) : setListObjectIndex(null);
			}, 600);
		} else if (!showListObject){
			setShowListObject(true);
			setShowAddTodo(false);
			setAddListFormIsVisible(false);
			listObjectIndex !== x ? setListObjectIndex(x) : setListObjectIndex(null);
			setTimeout(() => {
				setOverlay(true);
			}, 10);
		};	
	};  

	const closeAll = (x) => {
		setaddToListIsVisible(x);
		setShowStartList(x);
	};
	
	return (
		<div className={styles.tomatoPageWrapper}>
			<Meta title='Mina sparade listor' />
			{
				showDelete && (
					<DeleteButton list={currentState.currentItem} type={'deleteLg'} />
				)
			}
			{
				addToListIsVisible && (
				<section className={styles.restartForm}>
					<PopupLists setPopupIsOpen={closeAll} setOverlay={setOverlay} />
				</section>
				)
			}
			<div className={styles.libraryContainer}>
				<div className={styles.tomatoListTop}>
					<h2 className={styles.savedListsHeader}>Mina sparade listor</h2> 
				</div>
				{
					showListObject && (
						<div onClick={() => handleClick()} className={clsx(styles.showOverlay, {[styles.overlayVisible]: overlay})}/> 
					)
				}
				{
					isLoading ? (
							<h1 className={styles.LoadingText} style={{width: '100%', textAlign: 'center'}}>Hämtar sparade listor...</h1>
						) : 
							savedLists && savedLists.length > 0 ? 
							(
									savedLists.map((list, index) => {
										return (
											<LibraryArchiveObj  
												key={list._rev} 
												list={list} 
												index={index} 
												listObjectIndex={listObjectIndex} 
												showListObject={showListObject} 
												handleClick={handleClick}
												setaddToListIsVisible={setaddToListIsVisible}
												setShowDelete={setShowDelete}
											/>
										);
									})
								) : (
									<h1 className={styles.LoadingText} style={{width: '100%', textAlign: 'center', padding: '2rem 1rem'}}>Du har inga sparade listor</h1>
								)
				}
			</div>
		</div>
	);
};
