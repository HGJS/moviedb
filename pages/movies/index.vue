<template>
	<div class="pt-60 pb-60">
		<div class="container-fluid app-container-fluid">
			<div v-if="$fetchState.pending">
				<div class="loading-icon">
					<span class="fas fa-circle-notch fa-spin"></span>
				</div>
			</div>
			<template v-else>
				<h1 class="page-title">Movies</h1>
				<div class="row">
					<app-list-item
						v-for="movie in movies"
						:key="movie.id"
						:id="movie.id"
						:image="movie.poster_path"
						:name="movie.original_title"
						mediaType="movie"
						orientation="portrait"
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
			movies: [],
			totalPages: 1,
			currentPage: this.$route.query.page || 1,
			hasError: false
		}
	},
	async fetch() {
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'
		const pageNumber = this.$route.query.page || 1
		const results = await this.$axios
			.get(
				`/discover/movie?api_key=${apiKey}&page=${pageNumber}&language=en-US`
			)
			.catch(err => {
				this.hasError = true
			})
		this.movies = results.data.results
		this.totalPages = results.data.total_pages
	},
	methods: {
		prevPage() {
			if (this.currentPage != 1 && this.currentPage) {
				this.currentPage--
				this.$router.push(`/movies?page=${this.currentPage}`)
			} else if (!this.currentPage) {
				this.$router.push(`/movies?page=1`)
			}
		},
		nextPage() {
			if (this.currentPage != this.totalPages && this.currentPage) {
				this.currentPage++
				this.$router.push(`/movies?page=${this.currentPage}`)
			} else if (!this.currentPage) {
				this.$router.push(`/movies?page=2`)
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
			title: 'Movies - MovieDB'
		}
	}
}
</script>
