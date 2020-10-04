<template>
	<div>
		<div v-if="$fetchState.pending" class="pt-60 pb-30">
			<div class="container-fluid app-container-fluid">
				<div class="loading-icon">
					<span class="fas fa-circle-notch fa-spin"></span>
				</div>
			</div>
		</div>
		<div v-else-if="$fetchState.error">
			<div class="pt-60 pb-60">
				<div class="container-fluid app-container-fluid">
					<h1 class="page-title">Error</h1>
					<div class="content-area">
						<p class="mb-30">
							There was an error fetching content.
						</p>
						<nuxt-link class="button" to="/">Home</nuxt-link>
					</div>
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
								v-if="person.image"
								class="col-12 col-md-4 mb-30"
							>
								<img
									:src="
										`https://image.tmdb.org/t/p/w780/${person.image}`
									"
									:alt="person.name"
									class="img-fluid md-max-400"
								/>
							</div>
							<div
								class="col-12 mb-30"
								:class="{ 'col-md-8': person.image }"
							>
								<h1 class="page-banner__title">
									{{ person.name }}
								</h1>
								<div class="page-banner__content-area">
									<template v-if="person.birthday">
										<h2>Born</h2>
										<p>
											{{ person.birthday }}
											<template
												v-if="person.placeOfBirth"
											>
												<br />
												{{ person.placeOfBirth }}
											</template>
										</p>
									</template>

									<template v-if="person.deathday">
										<h2>Died</h2>
										<p>{{ person.deathday }}</p>
									</template>

									<template v-if="person.knownFor">
										<h2>Known for</h2>
										<p>{{ person.knownFor }}</p>
									</template>

									<template v-if="person.biography">
										<h2>Biography</h2>
										<p
											class="page-banner__desc"
											v-html="person.biography"
										></p>
									</template>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				v-if="person.credits.movies.length || person.credits.tv.length"
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
									v-if="person.credits.movies.length"
									:class="{ active: creditType == 'movies' }"
									@click="creditType = 'movies'"
									class="button"
								>
									Movies
								</button>
								<button
									v-if="person.credits.tv.length"
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
									person.credits.movies.length
							"
							key="movies"
						>
							<app-items-slider slideOrientation="portrait">
								<app-list-item
									v-for="movie in person.credits.movies"
									:key="movie.id"
									:id="movie.id"
									:image="movie.imagePath"
									:name="movie.name"
									:character="movie.character"
									mediaType="movie"
									:sliderItem="true"
									orientation="portrait"
								/>
							</app-items-slider>
						</div>
						<div
							v-if="
								creditType == 'tv' && person.credits.tv.length
							"
							key="tv"
						>
							<app-items-slider slideOrientation="portrait">
								<app-list-item
									v-for="show in person.credits.tv"
									:key="show.id"
									:id="show.id"
									:image="show.imagePath"
									:name="show.name"
									:character="show.character"
									mediaType="tv"
									:sliderItem="true"
									orientation="portrait"
								/>
							</app-items-slider>
						</div>
					</transition>
				</div>
			</div>

			<div v-if="person.images.length" class="pt-60 pb-30 info-section">
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Images</h2>
					<app-items-slider slideOrientation="portrait">
						<app-images-slider-item
							v-for="(image, index) in person.images"
							:key="image.imagePath"
							:image="
								`https://image.tmdb.org/t/p/w780/${image.imagePath}`
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
					v-if="person.gallery"
					:media="person.gallery"
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
import list from '~/assets/js/list'

export default {
	data() {
		return {
			person: [],
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
		const personData = await this.$axios
			.get(
				`/person/${this.$route.params.id}?api_key=${apiKey}&language=en&append_to_response=images,movie_credits,tv_credits`
			)
			.catch(err => {
				console.log(err)
			})

		const person = personData.data

		this.person = {
			id: person.id,
			name: person.name,
			image: person.profile_path,
			biography: person.biography,
			birthday: person.birthday,
			deathday: person.deathday,
			placeOfBirth: person.place_of_birth,
			knownFor: person.known_for_department,
			images: list.images(person.images.profiles),
			gallery: list.gallery(person.images.profiles),
			credits: {
				movies: list.movies(
					person.movie_credits.cast.slice(0, 20),
					true
				),
				tv: list.shows(person.tv_credits.cast.slice(0, 20), true)
			}
		}

		if (this.person.credits.movies.length) {
			this.creditType = 'movies'
		} else if (this.person.credits.tv.length) {
			this.creditType = 'tv'
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
