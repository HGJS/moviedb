<template>
	<nuxt-link :to="link">
		<img
			v-if="image"
			:src="`https://image.tmdb.org/t/p/w92${image}`"
			:alt="name"
			class="img-fluid
		app-header__dropdown-item-image"
			width="46"
		/>
		<div class="app-header__dropdown-item-text">
			{{ name }}<br v-if="releaseDate" />{{ releaseYear }}
		</div>
	</nuxt-link>
</template>

<script>
export default {
	props: {
		id: {
			type: [String, Number],
			required: true
		},
		name: {
			type: String,
			required: true
		},
		image: {
			type: String
		},
		mediaType: {
			type: String,
			required: true
		},
		releaseDate: {
			type: String
		}
	},
	computed: {
		link() {
			switch (this.mediaType) {
				case 'movie':
					return `/movies/${this.id}`
					break
				case 'tv':
					return `/tv/${this.id}`
					break
				case 'person':
					return `/people/${this.id}`
					break
			}
		},
		releaseYear() {
			return this.releaseDate
				? `${new Date(this.releaseDate).getFullYear()}`
				: ''
		}
	}
}
</script>
