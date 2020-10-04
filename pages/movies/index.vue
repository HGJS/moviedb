<template>
	<div class="pt-60 pb-60">
		<div class="container-fluid app-container-fluid">
			<div v-if="$fetchState.pending">
				<div class="loading-icon">
					<span class="fas fa-circle-notch fa-spin"></span>
				</div>
			</div>
			<div v-else-if="$fetchState.error">
				<h1 class="page-title">Error</h1>
				<div class="content-area">
					<p class="mb-30">
						There was an error fetching content.
					</p>
					<nuxt-link class="button" to="/">Home</nuxt-link>
				</div>
			</div>
			<template v-else>
				<h1 class="page-title">Movies</h1>

				<div class="row">
					<div class="col-12">
						<template v-if="movies.length">
							<div class="row">
								<app-list-item
									v-for="movie in movies"
									:key="movie.id"
									:id="movie.id"
									:image="movie.imagePath"
									:name="movie.name"
									mediaType="movie"
									orientation="portrait"
								/>
							</div>
						</template>
						<div v-else class="content-area mb-30">
							<p>No results found.</p>
						</div>
					</div>
				</div>
				<app-pagination routeName="movies" :totalPages="totalPages" />
			</template>
		</div>
	</div>
</template>

<script>
import AppListItem from '@/components/AppListItem'
import AppPagination from '@/components/AppPagination'
import list from '~/assets/js/list'

export default {
	name: 'movies',
	data() {
		return {
			movies: [],
			totalPages: 1,
			hasError: false
		}
	},
	async fetch() {
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'
		const query = this.$route.query

		if (Object.keys(query).length === 0) {
			this.$router.replace({
				name: 'movies',
				query: {
					page: 1
				}
			})
		}

		const moviesData = await this.$axios
			.get(`/discover/movie`, {
				params: {
					api_key: apiKey,
					language: 'en',
					...query
				}
			})
			.catch(err => {
				this.hasError = true
			})

		const movies = moviesData.data.results

		this.movies = list.movies(movies)
		this.totalPages = moviesData.data.total_pages
	},
	watch: {
		$route: '$fetch'
	},
	components: {
		'app-list-item': AppListItem,
		'app-pagination': AppPagination
	},
	head() {
		return {
			title: 'Movies - MovieDB'
		}
	}
}
</script>
