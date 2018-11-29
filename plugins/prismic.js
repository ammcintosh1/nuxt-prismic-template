import Vue from 'vue'
import Prismic from 'prismic-javascript'
import PrismicConfig from '~/prismic-configuration'
import PrismicDOM from 'prismic-dom'
import PrismicToolbar from 'prismic-toolbar'

export default (ctx, inject) => {
  inject('prismic', new Vue({
    computed: {
      predicates () {
        return Prismic.Predicates
      },
      prismicDOM () {
        return PrismicDOM
      }
    },
    methods: {
      asHtml (richText) {
        if (richText) {
          return this.prismicDOM.RichText.asHtml(richText, PrismicConfig.linkResolver, PrismicConfig.htmlSerializer)
        }
      },
      asText (richText) {
        if (richText) {
          return this.prismicDOM.RichText.asText(richText)
        }
      },
      asLink (link) {
        if (link) {
          return this.prismicDOM.Link.url(link, PrismicConfig.linkResolver)
        }
      },
      asDate (date, format) {
        if (date) {
          let d = this.prismicDOM.Date(date)
          return d
        }
      },
      initApi (req) {
        const accessToken = PrismicConfig.accessToken
        return Prismic.getApi(PrismicConfig.apiEndpoint, {
          req: req
        }).then(api => ({
          api,
          req,
          endpoint: PrismicConfig.apiEndpoint,
          accessToken,
          linkResolver: PrismicConfig.linkResolver
        }))
      },
      setupPreview (token, req) {
        console.log('prismic setup preview with token: ', token);

        return Prismic.getApi(PrismicConfig.apiEndpoint, {req: req})
          .then((api) => api.previewSession(token, PrismicConfig.linkResolver, '/'))
          .then(url => {
            console.log('prismic setup preview url is: ', url);
            return url
          });
      }
    }
  }))
}

export function setupPrismicPreview() {
  window.prismic = {
    endpoint: PrismicConfig.apiEndpoint
  };

  let prismicToolbarScript = document.createElement('script');
  prismicToolbarScript.setAttribute('src',"//static.cdn.prismic.io/prismic.min.js");
  document.head.appendChild(prismicToolbarScript);
}