<template>
  <div class="menuWrapper">
    <div class="buttons">
      <div class="continue">{{$t(`menues[4]`)}}</div>
      <div class="restart">{{$t(`menues[5]`)}}</div>
      <div class="tutorial">{{$t(`menues[1]`)}}</div>
      <div class="options">{{$t(`menues[2]`)}}</div>
      <div class="menu">{{$t(`menues[6]`)}}</div>
      <!-- <div class="exit">{{$t(`menues[3]`)}}</div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.menuWrapper{
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>
