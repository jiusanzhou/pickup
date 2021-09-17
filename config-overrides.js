const {
    override, overrideDevServer,

    addDecoratorsLegacy,
    disableEsLint,
    addPostcssPlugins,
} = require("customize-cra")

const rewireWebpackBundleAnalyzer = require('react-app-rewire-webpack-bundle-analyzer')

const { responseInterceptor } = require('http-proxy-middleware');
const injectScripts = require("./src/proxy/dev/server");

const LSITEN_PORT = 9000;

module.exports = {
    webpack: override(
        // enable legacy decorators babel plugin
        addDecoratorsLegacy(),
      
        // disable eslint in webpack
        disableEsLint(),
    
        // postcss
        addPostcssPlugins([
            require('tailwindcss'),
            require('autoprefixer'),
        ]),

        (config) => {
            // add plugins
            return config;
        }
    
        // (config) => rewireWebpackBundleAnalyzer(config, null, {
        //     analyzerMode: 'static',
        //     generateStatsFile: true,
        //     // reportFilename: 'report.html'
        // }),
    ),
    devServer: overrideDevServer(
        (config) => {
            return {
                ...config,
                // index: '', // enable / proxy
                before: (app, server, compiler) => {
                    // only html
                    app.use(injectScripts(compiler, {
                        target: "</head>"
                    }))
                },
                proxy: [
                    {
                        // https://github.com/chimurai/http-proxy-middleware
                        // https://github.dev/chimurai/http-proxy-middleware#options
                        context: ["/"],
                        target: '/', // just for ignore
                        secure: false,
                        changeOrigin: true,
                        cookieDomainRewrite: '',
                        // autoRewrite: true,
                        followRedirects: true,
                        pathRewrite: {
                            '^/--index': '/' // important remove --index
                        },
                        router: (req) => {
                            if (req.headers["--proxy-target"]) {
                                return req.headers["--proxy-target"]
                            }

                            // load target from cookie which setted by js
                            const xr = /--proxy-target=(https?:\/\/[. _-\w]+)/.exec(req.headers['cookie'])
                            if (xr) {
                                const target = xr[1];
                                // TODO: check the url is iggle
                                return target
                            }

                            // if path is favicon.ico ???

                            // default return empty page
                            // should auto directlly to /
                            // can i get the self server?
                            return "https://example.com";
                        },
                    }
                ]
            };
        }
    )
}