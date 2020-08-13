<template>
	<div
		:class="{
			'col-6 col-sm-6 col-md-3': !sliderItem,
			'col slider-item': sliderItem
		}"
		class="mb-30 list-item"
	>
		<template v-if="mediaType != 'youTube'">
			<nuxt-link :to="itemLink" class="list-item__link">
				<div
					class="list-item__link-image-wrap"
					:class="{
						'list-item__link-image-wrap--landscape':
							orientation == 'landscape'
					}"
				>
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
				:href="`https://www.youtube.com/watch?v=${videoKey}`"
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
		videoKey: {
			type: [String, Number]
		},
		name: {
			type: [String, undefined, null],
			required: true
		},
		character: {
			type: String
		},
		season: {
			type: [String, Number]
		},
		episode: {
			type: [String, Number]
		},
		image: {
			type: [String, undefined, null]
		},
		mediaType: {
			type: String,
			required: true
		},
		showVideoFallback: {
			type: [Boolean, null, undefined]
		},
		orientation: {
			type: String
		},
		sliderItem: {
			type: Boolean
		}
	},
	computed: {
		imagePath() {
			if (this.mediaType == 'youTube' && this.showVideoFallback) {
				return `/video-fallback-landscape.png`
			}

			if (this.orientation == 'portrait') {
				if (!this.image) {
					if (this.mediaType == 'person') {
						return '/person-fallback.png'
					}
					return '/movie-tv-fallback.png'
				}
				if (this.mediaType != 'youTube') {
					return `https://image.tmdb.org/t/p/w780/${this.image}`
				}
			}

			if (this.orientation == 'landscape') {
				if (!this.image) {
					if (this.mediaType == 'person') {
						return '/person-fallback-landscape.png'
					}
					return '/movie-tv-fallback-landscape.png'
				}
				if (this.mediaType != 'youTube') {
					return `https://image.tmdb.org/t/p/w1280/${this.image}`
				}
			}

			return this.image
		},
		itemLink() {
			switch (this.mediaType) {
				case 'movie':
					return `/movies/${this.id}`
					break
				case 'tv':
					return `/tv/${this.id}`
					break
				case 'tv-season':
					return `/tv/${this.id}/${this.season}`
					break
				case 'tv-episode':
					return `/tv/${this.id}/${this.season}/${this.episode}`
					break
				case 'person':
					return `/people/${this.id}`
					break
			}
		}
	}
}
</script>
