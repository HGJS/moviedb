<template>
	<div v-if="showPagination" class="row mt-30">
		<div v-if="showPrevButton" class="app-col mr-auto">
			<button class="button" @click="prevPage">
				Previous
			</button>
		</div>
		<div v-if="showNextButton" class="app-col ml-auto">
			<button class="button" @click="nextPage">Next</button>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		totalPages: {
			type: Number,
			required: true
		},
		routeName: {
			type: String,
			required: true
		}
	},
	computed: {
		showPagination() {
			return this.totalPages > 1
		},
		currentPage() {
			return this.$route.query.page
		},
		showPrevButton() {
			return this.currentPage > 1
		},
		showNextButton() {
			return this.currentPage < this.totalPages
		}
	},
	methods: {
		prevPage() {
			const query = { ...this.$route.query }
			if (query.page > 1) query.page--
			this.$router.push({ name: this.routeName, query })
		},
		nextPage() {
			const query = { ...this.$route.query }
			if (query.page < this.totalPages) query.page++
			this.$router.push({ name: this.routeName, query })
		}
	}
}
</script>
