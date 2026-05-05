const { writeFileSync, mkdirSync } = require( 'fs' );
require( 'dotenv' ).config();

const targetPath = './src/environments/environment.ts';
const targetPathDev = './src/environments/environment.development.ts';

const gifKey = process.env[ 'GIF_KEY' ];
const giphyUrl = process.env[ 'GIPHY_URL' ];

if ( !gifKey && !giphyUrl) {
  throw new Error( 'GIF_KEY | GIPHY_URL is not set' );
}

const envFileContent = `
export const environment = {
  gifKey: "${ gifKey }",
  giphyUrl: "${ giphyUrl }",
  title:"Gifs",
  subtitle:"App",
  slogan:"GifsApp"
};
`;
mkdirSync( './src/environments', { recursive: true } );
writeFileSync( targetPath, envFileContent );
writeFileSync( targetPathDev, envFileContent );
