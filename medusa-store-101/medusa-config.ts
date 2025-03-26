import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import path from "path"

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },

  modules: [
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          // default provider
          {
            resolve: "@medusajs/medusa/fulfillment-manual",
            id: "manual",
          },
          // internal provider
          {
            resolve: path.join(__dirname, "../medusa-plugin-shipping/src/providers/spikarfx-fulfillment"),
            id: "spikarfx-fulfillment",
            options: {
              orsApiKey: process.env.ORS_API_KEY,
            },
          },
          // external provider
          // {
          //   resolve: "medusa-plugin-shipping/providers/spikarfx-fulfillment",
          //   id: "spikarfx-fulfillment",
          //   options: {
          //     orsApiKey: process.env.ORS_API_KEY,
          //   },
          // },
        ],
      },
    },
  ],

  // plugins: [
  //   {
  //     resolve: "medusa-plugin-shipping",
  //     options: {
  //       providers: [
  //         {
  //           resolve: "./providers/spikarfx-fulfillment",
  //           id: "spikarfx-fulfillment",
  //           options: {
  //             orsApiKey: process.env.ORS_API_KEY,
  //           },
  //         },
  //       ],
  //     },
  //   }
  // ],
})
