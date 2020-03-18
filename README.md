# The weather app

## Install & Run

```bash
npm install
npm run dev
```

### About the weather app

This app was developed to prove, that production ready SPA app with reasonable UX quality can reach max (100%) [lighthouse score](https://web.dev/measure/)

Please DON'T use this app as your weather forecast app, it has limited
numer of requests allowed to free weather forecast by [openweathermap.org/](https://openweathermap.org/) (60 requests per hour)

### List of features:

- PWA - works offline with cached data
- Is installable on phone as web app
- Search forecast by city
- Remember searched cities
- Each of six main weather parameters can be visualized as a chart
- Show forecast via animated scenery (generated clouds with different
  size, opacity and color based on rain, cloudiness and sun angle)
- Show animated rain and show fall, based on its intensity
- Show animated thunderstorms
- Show times of sun/moon rise/set and animate sun/moon accordingly
- Show sun/moon directions from Eeast to West
- Show sun/moon angle above horizon based on time and period of year
- Show phases of moon in realtime
