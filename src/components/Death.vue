<template>
  <div class="menuWrapper">
    <div class="title">
      You Are Dead
    </div>
    <div class="button">Restart</div>
    <div class="button">Exit</div>
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
    margin-bottom: 40px;
    text-align:center;
  }
  .button{
    width: fit-content;
    margin: 6px auto;
    padding: 5px 15px;
    background-color: rgb(255, 228, 196,0.7);
    border-radius: 7px;
  }
}
</style>
