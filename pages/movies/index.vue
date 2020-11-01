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
				<app-filters type="movie" :filterOptions="filterOptions" />

				<div class="row align-items-center">
					<div class="app-col page-title-col">
						<h1 class="page-title">Movies</h1>
					</div>
					<div class="app-col">
						<button
							@click="onShowFiltersClick"
							class="button button--wide mb-30"
						>
							Show Filters
						</button>
					</div>
				</div>

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
									:releaseDate="movie.releaseDate"
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
import AppFilters from '@/components/AppFilters'
import AppListItem from '@/components/AppListItem'
import AppPagination from '@/components/AppPagination'
import list from '~/assets/js/list'

export default {
	name: 'movies',
	data() {
		return {
			movies: [],
			totalPages: 1,
			hasError: false,
			filterOptions: {
				sort_by: [
					{
						value: 'popularity.desc',
						title: 'Popularity Descending'
					},
					{
						value: 'popularity.asc',
						title: 'Popularity Ascending'
					},
					{
						value: 'primary_release_date.desc',
						title: 'Release Date Descending'
					},
					{
						value: 'primary_release_date.asc',
						title: 'Release Date Ascending'
					}
				],
				with_genres: [],
				certification_country: 'GB',
				certifications: []
			}
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

		const genresList = await this.$axios
			.get(`/genre/movie/list`, {
				params: {
					api_key: apiKey,
					language: 'en'
				}
			})
			.catch(err => {
				this.hasError = true
			})

		this.filterOptions.with_genres = genresList.data.genres

		const certificationsList = await this.$axios
			.get(`/certification/movie/list`, {
				params: {
					api_key: apiKey,
					language: 'en'
				}
			})
			.catch(err => {
				this.hasError = true
			})

		const unsortedCertifications =
			certificationsList.data.certifications[
				this.filterOptions.certification_country
			]

		const sortedCertifications = unsortedCertifications.sort(
			(a, b) => a.order - b.order
		)

		this.filterOptions.certifications = sortedCertifications
	},
	methods: {
		onShowFiltersClick() {
			this.$nuxt.$emit('onShowFiltersClick')
		}
	},
	watch: {
		$route: '$fetch'
	},
	components: {
		'app-filters': AppFilters,
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
