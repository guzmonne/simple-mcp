const fs = require('fs')
const gm = require('gm')

// resize to 2048px and remove EXIF profile data
gm('/home/gmonne/Projects/simple-mcp/dist/images/supermarket.jpg')
	.resize(2048, 2048)
	.noProfile()
	.write('/home/gmonne/Projects/simple-mcp/dist/images/supermarket_2048.jpg', (err) => 
		console.log('Done with 2048')
	)
// resize to 1024px and remove EXIF profile data
gm('/home/gmonne/Projects/simple-mcp/dist/images/supermarket.jpg')
	.resize(1024, 1024)
	.noProfile()
	.write('/home/gmonne/Projects/simple-mcp/dist/images/supermarket_1024.jpg', (err) => 
		console.log('Done with 1024')
	)
// resize to 512px and remove EXIF profile data
gm('/home/gmonne/Projects/simple-mcp/dist/images/supermarket.jpg')
	.resize(512, 512)
	.noProfile()
	.write('/home/gmonne/Projects/simple-mcp/dist/images/supermarket_512.jpg', (err) => 
		console.log('Done with 512')
	)
// resize to 256px and remove EXIF profile data
gm('/home/gmonne/Projects/simple-mcp/dist/images/supermarket.jpg')
	.resize(256, 256)
	.noProfile()
	.write('/home/gmonne/Projects/simple-mcp/dist/images/supermarket_256.jpg', (err) => 
		!!err ? console.error(err) : console.log('Done with 256')
	)