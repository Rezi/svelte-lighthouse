<style type="text/scss">
  @import "../variables.scss";

  :global(html) {
    background-color: $color-bg-sky-bottom;
  }

  .about {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(
      0deg,
      $color-bg-sky-bottom 0%,
      $color-bg-sky-top 100%
    );
    position: relative;
  }

  .back {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 1rem;

    z-index: 2;

    svg {
      fill: $color-active;
      width: 2rem;
      height: 2rem;
    }
  }

  .text {
    font-size: 1.1rem;
    color: $color-base;
    padding: 4rem 2rem;
  }
</style>

<svelte:head>
  <title>About</title>
</svelte:head>

<section class="about">
  <a href="/" class="back">
    <svg width="512" height="512" viewBox="0 0 512 512">
      <title>Back</title>

      <path
        d="M201.373 438.627l-160-160c-12.497-12.496-12.497-32.758
        0-45.255l160-160c12.497-12.496 32.758-12.496 45.255 0s12.497 32.758 0
        45.255l-105.373 105.373h306.745c17.673 0 32 14.327 32 32s-14.327 32-32
        32h-306.745l105.373 105.373c6.248 6.248 9.372 14.438 9.372 22.627s-3.124
        16.379-9.372 22.627c-12.497 12.497-32.758 12.497-45.255 0z" />
    </svg>

  </a>

  <div class="text">
    <h2>About the weather app</h2>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus
    atque ipsa quibusdam. Vel aut suscipit vitae cupiditate amet illo expedita
    consectetur quo animi tempora, omnis illum, cum id, laudantium maxime.
    Asperiores fuga nam fugit necessitatibus tempora ipsa! Voluptatum et quis,
    molestiae quos magni hic necessitatibus nobis voluptates aliquam, placeat
    nesciunt. At cupiditate eaque doloribus rem molestiae odio laboriosam rerum
    asperiores. Soluta sapiente similique tempora aspernatur consectetur
    voluptatibus pariatur fugit distinctio amet at nulla nemo itaque repudiandae
    exercitationem, magnam excepturi quaerat est. Vero obcaecati quo amet
    voluptatum itaque modi incidunt laboriosam. Magnam, omnis sint, dolorum
    accusantium qui, officiis minima voluptatum nostrum error illo eligendi
    soluta doloribus. Quasi, quibusdam in. Nisi ducimus debitis quam iure
    eveniet cupiditate natus doloremque, totam voluptas deleniti! Placeat veniam
    quo architecto ullam, eveniet molestias doloremque maiores esse fugiat in
    quibusdam animi deleniti, consequatur accusantium ipsum voluptas aspernatur
    porro quas expedita sed vel amet obcaecati? Eum, hic officia? Laudantium
    labore est provident quo fugit. Alias pariatur beatae ratione doloremque
    explicabo sint minus, itaque odit expedita ad quos magnam officia animi
    reiciendis, ab culpa quisquam porro, quis nam saepe? Suscipit, ratione
    similique repudiandae debitis corrupti minima officiis distinctio fugit
    blanditiis et quibusdam, labore perspiciatis facere eligendi! Distinctio in
    dignissimos labore sit debitis, laborum neque eligendi, repellendus quo
    magni dolores? Eveniet, tempore illum officiis neque natus praesentium
    exercitationem, cumque error quisquam dignissimos optio expedita vero.
    Similique ad, voluptas atque assumenda error, minus enim fuga laborum,
    facere exercitationem sequi a. Ratione?
  </div>
</section>
