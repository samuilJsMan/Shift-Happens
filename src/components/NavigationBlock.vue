<template>
  <div class="NAblock">
    <slot></slot>
    <div v-if="currentScreen!==`FreeRoom`&&currentScreen!==`Battle`">{{$t(`assist[2]`)}}</div>
    <div v-if="currentScreen!==`Help`">{{$t(`assist[0]`)}}</div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "../stores/store";
const store = useStore()
const currentScreen=store.returnCurrenScreen()
</script>

<style lang="scss">
  .NAblock{
    position: absolute;
    top: 100%;
    display: flex;
    gap: 10px;
    width: 100%;
    padding-top: 10px;
    display: flex;
    justify-content: center;
    white-space: nowrap;
  }
  .NAblock>*{
    background-color: rgba(255, 228, 196, 0.6);
    padding: 2px 10px;
    border-radius: 7px;
    width: fit-content;
    white-space: nowrap;
  }
</style>
