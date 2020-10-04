<template>
	<div class="pt-60 pb-60">
		<div v-if="$fetchState.pending" class="pb-30">
			<div class="container-fluid app-container-fluid">
				<div class="loading-icon">
					<span class="fas fa-circle-notch fa-spin"></span>
				</div>
			</div>
		</div>
		<div v-else-if="$fetchState.error">
			<div class="container-fluid app-container-fluid">
				<h1 class="page-title">Error</h1>
				<div class="content-area">
					<p class="mb-30">
						There was an error fetching content.
					</p>
					<nuxt-link class="button" to="/">Home</nuxt-link>
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
						:image="result.imagePath"
						:name="result.name"
						:mediaType="result.mediaType"
						orientation="portrait"
					/>
				</div>
			</template>

			<template v-else>
				<div class="content-area mb-30">
					<p>No results found</p>
				</div>
			</template>

			<app-pagination routeName="search" :totalPages="totalPages" />
		</div>
	</div>
</template>

<script>
import AppListItem from '@/components/AppListItem'
import AppPagination from '@/components/AppPagination'
import list from '~/assets/js/list'

export default {
	name: 'search',
	data() {
		return {
			results: [],
			totalPages: 1,
			showNoResultsText: true
		}
	},
	computed: {
		searchTerms() {
			return decodeURI(this.$route.query.query)
		}
	},
	async fetch() {
		const query = this.$route.query

		if (Object.keys(this.$route.query).length === 0) {
			this.$router.replace({
				path: `${this.$route.path}?page=1`
			})
		}

		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'
		const encodedSearch = this.$route.query.q
		const searchData = await this.$axios.get(`/search/multi`, {
			params: {
				api_key: apiKey,
				language: 'en',
				...query
			}
		})

		const results = searchData.data.results

		this.results = list.results(results)
		this.totalPages = searchData.data.total_pages
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
			title: decodeURI(this.$route.query.query)
				? `${decodeURI(this.$route.query.query)} - Search - MovieDB`
				: 'Search - MovieDB'
		}
	}
}
</script>
