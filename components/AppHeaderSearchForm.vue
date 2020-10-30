<template>
	<div class="dropdown app-header__dropdown">
		<form class="app-header__search-form" @submit.prevent="processSearch">
			<label for="headerSearch" class="sr-only">Search</label>
			<input
				id="headerSearch"
				type="text"
				class="form-control app-header__search-form-input"
				required
				placeholder="Search..."
				v-model="searchTerms"
				ref="searchTerms"
				@input="onInput"
				autocomplete="off"
				v-click-outside="hideDropdown"
				@click="shouldShowDropdown"
				@focus="shouldShowDropdown"
			/>
			<button class="app-header__search-form-submit">
				Search
			</button>
			<div
				class="dropdown-menu app-header__dropdown-menu"
				:class="{ show: dropdownVisible }"
			>
				<autocomplete-item
					class="dropdown-item app-header__dropdown-item"
					v-for="suggestion in suggestions"
					:key="suggestion.id"
					:id="suggestion.id"
					:image="suggestion.imagePath"
					:name="suggestion.name"
					:mediaType="suggestion.mediaType"
					@clicked="onAutoCompleteItemClick"
				>
				</autocomplete-item>
			</div>
		</form>
	</div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import AutocompleteItem from '@/components/AutocompleteItem'
import list from '~/assets/js/list'
export default {
	data() {
		return {
			searchTerms: '',
			timer: '',
			dropdownVisible: false,
			suggestions: []
		}
	},
	components: {
		'autocomplete-item': AutocompleteItem
	},
	methods: {
		onInput() {
			if (this.timer) {
				clearTimeout(this.timer)
			}

			this.timer = setTimeout(() => {
				if (this.searchTerms === '') {
					this.hideDropdown()
					this.suggestions = []
					return
				}

				this.$axios
					.get(`/search/multi`, {
						params: {
							api_key: 'f19c666067ae31ab26cb6225b464a8dc',
							language: 'en',
							query: this.searchTerms
						}
					})
					.then(res => {
						const results = res.data.results
						this.suggestions = list.results(results.slice(0, 5))
						this.shouldShowDropdown()
					})
					.catch(err => console.log(err))
			}, 300)
		},
		processSearch() {
			const searchTerms = this.$refs.searchTerms.value
			this.$router.push(
				`/search?page=1&query=${encodeURI(this.searchTerms)}`
			)
			this.searchTerms = ''
			this.$emit('processSearch')
		},
		hideDropdown() {
			this.dropdownVisible = false
		},
		shouldShowDropdown() {
			if (this.suggestions.length) {
				this.dropdownVisible = true
			} else {
				this.dropdownVisible = false
			}
		},
		onAutoCompleteItemClick() {
			this.clearAutoComplete()
		},
		clearAutoComplete() {
			this.hideDropdown()
			this.searchTerms = ''
			this.suggestions = []
		}
	},
	directives: {
		ClickOutside
	},
	mounted() {
		this.$refs.searchTerms.focus()
	}
}
</script>
