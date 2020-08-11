<template>
	<header v-click-outside="hideSearch" class="app-header">
		<div class="app-header__inner">
			<div class="container-fluid app-container-fluid">
				<div class="row app-header__row">
					<div class="app-col app-header__logo-col">
						<a href="/" class="app-header__logo-link">
							<img
								src="/logo.svg"
								alt="MovieDB"
								width="115"
								height="16"
								class="app-header__logo"
							/>
						</a>
					</div>
					<div class="app-col app-header__nav-col">
						<div class="app-header__nav-wrap">
							<ul class="app-header__nav-list">
								<li class="app-header__nav-list-item">
									<nuxt-link
										to="/movies"
										class="app-header__nav-link"
										>Movies</nuxt-link
									>
								</li>
								<li class="app-header__nav-list-item">
									<nuxt-link
										to="/tv"
										class="app-header__nav-link"
										>TV Shows</nuxt-link
									>
								</li>
								<li class="app-header__nav-list-item">
									<nuxt-link
										to="/people"
										class="app-header__nav-link"
										>People</nuxt-link
									>
								</li>
							</ul>
						</div>
					</div>
					<div class="app-col app-header__search-col">
						<button
							class="app-header__search-button"
							title="Search"
							@click="toggleSearch"
						>
							<span
								:class="{
									'fa-times': showSearch,
									'fa-search': !showSearch
								}"
								class="app-header__search-button-icon fal"
							></span>
						</button>
					</div>
				</div>
			</div>
		</div>
		<div v-show="showSearch" class="app-header__search-form-wrap">
			<div class="app-header__search-form-wrap-inner">
				<div class="container-fluid  app-container-fluid">
					<app-header-search-form
						@processSearch="
							{
								showSearch = false
							}
						"
					/>
				</div>
			</div>
		</div>
	</header>
</template>

<script>
import ClickOutside from 'vue-click-outside'

// import AppMenuDropdown from '@/components/AppMenuDropdown'
import AppHeaderSearchForm from '@/components/AppHeaderSearchForm'

export default {
	data() {
		return {
			showSearch: false,
			showDropdown: true
		}
	},
	methods: {
		processSearch(e) {
			console.log('processSearch')
		},
		toggleSearch() {
			this.showSearch = !this.showSearch
			if (!this.showSearch) {
				this.hideSearch()
			}
		},
		hideSearch() {
			if (this.showSearch) {
				this.showSearch = false
				this.searchTerms = ''
			}
		},
		handleDropdownToggle(dropdownShown) {
			if (dropdownShown) {
				this.hideSearch()
			}
		}
	},
	components: {
		// 'app-menu-dropdown': AppMenuDropdown,
		'app-header-search-form': AppHeaderSearchForm
	},
	directives: {
		ClickOutside
	}
}
</script>
