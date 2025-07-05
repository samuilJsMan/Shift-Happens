<template>
  <div class="wrapper">
    <div class="viewPort" :style="{transform:`translate(-${pageCount*105}%,0)`}">
      <div class="page" v-for="page in array" :style="{transform:`translate(${(page-1 as any)*105}%,0)`, opacity:pageCount===page-1?`1`:`0.2`}">
        <div class="text">
          {{ $t(`help[${page-1}]`) }}
        </div>
      </div>
    </div>
    <transition name="menu">
      <NavigationBlock v-if="navigationAsist">
        <div>{{$t(`assist[4]`)}}</div>
        <div>{{$t(`assist[5]`)}}</div>
      </NavigationBlock>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {ref,watch,onMounted} from "vue"
import NavigationBlock from "./NavigationBlock.vue"
import { useStore } from "../stores/store";
const store = useStore()
const navigationAsist=store.returnNavigationAsist()
const pageCount=ref(0)
const array=11
const currentWord=store.returnCurrentWord()

watch(currentWord,()=>{
  if((currentWord.value===`right`||currentWord.value===`вправо`)&&array-1>pageCount.value){
    pageCount.value++
  }
  if((currentWord.value===`left`||currentWord.value===`вліво`)&&pageCount.value>0){
    pageCount.value--
  }
})
onMounted(()=>{
  const screen=store.screenLog[store.screenLog.length-1]
  if(screen===`Battle`){
    pageCount.value=6
  }
  if(screen===`FreeRoom`||screen===`Chest`){
    pageCount.value=3
  }
  if(screen===`Shop`){
    pageCount.value=8
  }
  if(screen===`DrugStore`){
    pageCount.value=9
  }
  if(screen===`Inventory`){
    pageCount.value=4
  }

})
</script>

<style scoped lang="scss">
  .wrapper{
    position: relative;
    background-color: rgba(0,0,0,0.7);
    height: 50%;
    width: 60%;
    border-radius: 25px;
    padding: 15px;
    .viewPort{
      height: 100%;
      width: 100%;
      position: relative;
      transition: 0.5s;
      .page{
        transition: 0.5s;
        background-color: rgba(255, 228, 196, 0.6);
        height: 100%;
        width: 100%;
        border-radius: 20px;
        position: absolute;
        display: flex;
        align-items: center;
        padding: 30px;
        .text{
          font-size: 12px;
        }
      }
    }
  }
</style>
