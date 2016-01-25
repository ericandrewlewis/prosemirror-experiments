all:
	node_modules/.bin/browserify src/index.js --outfile dist/index.js -t [ babelify --presets [ es2015 ] ]
