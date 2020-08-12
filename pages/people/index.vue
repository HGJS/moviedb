<template>
	<div class="pt-60 pb-60">
		<div class="container-fluid app-container-fluid">
			<div v-if="$fetchState.pending">
				<div class="loading-icon">
					<span class="fas fa-circle-notch fa-spin"></span>
				</div>
			</div>
			<template v-else>
				<h1 class="page-title">People</h1>
				<div class="row">
					<app-list-item
						v-for="person in people"
						:key="person.id"
						:id="person.id"
						:image="person.profile_path"
						:name="person.name"
						mediaType="person"
					/>
				</div>
				<div class="row mt-30">
					<div v-if="currentPage != 1" class="app-col mr-auto">
						<button class="button" @click="prevPage">
							Previous
						</button>
					</div>
					<div
						v-if="currentPage != totalPages"
						class="app-col ml-auto"
					>
						<button class="button" @click="nextPage">Next</button>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import AppListItem from '@/components/AppListItem'

export default {
	data() {
		return {
			people: [],
			totalPages: 0,
			currentPage: this.$route.query.page || 1,
			hasError: false
		}
	},
	async fetch() {
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'
		const pageNumber = this.$route.query.page || 1
		const results = await this.$axios
			.get(
				`/person/popular?api_key=${apiKey}&page=${pageNumber}&language=en-US`
			)
			.catch(err => {
				this.hasError = true
			})
		this.people = results.data.results
		this.totalPages = results.data.total_pages
		console.log(this.$route)
	},
	methods: {
		prevPage() {
			if (this.currentPage != 1 && this.currentPage) {
				this.currentPage--
				this.$router.push(`/people?page=${this.currentPage}`)
			} else if (!this.currentPage) {
				this.$router.push(`/people?page=1`)
			}
		},
		nextPage() {
			if (this.currentPage != this.totalPages && this.currentPage) {
				this.currentPage++
				this.$router.push(`/people?page=${this.currentPage}`)
			} else if (!this.currentPage) {
				this.$router.push(`/people?page=2`)
			}
		}
	},
	watch: {
		'$route.query.page': '$fetch'
	},
	components: {
		'app-list-item': AppListItem
	},
	head() {
		return {
			title: 'People - MovieDB'
		}
	}
}
</script>
