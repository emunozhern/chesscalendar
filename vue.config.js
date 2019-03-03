module.exports = {
    filenameHashing: false,
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    }
    // publicPath: process.env.NODE_ENV === 'production' ? 'https://www.albertochueca.com/wp-content/themes/enfold-child/vue/' : process.env.NODE_ENV === 'development' ? '/chesscalendar/' : '/'
    // publicPath: process.env.NODE_ENV === 'production' ? 
    // '/' 
    // // '/chesscalendar/'
    // : '/'
  }