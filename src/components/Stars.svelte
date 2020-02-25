<script>
  export let starsOpacity0To1;
  let stars = [];

  (() => {
    const tempStars = [];
    for (let i = 0; i < 20; i++) {
      tempStars.push(
        `transform:scale(${Math.random()}) translate(${Math.random() *
          100}vw, ${Math.random() * 85}vh)`
      );
    }

    stars = [...tempStars];
  })();
</script>

<style type="text/scss">
  .stars {
    .star {
      fill: #cafbff;
      position: absolute;
      top: 0;
      left: 0;
      width: 3vh;
      height: 3vh;
    }
  }
</style>

<div class="stars" style="opacity:{starsOpacity0To1}">
  {#each stars as starStyle}
    <svg class="star" viewBox="0 0 32 32" style={starStyle}>
      <path
        d="M21.557 14.914l-3.635-0.528-1.625-3.293-1.625 3.293-3.635 0.528 2.63
        2.564-0.621 3.62 3.251-1.709 3.251 1.709-0.621-3.62z" />
    </svg>
  {/each}
</div>
