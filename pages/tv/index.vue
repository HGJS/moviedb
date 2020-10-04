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
				<h1 class="page-title">TV Shows</h1>
				<div class="row">
					<app-list-item
						v-for="show in shows"
						:key="show.id"
						:id="show.id"
						:image="show.imagePath"
						:name="show.name"
						mediaType="tv"
						orientation="portrait"
					/>
				</div>
				<app-pagination routeName="tv" :totalPages="totalPages" />
			</template>
		</div>
	</div>
</template>

<script>
import AppListItem from '@/components/AppListItem'
import AppPagination from '@/components/AppPagination'
import list from '~/assets/js/list'

export default {
	name: 'tv',
	data() {
		return {
			shows: [],
			totalPages: 1,
			hasError: false
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
			.get(`/tv/popular`, {
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
	},
	watch: {
		'$route.query': '$fetch'
	},
	components: {
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
