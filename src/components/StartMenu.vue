<template>
  <div class="menuWrapper">
    <div class="title">
      <div class="word first">Shift</div>
      <div class="word second">Happens</div>
    </div>
    <div class="buttons">
      <div class="start">Start</div>
      <div class="tutorial">Tutorial</div>
      <div class="options">Options</div>
      <div class="credits">Credits</div>
      <!-- <div class="kikstarter">Kickstarter</div> -->
      <div class="exit">Exit</div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.menuWrapper{
  .title{
    font-size: 50px;
    color: rgb(168, 127, 94);
    -webkit-text-stroke: 2px black;
    text-shadow: 3px 3px 3px black;
    width: 450px;
    margin: 0 auto;
    margin-bottom: 40px;
    .word{
      width: fit-content;
    }
    .first{
      margin-right: auto;
    }
    .second{
      margin-left: auto;
    }
  }
  .buttons{
    background-color: rgba(255, 228, 196, 0.6);
    padding: 10px 40px;
    border-radius: 20px;
    width: fit-content;
    margin: 0 auto;
  }
  .buttons>*{
    width: fit-content;
    margin: 6px auto;
    padding: 2px 10px;
    background-color: rgb(255, 228, 196,0.3);
    border-radius: 7px;
  }
}
</style>
