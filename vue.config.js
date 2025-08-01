module.exports = {
  chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.hbs$/) // Or whatever extension you use for your Handlebars template
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  }
};