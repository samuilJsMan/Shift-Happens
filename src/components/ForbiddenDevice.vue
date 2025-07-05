<template>
  <div class="card">
    <div class="title">
      {{$t(`forbiddeDevice[0]`)}}
    </div>
    <div class="text">
      {{$t(`forbiddeDevice[1]`)}}
      <br>
      Shift Happens<sup>TM</sup>{{$t(`forbiddeDevice[2]`)}}
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .card{
    font-size: 13px;
    max-width: 85%;
    padding: 20px;
    background-color: rgba(255, 228, 196, 0.6);
    border-radius: 20px;
  }
  .title{
    text-align: center;
    font-size: 20px;
    margin-bottom: 20px;
  }
</style>