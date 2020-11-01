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
				<app-filters type="tv" :filterOptions="filterOptions" />

				<div class="row align-items-center">
					<div class="app-col page-title-col">
						<h1 class="page-title">TV Shows</h1>
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
						<template v-if="shows.length">
							<div class="row">
								<app-list-item
									v-for="show in shows"
									:key="show.id"
									:id="show.id"
									:image="show.imagePath"
									:name="show.name"
									mediaType="tv"
									:releaseDate="show.releaseDate"
									orientation="portrait"
								/>
							</div>
						</template>
						<div v-else class="content-area mb-30">
							<p>No results found.</p>
						</div>
					</div>
				</div>
				<app-pagination routeName="tv" :totalPages="totalPages" />
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
	name: 'tv',
	data() {
		return {
			shows: [],
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
				with_genres: []
				// certification_country: 'GB',
				// certifications: []
			}
		}
	},
	async fetch() {
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'
		const query = this.$route.query

		if (Object.keys(query).length === 0) {
			this.$router.replace({
				name: 'tv',
				query: {
					page: 1
				}
			})
		}

		const showsData = await this.$axios
			.get(`/discover/tv`, {
				params: {
					api_key: apiKey,
					language: 'en',
					...query
				}
			})
			.catch(err => {
				this.hasError = true
			})

		const shows = showsData.data.results

		this.shows = list.shows(shows)
		this.totalPages = showsData.data.total_pages

		const genresList = await this.$axios
			.get(`/genre/tv/list`, {
				params: {
					api_key: apiKey,
					language: 'en'
				}
			})
			.catch(err => {
				this.hasError = true
			})

		this.filterOptions.with_genres = genresList.data.genres

		// const certificationsList = await this.$axios
		// 	.get(`/certification/tv/list`, {
		// 		params: {
		// 			api_key: apiKey,
		// 			language: 'en'
		// 		}
		// 	})
		// 	.catch(err => {
		// 		this.hasError = true
		// 	})

		// const unsortedCertifications =
		// 	certificationsList.data.certifications[
		// 		this.filterOptions.certification_country
		// 	]

		// const sortedCertifications = unsortedCertifications.sort(
		// 	(a, b) => a.order - b.order
		// )

		// this.filterOptions.certifications = sortedCertifications
	},
	methods: {
		onShowFiltersClick() {
			this.$nuxt.$emit('onShowFiltersClick')
		}
	},
	watch: {
		'$route.query': '$fetch'
	},
	components: {
		'app-filters': AppFilters,
		'app-list-item': AppListItem,
		'app-pagination': AppPagination
	},
	head() {
		return {
			title: 'TV Shows - MovieDB'
		}
	}
}
</script>
