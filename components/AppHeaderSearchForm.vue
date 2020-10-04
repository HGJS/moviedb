<template>
	<form class="app-header__search-form" @submit.prevent="processSearch">
		<label for="headerSearch" class="sr-only">Search</label>
		<input
			id="headerSearch"
			type="text"
			class="form-control app-header__search-form-input"
			required
			placeholder="Search..."
			ref="searchTerms"
		/>
		<button class="app-header__search-form-submit">
			Search
		</button>
	</form>
</template>

<script>
export default {
	methods: {
		processSearch() {
			const searchTerms = this.$refs.searchTerms.value
			this.$router.push(`/search?page=1&query=${encodeURI(searchTerms)}`)
			this.$refs.searchTerms.value = ''
			this.$emit('processSearch')
		}
	},
	mounted() {
		this.$refs.searchTerms.focus()
	}
}
</script>
