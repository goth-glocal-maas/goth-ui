
export const URL = process.env.API_URL || '//localhost:8000'
export const LOGIN = '/api-token-auth/'

export const GRAPHQL_URI = process.env.GRAPHQL_URI || '//localhost:8000/graphql'

export const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2lwcDExIiwiYSI6ImNpa2hzbGpzcDAyYWl0eWo3azhkaHR3aWIifQ.cc4CGgGKkpP_8XVa2BUwtQ'
export const MAPBOX_URL = `https://api.tiles.mapbox.com/v4/sipp11.p4efho4p/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`
