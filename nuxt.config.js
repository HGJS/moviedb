import webpack from 'webpack'

export default {
	mode: 'spa',
	/*
	 ** Headers of the page
	 */
	head: {
		title: 'MovieDB' || '',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: process.env.npm_package_description || ''
			}
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
			{
				rel: 'stylesheet',
				href:
					'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap'
			},
			{
				rel: 'stylesheet',
				href:
					'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
				integrity:
					'sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==',
				crossorigin: 'anonymous',
				referrerpolicy: 'no-referrer'
			}
		]
	},
	/*
	 ** Customize the progress-bar color
	 */
	loading: { color: '#fff' },
	/*
	 ** Global CSS
	 */
	css: ['@assets/scss/style.scss'],
	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: [
		{ src: '~/plugins/lightbox.client.js' },
		{ src: '~/plugins/vue-touch.client.js' }
	],
	/*
	 ** Nuxt.js dev-modules
	 */
	buildModules: ['nuxt-purgecss'],
	/*
	 ** Nuxt.js modules
	 */
	modules: [
		// Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios',
		'bootstrap-vue/nuxt'
	],
	/*
	 ** Axios module configuration
	 ** See https://axios.nuxtjs.org/options
	 */
	axios: {
		baseURL: 'https://api.themoviedb.org/3',
		progress: false
	},
	generate: {
		// exclude: [/^\/movies/, /^\/people/, /^\/search/, /^\/tv/],
		fallback: true
	},
	/*
	 ** Build configuration
	 */
	purgeCSS: {
		whitelistPatterns: [/^slick/, /^vue-lb/],
		whitelistPatternsChildren: [/^slick/, /^vue-lb/]
	},
	build: {
		/*
		 ** You can extend webpack config here
		 */
		plugins: [
			new webpack.ProvidePlugin({
				_: 'lodash'
			})
		],
		extend(config, ctx) {}
	}
}
