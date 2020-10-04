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
				<h1 class="page-title">People</h1>
				<div class="row">
					<app-list-item
						v-for="person in people"
						:key="person.id"
						:id="person.id"
						:image="person.imagePath"
						:name="person.name"
						mediaType="person"
						orientation="portrait"
					/>
				</div>
				<app-pagination routeName="people" :totalPages="totalPages" />
			</template>
		</div>
	</div>
</template>

<script>
import AppListItem from '@/components/AppListItem'
import AppPagination from '@/components/AppPagination'
import list from '~/assets/js/list'

export default {
	name: 'people',
	data() {
		return {
			people: [],
			totalPages: 1,
			hasError: false
		}
	},
	async fetch() {
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'
		const query = this.$route.query

		if (Object.keys(query).length === 0) {
			this.$router.replace({
				name: 'people',
				query: {
					page: 1
				}
			})
		}

		const peopleData = await this.$axios
			.get(`/person/popular`, {
				params: {
					api_key: apiKey,
					language: 'en',
					...query
				}
			})
			.catch(err => {
				this.hasError = true
			})

		const people = peopleData.data.results

		this.people = list.people(people)
		this.totalPages = peopleData.data.total_pages
	},
	watch: {
		'$route.query.page': '$fetch'
	},
	components: {
		'app-list-item': AppListItem,
		'app-pagination': AppPagination
	},
	head() {
		return {
			title: 'People - MovieDB'
		}
	}
}
</script>
