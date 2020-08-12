<template>
	<div>
		<div v-if="$fetchState.pending" class="pt-60 pb-30">
			<div class="container-fluid app-container-fluid">
				<div class="loading-icon">
					<span class="fas fa-circle-notch fa-spin"></span>
				</div>
			</div>
		</div>
		<template v-else>
			<div class="page-banner">
				<div class="page-banner__background"></div>
				<div class="page-banner__inner">
					<div class="container-fluid app-container-fluid">
						<div class="row">
							<div
								v-if="person.profile_path"
								class="col-12 col-md-6 col-lg-4 mb-30"
							>
								<img
									:src="
										`https://image.tmdb.org/t/p/w780/${person.profile_path}`
									"
									:alt="person.name"
									class="img-fluid md-max-400"
								/>
							</div>
							<div class="col-12 col-md-6 col-lg-8 mb-30">
								<h1 class="page-banner__title">
									{{ person.name }}
								</h1>
								<div class="page-banner__content-area">
									<template v-if="person.birthday">
										<h2>Born</h2>
										<p>
											{{ person.birthday }}
											<template
												v-if="person.place_of_birth"
											>
												<br />
												{{ person.place_of_birth }}
											</template>
										</p>
									</template>

									<template v-if="person.deathday">
										<h2>Died</h2>
										<p>{{ person.deathday }}</p>
									</template>
									<template v-if="person.biography">
										<h2>Biography</h2>
										<p v-html="person.biography"></p>
									</template>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				v-if="personMovieCredits.length || personTVCredits.length"
				class="pt-60 pb-30 info-section"
			>
				<div class="container-fluid app-container-fluid">
					<div class="row items__row">
						<div class="app-col items__title-col mb-30">
							<h2 class="items__title">
								Credits
							</h2>
						</div>
						<div class="app-col items__controls-col mb-30">
							<div class="d-flex">
								<button
									v-if="personMovieCredits.length"
									:class="{ active: creditType == 'movies' }"
									@click="creditType = 'movies'"
									class="button"
								>
									Movies
								</button>
								<button
									v-if="personTVCredits.length"
									:class="{
										active: creditType == 'tv'
									}"
									@click="creditType = 'tv'"
									class="button"
								>
									TV
								</button>
							</div>
						</div>
					</div>

					<transition name="fade" mode="out-in">
						<div
							v-if="
								creditType == 'movies' &&
									personMovieCredits.length
							"
							key="movies"
						>
							<app-items-slider slideOrientation="portrait">
								<app-list-item
									v-for="item in personMovieCredits"
									:key="item.id"
									:id="item.id"
									:image="
										item.poster_path || item.profile_path
									"
									:name="
										item.original_title ||
											item.original_name ||
											item.name
									"
									:character="item.character"
									mediaType="movie"
									:sliderItem="true"
								/>
							</app-items-slider>
						</div>
						<div
							v-if="creditType == 'tv' && personTVCredits.length"
							key="tv"
						>
							<app-items-slider slideOrientation="portrait">
								<app-list-item
									v-for="item in personTVCredits"
									:key="item.id"
									:id="item.id"
									:image="
										item.poster_path || item.profile_path
									"
									:name="
										item.original_title ||
											item.original_name ||
											item.name
									"
									:character="item.character"
									mediaType="tv"
									:sliderItem="true"
								/>
							</app-items-slider>
						</div>
					</transition>
				</div>
			</div>

			<div v-if="personImages.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Images</h2>
					<app-items-slider slideOrientation="portrait">
						<app-images-slider-item
							v-for="(image, index) in personImages"
							:key="image.file_path"
							:image="
								`https://image.tmdb.org/t/p/w1280/${image.file_path}`
							"
							@click="openImageGallery(index)"
							orientation="portrait"
							:name="person.name"
						/>
					</app-items-slider>
				</div>
			</div>
			<client-only>
				<app-light-box
					v-if="personGalleryImages"
					:media="personGalleryImages"
					:showThumbs="false"
					:showLightBox="false"
					ref="imageGallery"
				/>
			</client-only>
		</template>
	</div>
</template>

<script>
import AppListItem from '@/components/AppListItem'
import AppItemsSlider from '@/components/AppItemsSlider'
import AppImagesSliderItem from '@/components/AppImagesSliderItem'

export default {
	data() {
		return {
			person: [],
			personImages: [],
			personGalleryImages: [],
			personMovieCredits: [],
			personTVCredits: [],
			creditType: ''
		}
	},
	methods: {
		openImageGallery(index) {
			this.$refs.imageGallery.showImage(index)
		}
	},
	async fetch() {
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'
		const person = await this.$axios
			.get(
				`/person/${this.$route.params.id}?api_key=${apiKey}&language=en-US&append_to_response=images,movie_credits,tv_credits`
			)
			.catch(err => {
				console.log(err)
			})

		this.person = person.data
		this.personImages = person.data.images.profiles
		this.personMovieCredits = person.data.movie_credits.cast.splice(0, 20)
		this.personTVCredits = person.data.tv_credits.cast.splice(0, 20)

		for (const image of this.personImages) {
			this.personGalleryImages.push({
				src: `https://image.tmdb.org/t/p/w1280/${image.file_path}`
			})
		}

		if (this.personMovieCredits.length) {
			this.creditType = 'movies'
		} else if (this.personTVCredits.length) {
			this.creditType = 'tv'
		} else {
			this.creditType = ''
		}
	},
	validate({ params }) {
		return /^\d+$/.test(params.id)
	},
	head() {
		return {
			title: this.person.name
				? `${this.person.name} - MovieDB`
				: 'MovieDB'
		}
	},
	components: {
		'app-list-item': AppListItem,
		'app-items-slider': AppItemsSlider,
		'app-images-slider-item': AppImagesSliderItem
	}
}
</script>
