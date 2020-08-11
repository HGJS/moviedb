<template>
	<div
		:class="{
			'col-6 col-sm-6 col-md-3': !sliderItem,
			'col slider-item': sliderItem
		}"
		class="mb-30 list-item"
	>
		<nuxt-link
			:to="`/${itemMediaLink}/${id}`"
			class="list-item__link"
			:class="{ 'list-item__link--person': this.mediaType == 'person' }"
		>
			<div class="list-item__link-image-wrap">
				<div
					class="list-item__link-image"
					:style="`background-image:url('${imagePath}')`"
				></div>
			</div>
			<h3 class="list-item__link-title">{{ name }}</h3>
		</nuxt-link>
	</div>
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
		image: {},
		mediaType: {
			type: String,
			required: true
		},
		sliderItem: {
			type: Boolean
		}
	},
	computed: {
		imagePath() {
			if (!this.image) {
				if (this.mediaType == 'person') {
					return '/person-fallback.png'
				}
				return '/movie-tv-fallback.png'
			}
			return `https://image.tmdb.org/t/p/w342/${this.image}`
		},
		itemMediaLink() {
			switch (this.mediaType) {
				case 'movie':
					return 'movies'
					break
				case 'tv':
					return 'tv'
					break
				case 'person':
					return 'people'
					break
			}
		}
	}
}
</script>
