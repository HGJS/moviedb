<template>
	<div class="col image-slider-item">
		<a
			href="#"
			@click.prevent="handleClick"
			class="image-slider-item__link"
		>
			<div
				class="image-slider-item__link-image-wrap"
				:class="{
					'image-slider-item__link-image-wrap--landscape':
						orientation == 'landscape'
				}"
			>
				<div class="image-slider-item__link-image">
					<img
						v-lazy="imageOptions"
						:alt="name"
						class="list-item__link-image"
					/>
				</div>
			</div>
		</a>
	</div>
</template>

<script>
export default {
	props: {
		image: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		orientation: {
			type: String,
			required: true
		}
	},
	methods: {
		handleClick() {
			this.$emit('click')
		}
	},
	computed: {
		imageOptions() {
			const loadingImagePath = () => {
				if (this.orientation == 'portrait') {
					return '/lazy-loading.png'
				}
				return '/lazy-loading-landscape.png'
			}

			const errorImagePath = () => {
				if (this.orientation == 'portrait') {
					return '/lazy-loading-error.png'
				}
				return '/lazy-loading-error-landscape.png'
			}

			return {
				src: this.image,
				error: errorImagePath(),
				loading: loadingImagePath()
			}
		}
	}
}
</script>
