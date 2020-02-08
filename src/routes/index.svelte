<style>
  h1,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  figure {
    margin: 0 0 1em 0;
  }

  img {
    width: 100%;
    max-width: 400px;
    margin: 0 0 1em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>Sapper project template</title>
  <meta name="description" content="Welcome to sapper app" />
</svelte:head>

<h1>Great success!</h1>

<figure>
  <img
    sizes="(max-width: 400px) 100vw, 400px"
    srcset=" great-success_dbsixb_c_scale,w_190.webp 190w,
    great-success_dbsixb_c_scale,w_400.webp 400w"
    src="great-success_dbsixb_c_scale,w_400.webp"
    alt="" />
  <figcaption>HIGH FIVE!</figcaption>
</figure>

<p>
  <strong>
    Try editing this file (src/routes/index.svelte) to test live reloading.
  </strong>
</p>
