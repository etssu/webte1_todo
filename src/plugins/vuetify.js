import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#735D78',
          secondary: '#B392AC',
          accent: '#D1B3C4',
          additional: '#E8C2CA',
          background: '#FCEFEE',
        },
      },
    },
  },
})