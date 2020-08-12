<template>
	<div
		:class="{
			'col-6 col-sm-6 col-md-3': !sliderItem,
			'col slider-item': sliderItem
		}"
		class="mb-30 list-item"
	>
		<template v-if="mediaType != 'youTube'">
			<nuxt-link :to="`/${itemMediaLink}/${id}`" class="list-item__link">
				<div class="list-item__link-image-wrap">
					<img
						:src="imagePath"
						:alt="name"
						class="list-item__link-image"
					/>
				</div>
				<h3 class="list-item__link-title">{{ name }}</h3>
				<p v-if="character" class="list-item__link-title">
					{{ character }}
				</p>
			</nuxt-link>
		</template>
		<template v-else>
			<a
				:href="`https://www.youtube.com/watch?v=${id}`"
				target="_blank"
				rel="noopener"
				class="list-item__link"
			>
				<div
					class="list-item__link-image-wrap list-item__link-image-wrap--landscape"
				>
					<img
						:src="imagePath"
						:alt="name"
						class="list-item__link-image"
					/>
				</div>
				<h3 class="list-item__link-title">{{ name }}</h3>
			</a>
		</template>
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
			type: [String, undefined, null],
			required: true
		},
		character: {
			type: String
		},
		image: {
			type: [String, undefined, null]
		},
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
			if (this.mediaType != 'youTube') {
				return `https://image.tmdb.org/t/p/w1280/${this.image}`
			}
			return this.image
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
