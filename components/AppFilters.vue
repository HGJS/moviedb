<template>
	<div class="filters" v-if="visible">
		<h2 class="filters__title">
			Filter
			<button class="filters__title-button button" @click="hideFilters">
				<span class="fas fa-times"></span>
			</button>
		</h2>
		<div class="filters__group">
			<h3 class="filters__group-title">Sort by</h3>
			<label class="sr-only" for="filtersSortBy">Sort by</label>
			<select
				id="filtersSortBy"
				class="form-control"
				v-model="filters.sort_by"
			>
				<option
					v-for="sort in filterOptions.sort_by"
					:key="sort.value"
					:value="sort.value"
				>
					{{ sort.title }}
				</option>
			</select>
		</div>

		<div class="filters__group filters__group--checkboxes">
			<h3 class="filters__group-title">Genres</h3>
			<div class="filters__checkbox-wrap">
				<div
					class="filters__checkbox"
					v-for="genre in filterOptions.with_genres"
					:key="genre.id"
				>
					<label class="filters__checkbox-label">
						<input
							type="checkbox"
							:value="genre.id"
							v-model="filters.with_genres"
							class="sr-only filters__checkbox"
						/>
						<div class="filters__checkbox-text">
							{{ genre.name }}
						</div>
					</label>
				</div>
			</div>
		</div>

		<div
			v-if="filterOptions.certifications"
			class="filters__group filters__group--checkboxes"
		>
			<h3 class="filters__group-title">Certification</h3>
			<div class="filters__checkbox-wrap">
				<div
					class="filters__checkbox"
					v-for="certification in filterOptions.certifications"
					:key="certification.certification"
				>
					<label class="filters__checkbox-label">
						<input
							type="radio"
							:value="certification.certification"
							v-model="filters.certification"
							class="sr-only filters__checkbox"
							name="certification"
							@click="
								shouldDeselectRadio(
									certification.certification,
									filters.certification
								)
							"
						/>
						<div class="filters__checkbox-text">
							{{ certification.certification }}
						</div>
					</label>
				</div>
			</div>
		</div>

		<button
			class="button button--width-full mb-20"
			:class="{ disabled: !enableFilterButton }"
			@click="applyFilters"
		>
			Filter
		</button>
		<div class="text-center">
			<a href="#" class="filters__clear" @click.prevent="resetFilters">
				Reset filters
			</a>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		filterOptions: {
			type: Object,
			required: true
		},
		type: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			visible: false,
			defaultSort: 'popularity.desc',
			filters: {
				sort_by: 'popularity.desc',
				with_genres: [],
				certification_country: this.filterOptions.certification_country,
				certification: ''
			}
		}
	},
	methods: {
		applyFilters() {
			const path = this.$route.path
			const filters = {
				sort_by: this.filters.sort_by
			}

			if (this.filters.with_genres.length) {
				filters.with_genres = this.filters.with_genres.join(',')
			}

			if (this.filters.certification.length) {
				filters.certification_country = this.filters.certification_country
				filters.certification = this.filters.certification
			}

			this.$router.push({
				path,
				query: {
					page: 1,
					...filters
				}
			})

			this.hideFilters()
		},
		shouldDeselectRadio(target, storedValue) {
			if (target === storedValue) {
				this.filters.certification = ''
			}
		},
		resetFilters() {
			this.filters.sort_by = 'popularity.desc'
			this.filters.with_genres = []
			this.filters.certification = ''
		},
		showFilters() {
			this.visible = true
			this.$nuxt.$emit('showFilters')
		},
		hideFilters() {
			this.visible = false
		}
	},
	created() {
		this.$nuxt.$on('onShowFiltersClick', () => {
			this.showFilters()
		})
		this.$nuxt.$on('showSearch', () => {
			this.hideFilters()
		})

		const query = this.$route.query

		if (query.sort_by) {
			this.filters.sort_by = query.sort_by
		}

		if (query.with_genres) {
			if (typeof query.with_genres === 'number') {
				this.filters.with_genres.push(query.with_genres)
			} else if (typeof query.with_genres === 'string') {
				let genreIDs = []
				query.with_genres.split(',').filter(el => {
					if (!isNaN(parseInt(el))) {
						genreIDs.push(parseInt(el))
					}
				})
				this.filters.with_genres = genreIDs
			}
		}

		if (query.certification) {
			this.filters.certification = query.certification
		}
	},
	computed: {
		enableFilterButton() {
			const query = this.$route.query

			if (!query.sort_by && !query.with_genres) {
				if (
					this.filters.sort_by === this.defaultSort &&
					this.filters.with_genres.length === 0 &&
					this.filters.certification.length === 0
				) {
					return false
				}
			}

			let sortSame = false
			let genresSame = false
			let certificationSame = false

			if (this.filters.sort_by === query.sort_by) {
				sortSame = true
			}

			if (query.with_genres) {
				let genreIDs = []
				if (typeof query.with_genres === 'number') {
					genreIDs.push(query.with_genres)
				} else if (typeof query.with_genres === 'string') {
					query.with_genres.split(',').filter(el => {
						if (!isNaN(parseInt(el))) {
							genreIDs.push(parseInt(el))
						}
					})
				}
				if (
					_.isEqual(
						_.sortBy(this.filters.with_genres),
						_.sortBy(genreIDs)
					)
				) {
					genresSame = true
				}
			} else if (this.filters.with_genres.length === 0) {
				genresSame = true
			}

			if (this.filters.certification === query.certification) {
				certificationSame = true
			}

			if (sortSame && genresSame && certificationSame) return false

			return true
		}
	}
}
</script>
