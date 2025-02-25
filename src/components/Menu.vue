<template>
  <div class="menuWrapper">
    <div class="buttons">
      <div class="continue">Continue</div>
      <div class="restart">Restart</div>
      <div class="tutorial">Tutorial</div>
      <div class="options">Options</div>
      <div class="menu">Main Menu</div>
      <div class="exit">Exit</div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.menuWrapper{
  display: flex;
  justify-content: center;
  align-items: center;
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
