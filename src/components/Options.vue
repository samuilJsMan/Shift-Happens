<template>
   <div class="menuWrapper">
    <div class="title">Options</div>
    <div class="buttons">
      <div class="btnWrapper">
        <div class="btn">{{$t(`menues[7]`)}}</div>
        <div class="check"><div class="box" :style="{opacity:fightAsist?`1`:`0`}"></div></div>
      </div>
      <div class="btnWrapper">
        <div class="btn">{{$t(`menues[8]`)}}</div>
        <div class="check"><div class="box" :style="{opacity:navigationAsist?`1`:`0`}"></div></div>
      </div>
      <div class="btnWrapper">
        <div class="btn">{{$t(`menues[9]`)}}</div>
        <div class="check"><div class="box" :style="{opacity:deviceAsist?`1`:`0`}"></div></div>
      </div>
      <div :class="[`btnWrapper`,{fade:isStarted}]">
        <div class="btn">English</div>
        <div class="swich"><div class="inner" :style="[{transform:language===`ua`?`translate(-4%, -50%)`:`translate(-97%, -50%)`}]"></div></div>
        <div class="btn">Українська</div>
      </div>
    </div>
    <transition name="menu">
      <NavigationBlock v-if="navigationAsist">

      </NavigationBlock>
    </transition>
  </div>
</template>

<script setup lang="ts">
import NavigationBlock from "./NavigationBlock.vue"
import { useStore } from "../stores/store";
const store = useStore()
const language=store.returnLanguage()
const fightAsist=store.returnFightAsist()
const deviceAsist=store.returnDeviceAsist()
const isStarted=store.returnIsStarted()
const navigationAsist=store.returnNavigationAsist()

</script>

<style scoped lang="scss">
.menuWrapper{
  position: relative;
  .title{
    font-size: 50px;
    color: rgb(168, 127, 94);
    -webkit-text-stroke: 2px black;
    text-shadow: 3px 3px 3px black;
    width: fit-content;
    margin: 0 auto;
    margin-bottom: 40px;
  }
  .buttons{
    background-color: rgba(255, 228, 196, 0.6);
    padding: 20px 30px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    font-size: 13px;
    .btnWrapper{
      display: flex;
      justify-content: space-between;
      position: relative;
      gap: 20px;
      .btn{
        width: fit-content;
        margin: 6px 0;
        padding: 8px 10px;
        background-color: rgb(255, 228, 196,0.3);
        border-radius: 7px;
        line-height: normal;
      }
      .check{
        align-self: center;
        height: 24px;
        background-color: rgb(255, 228, 196,1);
        aspect-ratio: 1/1;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        .box{
          opacity: 1;
          display: block;
          height: 20px;
          aspect-ratio: 1/1;
          border-radius: 5px;
          background-color: rgba(0, 128, 0,0.6);
          transition: 0.2s;
        }
      }
      .swich{
        align-self: center;
        height: 24px;
        background-color: rgb(255, 228, 196,1);
        aspect-ratio: 1.8/1;
        border-radius: 15px;
        position: relative;
        .inner{
          height: 20px;
          aspect-ratio: 1/1;
          border-radius: 50%;
          background-color: rgba(0, 128, 0,0.6);
          position: absolute;
          top: 50%;
          left: 50%;
          transition: 0.3s;
        }
      }
    }
    .fade{
      opacity: 0.5;
    }
  }
}
.menu-enter-from,.menu-leave-to{
  opacity: 0;
}
.menu-leave-from, .menu-enter-to{
  opacity: 1;
}
.menu-enter-active,.menu-leave-active{
  transition: 0.3s;
}
</style>
