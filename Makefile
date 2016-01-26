all:
	node_modules/.bin/browserify src/index.js --debug --outfile dist/index.js -t [ babelify --presets [ es2015 ] --global=true ]

dev:
	node_modules/.bin/watchify src/index.js --debug --outfile dist/index.js -t [ babelify --presets [ es2015 ] --global=true ]
