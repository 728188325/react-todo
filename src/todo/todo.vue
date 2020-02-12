<template>
	<section class="real-app">
		<input 
			type="text"
			class="add-input"
			autofocus="autofucus"
			placeholder="接下去做什么？"
			@keyup.enter="addTodo"
		>
		<Item
			:todo="todo"
			v-for="(todo,index) in filteredTodos"
			:key="index"
			@del="deleteTodo"
		/>
		<Tabs
			:filter="filter"
			:todos="todos"
			@toggle="toggleFilter"
			@clearAllCompleted="clearAllCompleted"
		></Tabs>
	</section>
</template>

<script>
	let id = 0;
	import Item from './item.vue'
	import Tabs from './tabs.vue'
	export default {
		data(){
			return {
				todos: [],
				filter: 'all'
			}
		},
		components: {
			Item,
			Tabs
		},
		computed: {
			filteredTodos() {
				if(this.filter==='all'){
					return this.todos;
				}
				const completed = this.filter==='completed';
				return this.todos.filter(todo=>todo.completed==completed)
			}
		},
		methods: {
			addTodo(e) {
				this.todos.unshift({
					id: id++,
					content: e.target.value.trim(),
					completed: false
				})
				e.target.value = '';
			},
			deleteTodo(id) {
				this.todos.splice(this.todos.findIndex(todo=>todo.id===id),1);
			},
			toggleFilter(state) {
				this.filter = state;
			},
			clearAllCompleted() {
				this.todos = this.todos.filter(todo=>!todo.completed)
			}
		}
	}
</script>

<style lang="stylus" scoped>
	.real-app{
		width 600px
		margin 0 auto
		box-shadow 0 0 5px #666
	}
	.add-input{
		position: relative;
		margin: 0;
		width: 100%;
		font-size: 24px;
		font-family: inherit;
		line-height: inherit;
		outline: none;
		color: inherit;
		box-sizing: border-box;
		font-smoothing: antialiased;
		padding: 16px 16px 16px 60px;
		border: none;
		box-shadow: inset 0 -2px 1px rgba(0,0,0,0.08);
	}
</style>