<template>
	<div class="pt-60 pb-60">
		<div v-if="$fetchState.pending" class="pb-30">
			<div class="container-fluid app-container-fluid">
				<div class="loading-icon">
					<span class="fas fa-circle-notch fa-spin"></span>
				</div>
			</div>
		</div>
		<div v-else class="container-fluid app-container-fluid">
			<template v-if="searchTerms">
				<h1 class="page-title">Search</h1>
				<div class="mb-30">
					<p>Showing results for: {{ searchTerms }}</p>
				</div>
			</template>
			<template v-else>
				<h1 class="page-title">Search</h1>
			</template>

			<template v-if="results.length > 0">
				<div class="row">
					<app-list-item
						v-for="result in results"
						:key="result.id"
						:id="result.id"
						:image="result.poster_path || result.profile_path"
						:name="
							result.original_title ||
								result.original_name ||
								result.name
						"
						:mediaType="result.media_type"
					/>
				</div>

				<div v-if="totalPages > 1" class="row mt-30">
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
			results: [],
			totalPages: 1,
			currentPage: this.$route.query.page || 1,
			showNoResultsText: true
		}
	},
	computed: {
		searchTerms() {
			return decodeURI(this.$route.query.q)
		}
	},
	methods: {
		prevPage() {
			if (this.currentPage != 1 && this.currentPage) {
				this.currentPage--
				this.$router.push(
					`/search?q=${this.$route.query.q}&page=${this.currentPage}`
				)
			} else if (!this.currentPage) {
				this.$router.push(`/search?q=${this.$route.query.q}&page=1`)
			}
		},
		nextPage() {
			if (this.currentPage != this.totalPages && this.currentPage) {
				this.currentPage++
				this.$router.push(
					`/search?q=${this.$route.query.q}&page=${this.currentPage}`
				)
			} else if (!this.currentPage) {
				this.$router.push(`/search?q=${this.$route.query.q}&page=2`)
			}
		}
	},
	async fetch() {
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'
		const pageNumber = this.$route.query.page || 1
		const encodedSearch = this.$route.query.q
		const results = await this.$axios.get(
			`/search/multi?api_key=${apiKey}&language=en-US&query=${encodedSearch}&page=${pageNumber}`
		)
		this.results = results.data.results
		this.totalPages = results.data.total_pages
	},
	watch: {
		'$route.query': '$fetch'
	},
	components: {
		'app-list-item': AppListItem
	},
	head() {
		return {
			title: decodeURI(this.$route.query.q)
				? `${decodeURI(this.$route.query.q)} - Search - MovieDB`
				: 'Search - MovieDB'
		}
	}
}
</script>
