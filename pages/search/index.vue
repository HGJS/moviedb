<template>
	<div class="pt-60 pb-60">
		<div v-if="$fetchState.pending">
			LOADING!!!
		</div>
		<div class="container-fluid app-container-fluid">
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
			showNoResultsText: true
		}
	},
	computed: {
		searchTerms() {
			return decodeURI(this.$route.query.q)
		}
	},
	async fetch() {
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'
		const encodedSearch = this.$route.query.q
		const results = await this.$axios.get(
			`/search/multi?api_key=${apiKey}&query=${encodedSearch}`
		)
		this.results = results.data.results
	},
	watch: {
		'$route.query': '$fetch'
	},
	components: {
		'app-list-item': AppListItem
	}
}
</script>
