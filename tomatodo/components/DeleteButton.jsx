import styles from '../styles/deleteBtn.module.scss';
import {useTodoContext} from "../context/TodoContext";
import clsx from 'clsx';
import { useState } from 'react';

const DeleteButton = ({color, listItem, size, text, setDisplayWarning}) => {
	const [showWarning, setShowWarning] = useState(false);
	const state = useTodoContext()
	const fetchAllLists = state.fetchTodos;

	const handleDelete = async (listItem) => {
		//delete todo
		if (listItem._type === 'todo') {
			await fetch("/api/todos/todo", {
				method: "DELETE",
				body: listItem._id,
			})
			.then(console.log('posted'))
			.catch(error => {
				console.log('error:', error);
			})
			fetchAllLists();			 
		//delete todo-list
		} else if (listItem._type === 'todoList') {
			console.log('todos: ',listItem.todos)
			listItem.todos.map(async(x) => {
				await fetch("/api/todos/todo", {
					method: "DELETE",
					body: x._id,
				})
				.then(console.log('posted'))
				.catch(error => {
					console.log('error:', error);
				})
			})
			await fetch("/api/todos/todolist", {
				method: "DELETE",
				body: listItem._id,
			})
			.then(console.log('posted'))
			.catch(error => {
				console.log('error:', error);
			})
			fetchAllLists();
		} else if (listItem._type === 'tomato') {
		//delete tomato
			await fetch("/api/tomatoes/tomato", {
				method: "DELETE",
				body: listItem._id,
			})
			fetchAllLists();
		}
		setDisplayWarning ? setDisplayWarning(false):null;
		setShowWarning(false);
	};

	return (
		<>
			<div onClick={() => setShowWarning(!showWarning)} 
				className={clsx(styles.deleteBtn, {
					[styles.smallOrange]: color === 'orange', 
					[styles.smallBlue]: color === 'blue', 
					[styles.large]: size === 'large',
					[styles.regular]: size === 'regular', 
				})} 
			>
				{text}
			</div>
			{showWarning && (
				<div className={styles.deleteWarning}>
					<h2>Vill du ta bort {listItem.title}?</h2>
					<div className={styles.btnContainer}>
						<input className={clsx(styles.warningBtn,styles.delete)} type={"button"} onClick={() => handleDelete(listItem)} value={'ta bort'} />
						<input className={clsx(styles.warningBtn, styles.close)} type={"button"} onClick={() => setShowWarning(false)} value={'ångra'}  />
					</div>
				</div>
			)}
		</>
	)
};

export default DeleteButton;


