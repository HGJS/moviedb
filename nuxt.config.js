export default {
	mode: 'universal',
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
		script: [
			{
				src: 'https://kit.fontawesome.com/11d4c6a015.js',
				crossorigin: 'anonymous'
			}
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
			{
				rel: 'stylesheet',
				href:
					'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap'
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
	plugins: [],
	/*
	 ** Nuxt.js dev-modules
	 */
	buildModules: [],
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
	/*
	 ** Build configuration
	 */
	build: {
		/*
		 ** You can extend webpack config here
		 */
		extend(config, ctx) {}
	}
}
