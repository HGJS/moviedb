<template>
	<li
		v-click-outside="hideDropdown"
		class="dropdown app-header__nav-list-item"
	>
		<a
			class="dropdown-toggle app-header__nav-link app-header__nav-link--dropdown-toggle"
			href="#"
			:id="id"
			role="button"
			data-toggle="dropdown"
			aria-haspopup="true"
			:aria-expanded="showDropdown"
			@click.prevent="toggleDropdown"
		>
			{{ title }}
		</a>
		<div
			:class="{ show: showDropdown }"
			class="dropdown-menu app-header__dropdown-menu"
			:aria-labelledby="id"
		>
			<slot></slot>
		</div>
	</li>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
	data() {
		return {
			showDropdown: false
		}
	},
	props: {
		title: {
			type: String,
			required: true
		},
		id: {
			type: String,
			required: true
		}
	},
	methods: {
		toggleDropdown() {
			this.showDropdown = !this.showDropdown
			this.$emit('emitDropdownToggle', this.showDropdown)
		},
		hideDropdown() {
			if (this.showDropdown) {
				this.showDropdown = false
			}
		}
	},
	directives: {
		ClickOutside
	}
}
</script>

<!-- <app-menu-dropdown
		title="Movies"
		id="moviesMenuDropdown"
		@emitDropdownToggle="
			handleDropdownToggle($event)
		"
	>
		<a
			class="dropdown-item app-header__dropdown-item app-header__nav-link"
			href="#"
			>Popular</a
		>
		<a
			class="dropdown-item app-header__dropdown-item app-header__nav-link"
			href="#"
			>Now Playing</a
		>
		<a
			class="dropdown-item app-header__dropdown-item app-header__nav-link"
			href="#"
			>Upcoming</a
		>
		<a
			class="dropdown-item app-header__dropdown-item app-header__nav-link"
			href="#"
			>Top Rated</a
		>
	</app-menu-dropdown>
	<app-menu-dropdown
		title="TV Shows"
		id="showsMenuDropdown"
		@emitDropdownToggle="
			handleDropdownToggle($event)
		"
	>
		<a
			class="dropdown-item app-header__dropdown-item app-header__nav-link"
			href="#"
			>Popular</a
		>
		<a
			class="dropdown-item app-header__dropdown-item app-header__nav-link"
			href="#"
			>Airing Today</a
		>
		<a
			class="dropdown-item app-header__dropdown-item app-header__nav-link"
			href="#"
			>On TV</a
		>
		<a
			class="dropdown-item app-header__dropdown-item app-header__nav-link"
			href="#"
			>Top Rated</a
		>
	</app-menu-dropdown>
	<app-menu-dropdown
		title="People"
		id="peopleMenuDropdown"
		@emitDropdownToggle="
			handleDropdownToggle($event)
		"
	>
		<a
			class="dropdown-item app-header__dropdown-item app-header__nav-link"
			href="#"
			>Popular</a
		>
	</app-menu-dropdown> -->
